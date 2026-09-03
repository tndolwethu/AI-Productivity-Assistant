import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Trash2, Bot, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateChatResponse } from '@/lib/aiEngine';
import type { ChatMessage } from '@/lib/types';
import { Disclaimer, PageHeader } from '@/components/ui';

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function loadMessages() {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    if (data && data.length > 0) {
      setMessages(data);
    } else {
      // Welcome message
      const welcome = await supabase
        .from('chat_messages')
        .insert({
          role: 'assistant',
          content: "Hello! I'm your AI Workplace Productivity Assistant. I can help you with email drafting, meeting summaries, task planning, research, and general productivity questions. How can I assist you today?",
        })
        .select()
        .single();
      if (welcome.data) {
        setMessages([welcome.data]);
      }
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Save user message
    const { data: userMsg } = await supabase
      .from('chat_messages')
      .insert({ role: 'user', content: userMessage })
      .select()
      .single();

    if (userMsg) {
      setMessages((prev) => [...prev, userMsg]);
    }

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const conversationHistory = messages.map((m) => m.content);
    const response = generateChatResponse(userMessage, conversationHistory);

    const { data: assistantMsg } = await supabase
      .from('chat_messages')
      .insert({ role: 'assistant', content: response })
      .select()
      .single();

    if (assistantMsg) {
      setMessages((prev) => [...prev, assistantMsg]);
    }
    setLoading(false);
  }

  async function handleClear() {
    await supabase.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { data: welcome } = await supabase
      .from('chat_messages')
      .insert({
        role: 'assistant',
        content: "Hello! I'm your AI Workplace Productivity Assistant. I can help you with email drafting, meeting summaries, task planning, research, and general productivity questions. How can I assist you today?",
      })
      .select()
      .single();
    if (welcome) {
      setMessages([welcome]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const suggestions = [
    'Help me write a professional email',
    'Summarize my meeting notes',
    'Plan my week effectively',
    'Give me productivity tips',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="AI Chatbot Interface"
        subtitle="Interactive AI assistant for productivity guidance, quick answers, and workplace task assistance."
        icon={MessageSquare}
      />

      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-900">AI Assistant</span>
              <span className="text-xs text-green-500 ml-2 flex items-center gap-1 inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online
              </span>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-slate-200'
                    : 'bg-gradient-to-br from-rose-500 to-pink-600'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-slate-600" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-cyan-500 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !loading && (
          <div className="px-5 pb-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all resize-none"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2">
            <Disclaimer compact />
          </div>
        </div>
      </div>
    </div>
  );
}
