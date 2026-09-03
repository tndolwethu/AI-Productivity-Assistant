import { useState, useEffect } from 'react';
import {
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import type { PageKey } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface DashboardProps {
  onNavigate: (page: PageKey) => void;
}

interface Stats {
  emails: number;
  meetings: number;
  tasks: number;
  research: number;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({ emails: 0, meetings: 0, tasks: 0, research: 0 });
  const [recentEmails, setRecentEmails] = useState<Array<{ id: string; subject: string; created_at: string }>>([]);
  const [recentTasks, setRecentTasks] = useState<Array<{ id: string; title: string; priority: string; status: string }>>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [emails, meetings, tasks, research] = await Promise.all([
      supabase.from('email_drafts').select('*', { count: 'exact', head: true }),
      supabase.from('meeting_summaries').select('*', { count: 'exact', head: true }),
      supabase.from('planned_tasks').select('*', { count: 'exact', head: true }),
      supabase.from('research_notes').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      emails: emails.count || 0,
      meetings: meetings.count || 0,
      tasks: tasks.count || 0,
      research: research.count || 0,
    });

    const { data: recentEmail } = await supabase
      .from('email_drafts')
      .select('id, subject, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    setRecentEmails(recentEmail || []);

    const { data: recentTask } = await supabase
      .from('planned_tasks')
      .select('id, title, priority, status')
      .order('created_at', { ascending: false })
      .limit(4);
    setRecentTasks(recentTask || []);
  }

  const features: Array<{ key: PageKey; title: string; description: string; icon: typeof Mail; color: string }> = [
    {
      key: 'email',
      title: 'Smart Email Generator',
      description: 'Draft professional emails with customizable tone and audience targeting.',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      key: 'meeting',
      title: 'Meeting Notes Summarizer',
      description: 'Extract key points, action items, and deadlines from raw meeting notes.',
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      key: 'tasks',
      title: 'AI Task Planner',
      description: 'Break down goals into prioritized, scheduled, actionable tasks.',
      icon: ListTodo,
      color: 'from-orange-500 to-amber-500',
    },
    {
      key: 'research',
      title: 'AI Research Assistant',
      description: 'Get structured insights and summaries on any research topic.',
      icon: Search,
      color: 'from-violet-500 to-purple-500',
    },
    {
      key: 'chatbot',
      title: 'AI Chatbot Interface',
      description: 'Interactive AI assistant for productivity guidance and quick answers.',
      icon: MessageSquare,
      color: 'from-rose-500 to-pink-500',
    },
  ];

  const statCards = [
    { label: 'Emails Generated', value: stats.emails, icon: Mail, color: 'text-blue-600 bg-blue-50' },
    { label: 'Meetings Summarized', value: stats.meetings, icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Tasks Planned', value: stats.tasks, icon: ListTodo, color: 'text-orange-600 bg-orange-50' },
    { label: 'Research Notes', value: stats.research, icon: Search, color: 'text-violet-600 bg-violet-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-cyan-500" />
          <span className="text-sm font-medium text-cyan-600">Welcome back</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Workplace Productivity Assistant</h1>
        <p className="text-slate-500 max-w-2xl">
          Automate your daily workplace tasks with AI — generate emails, summarize meetings, plan tasks,
          conduct research, and chat with an AI assistant, all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Feature Cards */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-slate-400" />
        AI Tools
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.key}
              onClick={() => onNavigate(feature.key)}
              className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5 group-hover:text-slate-700">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{feature.description}</p>
              <div className="flex items-center gap-1 text-sm font-medium text-cyan-600 group-hover:gap-2 transition-all">
                Open tool
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Emails */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              Recent Emails
            </h3>
            <button
              onClick={() => onNavigate('email')}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
            >
              View all
            </button>
          </div>
          {recentEmails.length > 0 ? (
            <div className="space-y-3">
              {recentEmails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onNavigate('email')}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{email.subject}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(email.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No emails generated yet.</p>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-orange-500" />
              Recent Tasks
            </h3>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
            >
              View all
            </button>
          </div>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 truncate">{task.title}</div>
                    <div className="text-xs text-slate-400 capitalize">{task.priority} priority · {task.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-6 text-center">No tasks planned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
