import { useState } from 'react';
import { FileText, Sparkles, Trash2, CheckCircle, AlertTriangle, Calendar, ListChecks } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateMeetingSummary } from '@/lib/aiEngine';
import type { MeetingSummary } from '@/lib/types';
import { Disclaimer, LoadingSpinner, PageHeader, EmptyState } from '@/components/ui';

export default function MeetingSummarizer() {
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<{
    summary: string;
    keyPoints: string[];
    actionItems: string[];
    deadlines: string[];
  } | null>(null);
  const [history, setHistory] = useState<MeetingSummary[]>([]);

  async function handleSummarize() {
    if (!notes.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const result = generateMeetingSummary(notes, title);
    setCurrentSummary(result);

    const { data } = await supabase
      .from('meeting_summaries')
      .insert({
        title: title || 'Untitled Meeting',
        summary: result.summary,
        key_points: result.keyPoints,
        action_items: result.actionItems,
        deadlines: result.deadlines,
      })
      .select()
      .single();
    if (data) {
      setHistory((prev) => [data, ...prev]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('meeting_summaries').delete().eq('id', id);
    setHistory((prev) => prev.filter((m) => m.id !== id));
  }

  function loadFromHistory(item: MeetingSummary) {
    setCurrentSummary({
      summary: item.summary,
      keyPoints: item.key_points,
      actionItems: item.action_items,
      deadlines: item.deadlines,
    });
    setTitle(item.title);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Paste raw meeting notes and let AI extract key points, action items, and deadlines automatically."
        icon={FileText}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Meeting Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Meeting Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Q3 Planning Sync"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Raw Meeting Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`Paste your meeting notes here...\n\ne.g., Today we discussed the Q3 roadmap. John agreed to send the budget report by Friday. Sarah will schedule a follow-up meeting next week. We decided to delay the product launch to October. Mark needs to review the design mockups by end of day tomorrow.`}
                  rows={12}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-y font-mono"
                />
                <div className="text-xs text-slate-400 mt-1">{notes.length} characters</div>
              </div>

              <button
                onClick={handleSummarize}
                disabled={!notes.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-sm rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing notes...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Summarize Meeting
                  </>
                )}
              </button>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Summaries</h3>
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="text-sm font-medium text-slate-700 truncate">{item.title}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(item.created_at).toLocaleDateString()} · {item.key_points.length} key points · {item.action_items.length} actions
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output */}
        <div>
          {loading ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <LoadingSpinner text="Extracting key points and action items..." />
            </div>
          ) : currentSummary ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5">
              {/* Summary */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Executive Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{currentSummary.summary}</p>
              </div>

              {/* Key Points */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-500" />
                  Key Points
                </h4>
                <ul className="space-y-2">
                  {currentSummary.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  Action Items
                </h4>
                <ul className="space-y-2">
                  {currentSummary.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deadlines */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  Deadlines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentSummary.deadlines.map((deadline, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg border border-orange-200"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {deadline}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <Disclaimer compact />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <EmptyState
                icon={FileText}
                title="No summary yet"
                description="Paste your meeting notes on the left and click Summarize Meeting to extract key points, action items, and deadlines."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
