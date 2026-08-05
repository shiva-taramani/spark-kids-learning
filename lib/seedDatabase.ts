import { createClient } from './supabase/server';

export async function autoSeedDatabase() {
  try {
    const supabase = createClient();

    // Check if learning_paths table has data
    const { data: existingPaths, error: fetchError } = await supabase.from('learning_paths').select('id');

    if (fetchError || !existingPaths || existingPaths.length === 0) {
      console.log('Seeding initial learning paths into Supabase database...');

      // Seed Paths
      await supabase.from('learning_paths').upsert([
        {
          id: 'math',
          title: '🧮 Math',
          icon: '🧮',
          target_age_group: 'all',
          component_type: 'ten_frame',
          description: 'Singapore Math Ten-Frame place-value visual addition.',
        },
        {
          id: 'words',
          title: '🔤 Words',
          icon: '🔤',
          target_age_group: 'all',
          component_type: 'phonics',
          description: 'Interactive CVC sight words and letter phonics sound tiles.',
        },
        {
          id: 'circuits',
          title: '⚡ Circuits',
          icon: '⚡',
          target_age_group: 'age8',
          component_type: 'circuits',
          description: 'AA battery electronics, red (+) & black (-) wire safety, switches, and LEDs.',
        },
        {
          id: 'astronomy',
          title: '🚀 Space',
          icon: '🚀',
          target_age_group: 'age8',
          component_type: 'generic_quiz',
          description: 'Planets, Solar System orbits, gravity, and rocket science.',
        },
        {
          id: 'robotics',
          title: '🤖 Coding',
          icon: '🤖',
          target_age_group: 'age8',
          component_type: 'generic_quiz',
          description: 'Sequential algorithms, loops, and conditional if/else robot instructions.',
        },
      ]);

      // Seed Modules
      await supabase.from('learning_modules').upsert([
        {
          path_id: 'circuits',
          title: 'Lesson 1: Short Circuit Prevention',
          difficulty_level: 1,
          config: {
            question: 'Why should red (+) and black (-) wires never touch directly without a light bulb or switch?',
            options: ['Causes a short circuit that heats the battery', 'Makes the room dark', 'Slows down time'],
            correctIdx: 0,
          },
        },
        {
          path_id: 'astronomy',
          title: 'Lesson 1: Planets of the Solar System',
          difficulty_level: 1,
          config: {
            question: 'Which is the largest planet in our Solar System?',
            options: ['Jupiter 🪐', 'Mars 🔴', 'Earth 🌍', 'Mercury ⚪'],
            correctIdx: 0,
          },
        },
        {
          path_id: 'robotics',
          title: 'Lesson 1: What is a Repeat Loop?',
          difficulty_level: 1,
          config: {
            question: 'What does a REPEAT 4 times loop do for a robot?',
            options: ['Executes the instruction 4 times in a row 🔄', 'Turns the robot off 🛑', 'Changes robot color 🎨'],
            correctIdx: 0,
          },
        },
      ]);

      console.log('Automated Supabase database seeding complete! ✅');
    }
  } catch (e) {
    console.error('Auto-seed check error:', e);
  }
}
