import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListTodo,
  Search,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react';
import type { PageKey } from '@/lib/types';

const navItems: Array<{ key: PageKey; label: string; icon: typeof LayoutDashboard; description: string }> = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & recent activity' },
  { key: 'email', label: 'Email Generator', icon: Mail, description: 'Smart email drafting' },
  { key: 'meeting', label: 'Meeting Summarizer', icon: FileText, description: 'Summarize meeting notes' },
  { key: 'tasks', label: 'Task Planner', icon: ListTodo, description: 'AI-powered task planning' },
  { key: 'research', label: 'Research Assistant', icon: Search, description: 'AI research insights' },
  { key: 'chatbot', label: 'AI Chatbot', icon: MessageSquare, description: 'Interactive AI assistant' },
];

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  const handleNavigate = (page: PageKey) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white px-4 h-14 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-14 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-slate-900 text-white z-40
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          w-72
        `}
      >
        {/* Logo / Header */}
        <div className={`flex items-center gap-3 px-6 h-16 border-b border-slate-800 ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}>
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">AI Workplace</span>
              <span className="text-xs text-slate-400 leading-tight">Productivity Assistant</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-bold text-sm block leading-tight">AI Workplace</span>
                <span className="text-xs text-slate-400 leading-tight">Productivity Assistant</span>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden lg:flex absolute top-20 -right-3 w-6 h-6 bg-cyan-500 rounded-full items-center justify-center text-white shadow-md hover:bg-cyan-600 transition-colors z-10`}
          aria-label="Collapse sidebar"
        >
          {isCollapsed ? <Menu className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
        </button>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white shadow-sm border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }
                  ${isCollapsed ? 'lg:justify-center' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? 'text-cyan-400' : 'group-hover:scale-110'}`}
                />
                {!isCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight">{item.label}</div>
                    <div className="text-xs text-slate-500 leading-tight truncate">{item.description}</div>
                  </div>
                )}
                {isActive && !isCollapsed && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                )}
              </button>
            );
          })}

          {/* Disclaimer at bottom */}
          {!isCollapsed && (
            <div className="pt-6 mt-6 border-t border-slate-800">
              <div className="flex items-start gap-2 px-3 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  AI-generated content may require human review.
                </p>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
