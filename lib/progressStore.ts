'use client';

import { createClient } from './supabase/client';

export interface StickerBadge {
  id: string;
  name: string;
  icon: string;
  theme: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const ALL_STICKERS: StickerBadge[] = [
  { id: 'rexy', name: 'Rexy T-Rex', icon: '🦖', theme: 'dino', unlocked: true },
  { id: 'trike', name: 'Trike Triceratops', icon: '🦕', theme: 'dino', unlocked: false },
  { id: 'steggy', name: 'Steggy Stegosaurus', icon: '🐊', theme: 'dino', unlocked: false },
  { id: 'hoops', name: 'Hoops Basketball', icon: '🏀', theme: 'sports', unlocked: false },
  { id: 'striker', name: 'Striker Soccer', icon: '⚽', theme: 'sports', unlocked: false },
  { id: 'slugger', name: 'Slugger Baseball', icon: '⚾', theme: 'sports', unlocked: false },
  { id: 'castle', name: 'King Castle', icon: '🏰', theme: 'legos', unlocked: false },
  { id: 'rocket', name: 'Galaxy One', icon: '🚀', theme: 'legos', unlocked: false },
  { id: 'bot', name: 'Brick Bot', icon: '🤖', theme: 'legos', unlocked: false },
  { id: 'diggy', name: 'Diggy Excavator', icon: '🚜', theme: 'construction', unlocked: false },
  { id: 'dumper', name: 'Dump Truck', icon: '🚚', theme: 'construction', unlocked: false },
  { id: 'tower', name: 'Crane Tower', icon: '🏗️', theme: 'construction', unlocked: false },
];

const LOCAL_STORAGE_KEY = 'spark_kids_progress_store';

export function loadProgressStore() {
  if (typeof window === 'undefined') {
    return { stars: 0, skillElo: 100, unlockedStickers: ['rexy'] };
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }
  return { stars: 0, skillElo: 100, unlockedStickers: ['rexy'] };
}

export function saveProgressStore(data: { stars: number; skillElo: number; unlockedStickers: string[] }) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }

  // Auto Sync to Supabase if authenticated
  syncToSupabase(data);
}

async function syncToSupabase(data: { stars: number; skillElo: number; unlockedStickers: string[] }) {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) return;

    // Upsert to children table
    await supabase.from('children').upsert({
      parent_id: userData.user.id,
      stars: data.stars,
      skill_elo: data.skillElo,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Supabase sync skipped (guest mode)', e);
  }
}
