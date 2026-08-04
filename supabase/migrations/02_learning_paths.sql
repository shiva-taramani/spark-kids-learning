-- Migration 02: Dynamic Generic Learning Paths & Student Path Mastery

-- 1. Learning Paths Table
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  target_age_group TEXT DEFAULT 'all',
  component_type TEXT DEFAULT 'generic_quiz',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read learning paths"
  ON public.learning_paths FOR SELECT
  USING (true);

-- Insert Initial Learning Paths
INSERT INTO public.learning_paths (id, title, icon, target_age_group, component_type, description)
VALUES
  ('math', '🧮 Math', '🧮', 'all', 'ten_frame', 'Active manipulative Singapore Math Ten-Frames.'),
  ('words', '🔤 Words', '🔤', 'all', 'phonics', 'Interactive CVC sight words and letter tiles.'),
  ('circuits', '⚡ Circuits', '⚡', 'age8', 'circuits', 'Interactive AA battery electronics & LED safety.'),
  ('astronomy', '🚀 Space', '🚀', 'age8', 'generic_quiz', 'Planets, orbits, and space physics.')
ON CONFLICT (id) DO NOTHING;

-- 2. Student Path Mastery Table
CREATE TABLE IF NOT EXISTS public.student_path_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  path_id TEXT REFERENCES public.learning_paths(id) ON DELETE CASCADE NOT NULL,
  mastery_percentage FLOAT DEFAULT 0.0,
  last_played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.student_path_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view mastery of own children"
  ON public.student_path_mastery FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.children
      WHERE public.children.id = public.student_path_mastery.child_id
      AND public.children.parent_id = auth.uid()
    )
  );
