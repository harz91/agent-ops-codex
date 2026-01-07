CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  environment TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  latency_ms INTEGER,
  token_usage JSONB,
  cost_usd NUMERIC,
  external_reference TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES runs(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb
);
