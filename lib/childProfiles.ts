'use client';

import { createClient } from './supabase/client';

export interface ChildProfile {
  id: string;
  name: string;
  ageGroup: string; // 'age4' | 'age6' | 'age8'
  preferredTheme: string; // 'dino' | 'sports' | 'legos' | 'construction'
  stars: number;
  skillElo: number;
  unlockedStickers: string[];
}

const DEFAULT_CHILDREN: ChildProfile[] = [
  {
    id: 'guest-child-1',
    name: 'Player 1',
    ageGroup: 'age6',
    preferredTheme: 'dino',
    stars: 0,
    skillElo: 100,
    unlockedStickers: ['rexy'],
  },
];

const PROFILES_STORAGE_KEY = 'spark_kids_child_profiles';
const ACTIVE_CHILD_KEY = 'spark_kids_active_child_id';

export function loadLocalProfiles(): { profiles: ChildProfile[]; activeId: string } {
  if (typeof window === 'undefined') {
    return { profiles: DEFAULT_CHILDREN, activeId: DEFAULT_CHILDREN[0].id };
  }
  try {
    const rawProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    const activeId = localStorage.getItem(ACTIVE_CHILD_KEY) || DEFAULT_CHILDREN[0].id;
    if (rawProfiles) {
      const parsed = JSON.parse(rawProfiles);
      return { profiles: parsed.length > 0 ? parsed : DEFAULT_CHILDREN, activeId };
    }
  } catch (e) {
    console.error(e);
  }
  return { profiles: DEFAULT_CHILDREN, activeId: DEFAULT_CHILDREN[0].id };
}

export function saveLocalProfiles(profiles: ChildProfile[], activeId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    localStorage.setItem(ACTIVE_CHILD_KEY, activeId);
  } catch (e) {
    console.error(e);
  }

  // Auto Sync active profile to Supabase if authenticated
  syncChildToSupabase(profiles.find((p) => p.id === activeId));
}

export async function syncChildToSupabase(child?: ChildProfile) {
  if (!child) return;
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return;

    await supabase.from('children').upsert({
      id: child.id.startsWith('guest-') ? undefined : child.id,
      parent_id: userData.user.id,
      child_name: child.name,
      target_age_group: child.ageGroup,
      preferred_theme: child.preferredTheme,
      stars: child.stars,
      skill_elo: child.skillElo,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Supabase child sync skipped', e);
  }
}
