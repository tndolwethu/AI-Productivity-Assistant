import { useState } from 'react';
import { Search, Sparkles, Trash2, Lightbulb, BookOpen, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateResearchSummary } from '@/lib/aiEngine';
import type { ResearchNote } from '@/lib/types';
import { Disclaimer, LoadingSpinner, PageHeader, EmptyState, CopyButton } from '@/components/ui';

export default function ResearchAssistant() {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResearch, setCurrentResearch] = useState<{
    summary: string;
    insights: string[];
  } | null>(null);
  const [history, setHistory] = useState<ResearchNote[]>([]);

  async function handleResearch() {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const result = generateResearchSummary(topic, context);
    setCurrentResearch(result);

    const { data } = await supabase
      .from('research_notes')
      .insert({
        topic: topic.trim(),
        summary: result.summary,
        insights: result.insights,
      })
      .select()
      .single();
    if (data) {
      setHistory((prev) => [data, ...prev]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('research_notes').delete().eq('id', id);
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }

  function loadFromHistory(item: ResearchNote) {
    setCurrentResearch({ summary: item.summary, insights: item.insights });
    setTopic(item.topic);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="AI Research Assistant"
        subtitle="Get structured insights and summaries on any topic with AI-powered research analysis."
        icon={Search}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4">Research Query</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Research Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., AI in healthcare, remote work trends"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Additional Context (optional)</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g., I'm looking at this from a startup perspective with limited resources..."
                  rows={5}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={handleResearch}
                disabled={!topic.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium text-sm rounded-xl hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Research
                  </>
                )}
              </button>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 mt-4">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Research</h3>
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
                      <div className="text-sm font-medium text-slate-700 truncate">{item.topic}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()} · {item.insights.length} insights
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
        <div className="lg:col-span-3">
          {loading ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <LoadingSpinner text="Analyzing topic and generating insights..." />
            </div>
          ) : currentResearch ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                  <h3 className="font-semibold text-slate-900">Research Summary</h3>
                </div>
                <CopyButton
                  text={`${currentResearch.summary}\n\nKey Insights:\n${currentResearch.insights.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}`}
                />
              </div>

              {/* Summary */}
              <div className="bg-violet-50/50 rounded-xl p-4 border border-violet-100">
                <p className="text-sm text-slate-700 leading-relaxed">{currentResearch.summary}</p>
              </div>

              {/* Insights */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Key Insights
                </h4>
                <div className="space-y-3">
                  {currentResearch.insights.map((insight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50/30 transition-all"
                    >
                      <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed">{insight}</p>
                    </div>
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
                icon={Search}
                title="No research generated yet"
                description="Enter a research topic on the left and click Generate Research to get AI-powered insights and a structured summary."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
