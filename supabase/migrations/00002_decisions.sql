-- aicapital.ee: AI-Guided Judgment & Decision Support
-- Migration: 00002_decisions
-- Tables: decisions, scenarios, evidence, frameworks, decision_journal

-- Decisions being analyzed
create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id),
  user_id uuid references auth.users(id),
  title text not null,
  context text,
  status text default 'open' check (status in ('open', 'analyzing', 'decided', 'reviewed', 'archived')),
  decision_type text check (decision_type in ('strategic', 'operational', 'investment', 'hiring', 'product', 'technical')),
  outcome text,
  decided_at timestamptz,
  review_date timestamptz,
  created_at timestamptz default now()
);

-- Scenarios modeled for a decision
create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid references public.decisions(id) on delete cascade,
  name text not null,
  description text,
  assumptions jsonb default '[]',
  projected_outcomes jsonb default '{}',
  probability numeric check (probability >= 0 and probability <= 1),
  score numeric,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Evidence collected for a decision
create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid references public.decisions(id) on delete cascade,
  source_type text not null check (source_type in ('document', 'data', 'expert', 'research', 'internal', 'market')),
  content text not null,
  relevance_score integer check (relevance_score >= 1 and relevance_score <= 10),
  sentiment text check (sentiment in ('positive', 'negative', 'neutral', 'mixed')),
  added_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Reusable decision frameworks
create table if not exists public.frameworks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id),
  name text not null,
  framework_type text not null check (framework_type in ('weighted_matrix', 'pros_cons', 'decision_tree', 'scenario_planning', 'swot', 'custom')),
  config jsonb default '{}',
  is_template boolean default false,
  created_at timestamptz default now()
);

-- Decision journal for tracking reasoning over time
create table if not exists public.decision_journal (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid references public.decisions(id) on delete cascade,
  user_id uuid references auth.users(id),
  entry_type text not null check (entry_type in ('reasoning', 'update', 'reflection', 'outcome_review', 'lesson_learned')),
  content text not null,
  confidence_level integer check (confidence_level >= 1 and confidence_level <= 10),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.decisions enable row level security;
alter table public.scenarios enable row level security;
alter table public.evidence enable row level security;
alter table public.frameworks enable row level security;
alter table public.decision_journal enable row level security;

-- RLS Policies
create policy "Org members can manage decisions"
  on public.decisions for all
  using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

create policy "Decision access for scenarios"
  on public.scenarios for all
  using (
    decision_id in (
      select id from public.decisions
      where org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Decision access for evidence"
  on public.evidence for all
  using (
    decision_id in (
      select id from public.decisions
      where org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );

create policy "Org members can manage frameworks"
  on public.frameworks for all
  using (
    org_id in (select org_id from public.profiles where id = auth.uid())
  );

-- Template frameworks are readable by all authenticated users
create policy "Read template frameworks"
  on public.frameworks for select
  using (is_template = true and auth.role() = 'authenticated');

create policy "Decision access for journal"
  on public.decision_journal for all
  using (
    decision_id in (
      select id from public.decisions
      where org_id in (select org_id from public.profiles where id = auth.uid())
    )
  );
