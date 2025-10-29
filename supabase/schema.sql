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
  created_at timestamptz default now()
);

create index if not exists idx_calls_created_at on calls (created_at desc);
create index if not exists idx_calls_phone_number on calls (phone_number);
