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

export async function fetchUserChildProfiles(): Promise<{ profiles: ChildProfile[]; activeId: string }> {
  const localData = loadLocalProfiles();
  try {
    const res = await fetch('/api/children');
    if (res.ok) {
      const data = await res.json();
      if (data.children && data.children.length > 0) {
        const fetchedProfiles: ChildProfile[] = data.children.map((c: any) => ({
          id: c.id,
          name: c.childName || 'Child',
          ageGroup: c.targetAgeGroup || 'age6',
          preferredTheme: c.preferredTheme || 'dino',
          stars: c.stars || 0,
          skillElo: c.skillElo || 100,
          unlockedStickers: ['rexy'],
        }));

        const activeId = localData.profiles.some((p) => p.id === localData.activeId)
          ? localData.activeId
          : fetchedProfiles[0].id;

        saveLocalProfiles(fetchedProfiles, activeId);
        return { profiles: fetchedProfiles, activeId };
      } else {
        // If parent has local children but none in DB, sync local children to DB via API
        for (const child of localData.profiles) {
          await syncChildToSupabase(child);
        }
      }
    }
  } catch (e) {
    console.error('Failed to load child profiles from API', e);
  }
  return localData;
}

export async function createChildProfile(
  name: string,
  ageGroup: string = 'age6',
  preferredTheme: string = 'dino'
): Promise<ChildProfile> {
  const newChild: ChildProfile = {
    id: `child-${Date.now()}`,
    name,
    ageGroup,
    preferredTheme,
    stars: 0,
    skillElo: 100,
    unlockedStickers: ['rexy'],
  };

  try {
    const res = await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childName: name,
        targetAgeGroup: ageGroup,
        preferredTheme,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.child && data.child.id) {
        newChild.id = data.child.id;
      }
    } else {
      console.error('API create child returned non-ok status:', res.status);
    }
  } catch (e) {
    console.error('API create child exception:', e);
  }

  const { profiles } = loadLocalProfiles();
  const updatedProfiles = [...profiles.filter((p) => !p.id.startsWith('guest-')), newChild];
  saveLocalProfiles(updatedProfiles, newChild.id);
  return newChild;
}

export async function syncChildToSupabase(child?: ChildProfile) {
  if (!child || child.id.startsWith('guest-')) return;
  try {
    await fetch('/api/children', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: child.id.startsWith('child-') ? undefined : child.id,
        childName: child.name,
        targetAgeGroup: child.ageGroup,
        preferredTheme: child.preferredTheme,
        stars: child.stars,
        skillElo: child.skillElo,
      }),
    });
  } catch (e) {
    console.error('API sync child exception', e);
  }
}
