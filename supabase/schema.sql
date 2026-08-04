-- Dino & Friends Learning Platform - Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Children / Student Profiles Table
CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  child_name TEXT NOT NULL,
  target_age_group TEXT DEFAULT 'age6',
  preferred_theme TEXT DEFAULT 'dino',
  stars INTEGER DEFAULT 0,
  skill_elo INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Children
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children"
  ON public.children FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own children"
  ON public.children FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update own children"
  ON public.children FOR UPDATE
  USING (auth.uid() = parent_id);

-- 3. Learning Progress Logs
CREATE TABLE IF NOT EXISTS public.progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  accuracy_rate FLOAT DEFAULT 1.0,
  questions_solved INTEGER DEFAULT 1,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Progress Logs
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view progress of own children"
  ON public.progress_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children
      WHERE public.children.id = public.progress_logs.child_id
      AND public.children.parent_id = auth.uid()
    )
  );

-- Trigger to auto-create profile on Auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, parent_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
