import { useState } from 'react';
import { ListTodo, Sparkles, Trash2, Clock, Flag, Calendar, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateTaskPlan } from '@/lib/aiEngine';
import type { PlannedTask } from '@/lib/types';
import { Disclaimer, LoadingSpinner, PageHeader, EmptyState } from '@/components/ui';

const priorityStyles: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
  high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'High' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Medium' },
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', label: 'Low' },
};

const statusConfig: Record<string, { icon: typeof Circle; label: string }> = {
  todo: { icon: Circle, label: 'To Do' },
  'in-progress': { icon: Loader2, label: 'In Progress' },
  done: { icon: CheckCircle2, label: 'Done' },
};

export default function TaskPlanner() {
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [constraints, setConstraints] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<PlannedTask[]>([]);

  async function handleGenerate() {
    if (!goal.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const plan = generateTaskPlan({ goal, timeframe, constraints });

    const inserts = plan.map((t) => ({
      title: t.title,
      description: t.description,
      priority: t.priority,
      estimated_time: t.estimatedTime,
      scheduled_for: t.scheduledFor,
      status: 'todo' as const,
    }));

    const { data } = await supabase
      .from('planned_tasks')
      .insert(inserts)
      .select();

    if (data) {
      setTasks((prev) => [...data, ...prev]);
    }
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: string) {
    await supabase.from('planned_tasks').update({ status }).eq('id', id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: status as PlannedTask['status'] } : t))
    );
  }

  async function handleDelete(id: string) {
    await supabase.from('planned_tasks').delete().eq('id', id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleClearAll() {
    if (tasks.length === 0) return;
    const ids = tasks.map((t) => t.id);
    await supabase.from('planned_tasks').delete().in('id', ids);
    setTasks([]);
  }

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="AI Task Planner"
        subtitle="Break down your goals into prioritized, scheduled, actionable tasks with AI-powered planning."
        icon={ListTodo}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4">Plan Parameters</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Goal / Objective</label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Prepare quarterly business report"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Timeframe</label>
                <input
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="e.g., 3 days, 1 week"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Constraints (optional)</label>
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="e.g., Limited budget, team of 3"
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!goal.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-medium text-sm rounded-xl hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Planning tasks...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Task Plan
                  </>
                )}
              </button>
            </div>

            {/* Quick stats */}
            {tasks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xl font-bold text-slate-700">{todoCount}</div>
                    <div className="text-xs text-slate-400">To Do</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-700">{inProgressCount}</div>
                    <div className="text-xs text-slate-400">In Progress</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-700">{doneCount}</div>
                    <div className="text-xs text-slate-400">Done</div>
                  </div>
                </div>
                <button
                  onClick={handleClearAll}
                  className="w-full mt-4 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Clear All Tasks
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task list */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <LoadingSpinner text="Breaking down your goal into actionable tasks..." />
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task, index) => {
                const ps = priorityStyles[task.priority] || priorityStyles.medium;
                const sc = statusConfig[task.status] || statusConfig.todo;
                const StatusIcon = sc.icon;

                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl p-5 border-2 transition-all ${
                      task.status === 'done' ? 'border-green-200 opacity-75' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status toggle */}
                      <button
                        onClick={() => {
                          const next = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
                          handleStatusChange(task.id, next);
                        }}
                        className="mt-0.5 flex-shrink-0 hover:scale-110 transition-transform"
                        title={`Status: ${sc.label} — click to advance`}
                      >
                        <StatusIcon
                          className={`w-5 h-5 ${
                            task.status === 'todo' ? 'text-slate-300' :
                            task.status === 'in-progress' ? 'text-amber-500 animate-spin' :
                            'text-green-500'
                          }`}
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-semibold text-slate-900 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                            {index + 1}. {task.title}
                          </h4>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-3">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${ps.bg} ${ps.text} ${ps.border} border`}>
                            <Flag className="w-3 h-3" />
                            {ps.label}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600">
                            <Clock className="w-3 h-3" />
                            {task.estimated_time}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                            <Calendar className="w-3 h-3" />
                            {task.scheduled_for}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2">
                <Disclaimer compact />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <EmptyState
                icon={ListTodo}
                title="No tasks planned yet"
                description="Enter your goal and timeframe on the left, then click Generate Task Plan to break it down into actionable, prioritized steps."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
