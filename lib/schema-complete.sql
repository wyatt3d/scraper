-- ============================================
-- Scraper.bot Complete Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================
-- Order: independent tables first, then FK-dependent tables

-- Flows table
CREATE TABLE IF NOT EXISTS flows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('extract', 'interact', 'monitor')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'paused', 'draft', 'error')),
  steps JSONB DEFAULT '[]'::jsonb,
  output_schema JSONB DEFAULT '{}'::jsonb,
  schedule JSONB,
  version INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT false,
  success_rate NUMERIC DEFAULT 0,
  total_runs INTEGER DEFAULT 0,
  avg_duration NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_run_at TIMESTAMPTZ
);

-- Runs table (depends on flows)
CREATE TABLE IF NOT EXISTS runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id UUID NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration NUMERIC,
  items_extracted INTEGER DEFAULT 0,
  screenshots JSONB,
  error TEXT,
  output_preview JSONB,
  logs JSONB DEFAULT '[]'::jsonb,
  cost NUMERIC DEFAULT 0
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  prefix TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  scopes TEXT[] DEFAULT '{}'::text[]
);

-- Alerts table (depends on flows)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id UUID REFERENCES flows(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('change_detected', 'threshold', 'error', 'schedule_missed')),
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{}'::text[],
  secret TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ
);

-- Secrets table
CREATE TABLE IF NOT EXISTS secrets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'custom',
  encrypted_value TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  browser TEXT NOT NULL DEFAULT 'chrome',
  location TEXT DEFAULT 'auto',
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('active', 'paused', 'idle')),
  persona JSONB,
  cookies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'executed', 'viewed', 'error')),
  resource_type TEXT NOT NULL,
  resource_name TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'bug',
  severity TEXT NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT DEFAULT '',
  page_url TEXT DEFAULT '',
  email TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table (queue system)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_flows_status ON flows(status);
