-- Supabase schema for calls table
create extension if not exists "pgcrypto";

create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  call_id text unique not null,
  agent_id text,
  phone_number text,
  status text check (status in ('completed','failed')) not null default 'completed',
  duration int,
  recording_url text,
  transcript jsonb,
  activity_logs jsonb,
  cost numeric(10,6),
  conversation_type text,
  hangup_by text,
  event_timestamp timestamptz,
  last_updated timestamptz,
  summary text,
  recordings jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_calls_created_at on calls (created_at desc);
create index if not exists idx_calls_phone_number on calls (phone_number);

-- Safe alters for existing deployments
alter table calls add column if not exists conversation_type text;
alter table calls add column if not exists hangup_by text;
alter table calls add column if not exists event_timestamp timestamptz;
alter table calls add column if not exists last_updated timestamptz;
alter table calls add column if not exists summary text;
alter table calls add column if not exists recordings jsonb;
