# Supabase Schema (Draft)

This schema maps existing app data to Supabase tables. It is aligned with the current TypeScript models and localStorage usage.

## Auto Create Tables

Use SQL script in [supabase/schema.sql](supabase/schema.sql) from Supabase SQL Editor to create all tables, indexes, and triggers automatically.

## Tables

### users
- id (uuid, primary key)
- name (text)
- email (text)
- role (text, enum: "admin" | "user")
- created_at (timestamp, default now())
- updated_at (timestamp, default now())

### courses
- id (text, primary key)
- title (text)
- author (text)
- price (numeric)
- image (text)
- description (text, nullable)
- curriculum (jsonb, nullable)
- modules (jsonb, nullable)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())

### modules
- id (text, primary key)
- course_id (text, references courses.id)
- title (text)
- ordering (int)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())

### module_contents
- id (text, primary key)
- course_id (text, references courses.id)
- module_id (text, references modules.id)
- title (text)
- type (text, enum: "page" | "quiz")
- content (text)
- media_url (text, nullable)
- video_url (text, nullable)
- ordering (int)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())

### quiz_questions
- id (text, primary key)
- course_id (text, references courses.id)
- module_id (text, references modules.id)
- item_id (text, references module_contents.id)
- question_text (text)
- options (jsonb)
- correct_option_id (text)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())

### user_courses
- id (text, primary key)
- user_id (uuid, references users.id)
- course_id (text, references courses.id)
- status (text, enum: "active" | "completed")
- progress (numeric)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())

### user_progress
- id (text, primary key)
- user_id (uuid, references users.id)
- course_id (text, references courses.id)
- module_id (text, references modules.id)
- item_id (text, references module_contents.id)
- completed (boolean)
- score (numeric, nullable)
- updated_at (timestamp, default now())

### certificates
- id (text, primary key)
- user_id (uuid, references users.id)
- course_id (text, references courses.id)
- certificate_url (text, nullable)
- issued_at (timestamp, default now())
