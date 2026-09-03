import { AlertCircle } from 'lucide-react';

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>AI-generated content may require human review.</span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-amber-800 leading-relaxed">
        AI-generated content may require human review. Please verify all output for accuracy,
        tone, and appropriateness before using in professional contexts.
      </p>
    </div>
  );
}

export function LoadingSpinner({ text = 'Generating...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200" />
        <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin absolute inset-0" />
      </div>
      <p className="text-sm text-slate-500 animate-pulse">{text}</p>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: typeof AlertCircle;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>
      <p className="text-slate-500 text-sm ml-13 pl-13" style={{ paddingLeft: '3.25rem' }}>{subtitle}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof AlertCircle;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{description}</p>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
    >
      Copy
    </button>
  );
}
