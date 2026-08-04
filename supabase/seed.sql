-- Supabase Database Seed File: Spark Kids Learning Paths & Modules

-- 1. Insert Core Learning Paths
INSERT INTO public.learning_paths (id, title, icon, target_age_group, component_type, description)
VALUES
  (
    'math',
    '🧮 Math',
    '🧮',
    'all',
    'ten_frame',
    'Singapore Math Ten-Frame place-value visual addition and counting.'
  ),
  (
    'words',
    '🔤 Words',
    '🔤',
    'all',
    'phonics',
    'Interactive CVC sight words and letter sound phonics tiles.'
  ),
  (
    'circuits',
    '⚡ Circuits',
    '⚡',
    'age8',
    'circuits',
    'AA battery electronics, red (+) & black (-) wire safety, switches, and LEDs.'
  ),
  (
    'astronomy',
    '🚀 Space',
    '🚀',
    'age8',
    'generic_quiz',
    'Planets, Solar System orbits, gravity, and rocket science.'
  ),
  (
    'robotics',
    '🤖 Coding',
    '🤖',
    'age8',
    'generic_quiz',
    'Sequential algorithms, loops, and conditional if/else robot instructions.'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  target_age_group = EXCLUDED.target_age_group,
  component_type = EXCLUDED.component_type,
  description = EXCLUDED.description;

-- 2. Insert Sample Learning Modules / Lessons
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id TEXT REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for learning_modules
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read learning modules"
  ON public.learning_modules FOR SELECT
  USING (true);

INSERT INTO public.learning_modules (path_id, title, difficulty_level, config)
VALUES
  (
    'circuits',
    'Lesson 1: Short Circuit Prevention',
    1,
    '{"question": "Why should red (+) and black (-) wires never touch directly without a light bulb or switch?", "options": ["Causes a short circuit that heats the battery", "Makes the room dark", "Slows down time"], "correctIdx": 0}'::jsonb
  ),
  (
    'circuits',
    'Lesson 2: Switches and Open Circuits',
    1,
    '{"question": "What happens when you flip a switch to OFF in a circuit?", "options": ["It breaks the path so electricity stops flowing", "It makes electricity flow faster", "It changes the wire color"], "correctIdx": 0}'::jsonb
  ),
  (
    'astronomy',
    'Lesson 1: Planets of the Solar System',
    1,
    '{"question": "Which is the largest planet in our Solar System?", "options": ["Jupiter 🪐", "Mars 🔴", "Earth 🌍", "Mercury ⚪"], "correctIdx": 0}'::jsonb
  ),
  (
    'astronomy',
    'Lesson 2: Gravity and Orbits',
    2,
    '{"question": "What force keeps the Earth orbiting around the Sun?", "options": ["Sun Gravity ☀️", "Wind 🌬️", "Magnetism 🧲"], "correctIdx": 0}'::jsonb
  ),
  (
    'robotics',
    'Lesson 1: What is a Repeat Loop?',
    1,
    '{"question": "What does a REPEAT 4 times loop do for a robot?", "options": ["Executes the instruction 4 times in a row 🔄", "Turns the robot off 🛑", "Changes robot color 🎨"], "correctIdx": 0}'::jsonb
  );
