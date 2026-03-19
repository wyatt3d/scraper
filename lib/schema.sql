-- ============================================
-- Scraper.bot Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================

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
  success_rate NUMERIC DEFAULT 0,
  total_runs INTEGER DEFAULT 0,
  avg_duration NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_run_at TIMESTAMPTZ
);

-- Runs table
CREATE TABLE IF NOT EXISTS runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id UUID REFERENCES flows(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration NUMERIC,
  items_extracted INTEGER DEFAULT 0,
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

-- Alerts table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_flows_status ON flows(status);
CREATE INDEX IF NOT EXISTS idx_flows_mode ON flows(mode);
CREATE INDEX IF NOT EXISTS idx_runs_flow_id ON runs(flow_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_alerts_flow_id ON alerts(flow_id);

-- Row Level Security (open for now)
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_flows" ON flows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_runs" ON runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_api_keys" ON api_keys FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_alerts" ON alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_webhooks" ON webhooks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_secrets" ON secrets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);

-- Seed 5 starter flows
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
