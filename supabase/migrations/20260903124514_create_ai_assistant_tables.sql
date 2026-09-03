/*
# Create AI Workplace Productivity Assistant Tables

## Overview
Creates 5 tables to persist user-generated AI content for the AI Workplace Productivity Assistant.
This is a single-tenant app with no sign-in screen, so all policies allow anon + authenticated access.

## New Tables

1. `email_drafts` — Stores generated emails
2. `meeting_summaries` — Stores meeting note summaries
3. `planned_tasks` — Stores AI-planned tasks
4. `research_notes` — Stores research assistant output
5. `chat_messages` — Stores chatbot conversation history

## Security
- RLS enabled on all tables.
- All policies use `TO anon, authenticated` since this is a no-auth single-tenant app.
- Full CRUD allowed for all roles on all tables (data is intentionally shared/public).
*/

CREATE TABLE IF NOT EXISTS email_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  recipient text NOT NULL DEFAULT '',
  body text NOT NULL,
  tone text NOT NULL DEFAULT 'professional',
  audience text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_email_drafts" ON email_drafts;
CREATE POLICY "anon_select_email_drafts" ON email_drafts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_email_drafts" ON email_drafts;
CREATE POLICY "anon_insert_email_drafts" ON email_drafts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_email_drafts" ON email_drafts;
CREATE POLICY "anon_update_email_drafts" ON email_drafts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_email_drafts" ON email_drafts;
CREATE POLICY "anon_delete_email_drafts" ON email_drafts FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS meeting_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  key_points text[] DEFAULT '{}',
  action_items text[] DEFAULT '{}',
  deadlines text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meeting_summaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_meeting_summaries" ON meeting_summaries;
CREATE POLICY "anon_select_meeting_summaries" ON meeting_summaries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_meeting_summaries" ON meeting_summaries;
CREATE POLICY "anon_insert_meeting_summaries" ON meeting_summaries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_meeting_summaries" ON meeting_summaries;
CREATE POLICY "anon_update_meeting_summaries" ON meeting_summaries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_meeting_summaries" ON meeting_summaries;
CREATE POLICY "anon_delete_meeting_summaries" ON meeting_summaries FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS planned_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium',
  estimated_time text NOT NULL DEFAULT '',
  scheduled_for text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'todo',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE planned_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_planned_tasks" ON planned_tasks;
CREATE POLICY "anon_select_planned_tasks" ON planned_tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_planned_tasks" ON planned_tasks;
CREATE POLICY "anon_insert_planned_tasks" ON planned_tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_planned_tasks" ON planned_tasks;
CREATE POLICY "anon_update_planned_tasks" ON planned_tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_planned_tasks" ON planned_tasks;
CREATE POLICY "anon_delete_planned_tasks" ON planned_tasks FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS research_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  summary text NOT NULL,
  insights text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE research_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_research_notes" ON research_notes;
CREATE POLICY "anon_select_research_notes" ON research_notes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_research_notes" ON research_notes;
CREATE POLICY "anon_insert_research_notes" ON research_notes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_research_notes" ON research_notes;
CREATE POLICY "anon_update_research_notes" ON research_notes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_research_notes" ON research_notes;
CREATE POLICY "anon_delete_research_notes" ON research_notes FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat_messages" ON chat_messages;
CREATE POLICY "anon_update_chat_messages" ON chat_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);
