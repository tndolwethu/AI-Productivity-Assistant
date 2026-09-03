export interface EmailDraft {
  id: string;
  subject: string;
  recipient: string;
  body: string;
  tone: string;
  audience: string;
  created_at: string;
}

export interface MeetingSummary {
  id: string;
  title: string;
  summary: string;
  key_points: string[];
  action_items: string[];
  deadlines: string[];
  created_at: string;
}

export interface PlannedTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_time: string;
  scheduled_for: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
}

export interface ResearchNote {
  id: string;
  topic: string;
  summary: string;
  insights: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export type PageKey =
  | 'dashboard'
  | 'email'
  | 'meeting'
  | 'tasks'
  | 'research'
  | 'chatbot';
