-- Initial schema for AWS Inovasi E-Learning (Supabase / PostgreSQL)
-- Run this in Supabase SQL Editor.

-- Extensions
create extension if not exists pgcrypto;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Courses
create table if not exists public.courses (
  id text primary key,
  title text not null,
  author text not null,
  price numeric not null default 0,
  image text not null,
  description text,
  curriculum jsonb not null default '[]'::jsonb,
  modules jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backfill old rows that still store null arrays.
update public.courses
set
  curriculum = coalesce(curriculum, '[]'::jsonb),
  modules = coalesce(modules, '[]'::jsonb)
where curriculum is null or modules is null;

-- Modules (normalized table, optional for later migration from jsonb)
create table if not exists public.modules (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  ordering int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Module contents
create table if not exists public.module_contents (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  type text not null check (type in ('page', 'quiz')),
  content text not null,
  media_url text,
  video_url text,
  ordering int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Quiz questions
create table if not exists public.quiz_questions (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  module_id text not null references public.modules(id) on delete cascade,
  item_id text not null references public.module_contents(id) on delete cascade,
  question_text text not null,
  options jsonb not null,
  correct_option_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User courses
create table if not exists public.user_courses (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  status text not null check (status in ('active', 'completed')),
  progress numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- User progress
create table if not exists public.user_progress (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  module_id text references public.modules(id) on delete cascade,
  item_id text references public.module_contents(id) on delete cascade,
  completed boolean not null default false,
  score numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Certificates
create table if not exists public.certificates (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  certificate_url text,
  issued_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_courses_created_at on public.courses(created_at desc);
create index if not exists idx_modules_course_id on public.modules(course_id);
create index if not exists idx_module_contents_course_id on public.module_contents(course_id);
create index if not exists idx_module_contents_module_id on public.module_contents(module_id);
create index if not exists idx_quiz_questions_item_id on public.quiz_questions(item_id);
create index if not exists idx_user_courses_user_id on public.user_courses(user_id);
create index if not exists idx_user_courses_course_id on public.user_courses(course_id);
create index if not exists idx_user_progress_user_id on public.user_progress(user_id);
create index if not exists idx_user_progress_course_id on public.user_progress(course_id);
create index if not exists idx_certificates_user_id on public.certificates(user_id);

-- updated_at triggers

drop trigger if exists trg_users_set_updated_at on public.users;
create trigger trg_users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_courses_set_updated_at on public.courses;
create trigger trg_courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

drop trigger if exists trg_modules_set_updated_at on public.modules;
create trigger trg_modules_set_updated_at
before update on public.modules
for each row execute function public.set_updated_at();

drop trigger if exists trg_module_contents_set_updated_at on public.module_contents;
create trigger trg_module_contents_set_updated_at
before update on public.module_contents
for each row execute function public.set_updated_at();

drop trigger if exists trg_quiz_questions_set_updated_at on public.quiz_questions;
create trigger trg_quiz_questions_set_updated_at
before update on public.quiz_questions
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_courses_set_updated_at on public.user_courses;
create trigger trg_user_courses_set_updated_at
before update on public.user_courses
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_progress_set_updated_at on public.user_progress;
create trigger trg_user_progress_set_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();

-- Optional RLS (safe default: enable, no broad public access)
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.module_contents enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.user_courses enable row level security;
alter table public.user_progress enable row level security;
alter table public.certificates enable row level security;

-- NOTE:
-- API routes in this project currently use SUPABASE_SERVICE_ROLE_KEY,
-- so they bypass RLS by design on the server.
