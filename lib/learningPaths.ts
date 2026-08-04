'use client';

import { createClient } from './supabase/client';

export interface LearningPath {
  id: string;
  title: string;
  icon: string;
  targetAge: 'age4' | 'age6' | 'age8' | 'all';
  componentType: 'ten_frame' | 'phonics' | 'circuits' | 'generic_quiz';
  description: string;
}

export const BUILTIN_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'math',
    title: '🧮 Math',
    icon: '🧮',
    targetAge: 'all',
    componentType: 'ten_frame',
    description: 'Active manipulative Singapore Math Ten-Frames for place-value addition.',
  },
  {
    id: 'words',
    title: '🔤 Words',
    icon: '🔤',
    targetAge: 'all',
    componentType: 'phonics',
    description: 'Interactive CVC sight words and letter phonics sound tiles.',
  },
  {
    id: 'circuits',
    title: '⚡ Circuits',
    icon: '⚡',
    targetAge: 'age8',
    componentType: 'circuits',
    description: 'Interactive AA battery electronics, switch toggles, and LED safety.',
  },
  {
    id: 'astronomy',
    title: '🚀 Space',
    icon: '🚀',
    targetAge: 'age8',
    componentType: 'generic_quiz',
    description: 'Explore planets, orbits, and space physics.',
  },
];

export async function fetchAllLearningPaths(): Promise<LearningPath[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('learning_paths').select('*');
    if (data && data.length > 0) {
      const dbPaths: LearningPath[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        icon: item.icon || '📚',
        targetAge: item.target_age_group || 'all',
        componentType: item.component_type || 'generic_quiz',
        description: item.description || '',
      }));
      
      // Merge unique paths
      const mergedMap = new Map<string, LearningPath>();
      BUILTIN_LEARNING_PATHS.forEach((p) => mergedMap.set(p.id, p));
      dbPaths.forEach((p) => mergedMap.set(p.id, p));
      return Array.from(mergedMap.values());
    }
  } catch (e) {
    console.error('Fetching DB paths skipped (using built-in registry)', e);
  }
  return BUILTIN_LEARNING_PATHS;
}
