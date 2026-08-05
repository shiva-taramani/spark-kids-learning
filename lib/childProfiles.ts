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
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      return localData;
    }

    // Ensure parent profile exists in profiles table
    await supabase.from('profiles').upsert({
      id: userData.user.id,
      email: userData.user.email || '',
      full_name: userData.user.user_metadata?.full_name || '',
      updated_at: new Date().toISOString(),
    });

    const { data: remoteChildren, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', userData.user.id);

    if (error) {
      console.error('Error fetching children from Supabase:', error);
      return localData;
    }

    if (remoteChildren && remoteChildren.length > 0) {
      const fetchedProfiles: ChildProfile[] = remoteChildren.map((c) => ({
        id: c.id,
        name: c.child_name || 'Child',
        ageGroup: c.target_age_group || 'age6',
        preferredTheme: c.preferred_theme || 'dino',
        stars: c.stars || 0,
        skillElo: c.skill_elo || 100,
        unlockedStickers: ['rexy'],
      }));

      const activeId = localData.profiles.some((p) => p.id === localData.activeId)
        ? localData.activeId
        : fetchedProfiles[0].id;

      saveLocalProfiles(fetchedProfiles, activeId);
      return { profiles: fetchedProfiles, activeId };
    } else {
      // If parent has no children in DB yet, sync any local children to DB
      for (const child of localData.profiles) {
        await syncChildToSupabase(child);
      }
    }
  } catch (e) {
    console.error('Failed to load child profiles from Supabase', e);
  }
  return localData;
}

export async function createChildProfile(
  name: string,
  ageGroup: string = 'age6',
  preferredTheme: string = 'dino'
): Promise<ChildProfile> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  const newChild: ChildProfile = {
    id: `child-${Date.now()}`,
    name,
    ageGroup,
    preferredTheme,
    stars: 0,
    skillElo: 100,
    unlockedStickers: ['rexy'],
  };

  if (userData && userData.user) {
    const { data, error } = await supabase
      .from('children')
      .insert({
        parent_id: userData.user.id,
        child_name: name,
        target_age_group: ageGroup,
        preferred_theme: preferredTheme,
        stars: 0,
        skill_elo: 100,
      })
      .select()
      .single();

    if (!error && data) {
      newChild.id = data.id;
    }
  }

  const { profiles, activeId } = loadLocalProfiles();
  const updatedProfiles = [...profiles.filter((p) => !p.id.startsWith('guest-')), newChild];
  saveLocalProfiles(updatedProfiles, newChild.id);
  return newChild;
}

export async function syncChildToSupabase(child?: ChildProfile) {
  if (!child) return;
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return;

    const payload: any = {
      parent_id: userData.user.id,
      child_name: child.name,
      target_age_group: child.ageGroup,
      preferred_theme: child.preferredTheme,
      stars: child.stars,
      skill_elo: child.skillElo,
      updated_at: new Date().toISOString(),
    };

    if (!child.id.startsWith('guest-') && !child.id.startsWith('child-')) {
      payload.id = child.id;
    }

    const { data } = await supabase.from('children').upsert(payload).select().single();
    if (data && data.id) {
      child.id = data.id;
    }
  } catch (e) {
    console.error('Supabase child sync skipped', e);
  }
}
