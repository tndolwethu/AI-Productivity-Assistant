import { useState } from 'react';
import { Mail, Send, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateEmail } from '@/lib/aiEngine';
import type { EmailDraft } from '@/lib/types';
import { Disclaimer, LoadingSpinner, PageHeader, EmptyState, CopyButton } from '@/components/ui';

const tones = ['professional', 'friendly', 'urgent', 'apologetic', 'persuasive', 'appreciative'];
const audiences = ['client', 'team', 'executive', 'external stakeholder', 'general'];

export default function EmailGenerator() {
  const [topic, setTopic] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState('professional');
  const [audience, setAudience] = useState('general');
  const [keyPoints, setKeyPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<{ subject: string; body: string } | null>(null);
  const [history, setHistory] = useState<EmailDraft[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 1200));
    const result = generateEmail({ topic, recipient, tone, audience, keyPoints });
    setCurrentEmail(result);

    const { data } = await supabase
      .from('email_drafts')
      .insert({
        subject: result.subject,
        recipient: recipient || 'Team',
        body: result.body,
        tone,
        audience,
      })
      .select()
      .single();
    if (data) {
      setHistory((prev) => [data, ...prev]);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await supabase.from('email_drafts').delete().eq('id', id);
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Smart Email Generator"
        subtitle="Generate professional emails with customizable tone and audience targeting using structured prompt engineering."
        icon={Mail}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4">Email Parameters</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic / Purpose</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quarterly project update and next steps"
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Recipient</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., John Smith, Marketing Team"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all bg-white"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all bg-white"
                  >
                    {audiences.map((a) => (
                      <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Key Points (comma or line separated)</label>
                <textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="e.g., Project is 80% complete, Budget is on track, Need approval for phase 2"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output panel */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <LoadingSpinner text="Crafting your professional email..." />
            </div>
          ) : currentEmail ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Generated Email</h3>
                <div className="flex items-center gap-2">
                  <CopyButton text={`Subject: ${currentEmail.subject}\n\n${currentEmail.body}`} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Subject</span>
                  <span className="text-sm font-semibold text-slate-900">{currentEmail.subject}</span>
                </div>
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {currentEmail.body}
                </pre>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Disclaimer compact />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <EmptyState
                icon={Mail}
                title="No email generated yet"
                description="Fill in the parameters on the left and click Generate Email to create a professional, AI-crafted email."
              />
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Emails</h3>
              <div className="space-y-2">
                {history.map((email) => (
                  <div key={email.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 truncate">{email.subject}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(email.created_at).toLocaleString()}
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 capitalize">{email.tone}</span>
                        </div>
                      </div>
                      {expandedId === email.id ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                    {expandedId === email.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                        <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
                          {email.body}
                        </pre>
                        <div className="flex items-center justify-between mt-3">
                          <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
                          <button
                            onClick={() => handleDelete(email.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