CREATE INDEX IF NOT EXISTS idx_flows_mode ON flows(mode);
CREATE INDEX IF NOT EXISTS idx_runs_flow_id ON runs(flow_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_started_at ON runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_flow_id ON alerts(flow_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_at ON jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_pending_scheduled ON jobs(scheduled_at) WHERE status = 'pending';

-- ============================================
-- Add user_id columns to user-owned tables
-- ============================================

ALTER TABLE flows ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE runs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE secrets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_flows_user_id ON flows(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_user_id ON runs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_secrets_user_id ON secrets(user_id);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- User-owned tables: restrict to owner (NULL user_id allowed during migration)
DROP POLICY IF EXISTS "public_flows" ON flows;
CREATE POLICY "users_own_flows" ON flows FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "public_runs" ON runs;
CREATE POLICY "users_own_runs" ON runs FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "public_api_keys" ON api_keys;
CREATE POLICY "users_own_api_keys" ON api_keys FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "public_webhooks" ON webhooks;
CREATE POLICY "users_own_webhooks" ON webhooks FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "public_sessions" ON sessions;
CREATE POLICY "users_own_sessions" ON sessions FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "public_secrets" ON secrets;
CREATE POLICY "users_own_secrets" ON secrets FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Alerts: open for now (references flows, not users directly)
DROP POLICY IF EXISTS "public_alerts" ON alerts;
CREATE POLICY "users_own_alerts" ON alerts FOR ALL
  USING (true)
  WITH CHECK (true);

-- System tables: service role only
DROP POLICY IF EXISTS "public_audit_log" ON audit_log;
CREATE POLICY "service_audit_log" ON audit_log FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "public_jobs" ON jobs;
CREATE POLICY "service_jobs" ON jobs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Tickets: anyone can create, anyone can read
DROP POLICY IF EXISTS "public_tickets" ON tickets;
CREATE POLICY "anyone_create_tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "own_tickets" ON tickets FOR SELECT USING (true);

-- ============================================
-- Atomic queue functions (prevent race conditions)
-- ============================================

-- Atomic job claim function (prevents race conditions)
CREATE OR REPLACE FUNCTION claim_next_job()
RETURNS SETOF jobs AS $$
  UPDATE jobs
  SET status = 'processing',
      started_at = NOW(),
      attempts = attempts + 1
  WHERE id = (
    SELECT id FROM jobs
    WHERE status = 'pending'
      AND scheduled_at <= NOW()
    ORDER BY scheduled_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$ LANGUAGE sql;

-- Atomic job fail with retry logic
CREATE OR REPLACE FUNCTION fail_job(job_id UUID, error_message TEXT)
RETURNS jobs AS $$
  UPDATE jobs
  SET status = CASE WHEN attempts >= max_attempts THEN 'failed' ELSE 'pending' END,
      error = error_message,
      started_at = NULL
  WHERE id = job_id
  RETURNING *;
$$ LANGUAGE sql;

-- ============================================
-- Seed data (5 starter flows)
-- ============================================

INSERT INTO flows (name, description, url, mode, status, steps, output_schema, success_rate, total_runs, avg_duration) VALUES
  ('Amazon Product Monitor', 'Track prices on Amazon search results', 'https://www.amazon.com/s?k=wireless+headphones', 'monitor', 'active',
   '[{"id":"s1","type":"navigate","label":"Go to search results"},{"id":"s2","type":"wait","label":"Wait for grid"},{"id":"s3","type":"extract","label":"Extract products","extractionRules":[{"field":"title","selector":"h2 a span","transform":"text"},{"field":"price","selector":".a-price .a-offscreen","transform":"text"}]}]'::jsonb,
   '{"title":"string","price":"string"}'::jsonb, 98.5, 248, 12400),
  ('Indeed Job Scraper', 'Extract job listings from Indeed', 'https://www.indeed.com/jobs?q=software+engineer&l=remote', 'extract', 'active',
   '[{"id":"s1","type":"navigate","label":"Go to Indeed"},{"id":"s2","type":"extract","label":"Extract jobs","extractionRules":[{"field":"title","selector":".jobTitle a span","transform":"text"},{"field":"company","selector":"[data-testid=company-name]","transform":"text"}]}]'::jsonb,
   '{"title":"string","company":"string"}'::jsonb, 96.2, 412, 28600),
  ('Zillow Property Monitor', 'Monitor listings in Austin TX', 'https://www.zillow.com/austin-tx/', 'monitor', 'active',
   '[{"id":"s1","type":"navigate","label":"Go to Zillow"},{"id":"s2","type":"extract","label":"Extract properties","extractionRules":[{"field":"address","selector":"[data-test=property-card-addr]","transform":"text"},{"field":"price","selector":"[data-test=property-card-price]","transform":"text"}]}]'::jsonb,
   '{"address":"string","price":"string"}'::jsonb, 99.1, 45, 8200),
  ('Hacker News Scraper', 'Extract top stories from HN', 'https://news.ycombinator.com/', 'extract', 'active',
   '[{"id":"s1","type":"navigate","label":"Go to HN"},{"id":"s2","type":"extract","label":"Extract stories","extractionRules":[{"field":"title","selector":".titleline a","transform":"text"},{"field":"points","selector":".score","transform":"text"}]}]'::jsonb,
   '{"title":"string","points":"string"}'::jsonb, 99.8, 1024, 3200),
  ('GitHub Trending', 'Track trending repos', 'https://github.com/trending', 'extract', 'active',
   '[{"id":"s1","type":"navigate","label":"Go to Trending"},{"id":"s2","type":"extract","label":"Extract repos","extractionRules":[{"field":"name","selector":"h2.h3.lh-condensed a","transform":"text"},{"field":"description","selector":"p.col-9","transform":"text"}]}]'::jsonb,
   '{"name":"string","description":"string"}'::jsonb, 99.5, 680, 4500);
