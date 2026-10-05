/**
 * Real-time backend services abstraction
 * Swap implementation: 'mock' | 'firebase' | 'supabase'
 *
 * This file uses dynamic imports to avoid bundling Firebase/Supabase
 * when not needed. The actual implementations are in firebase.ts and supabase.ts.
 */

import type { WishItem, RsvpPayload } from '../types/wedding';

// ============================================
// Types
// ============================================

export interface RealtimeWishesService {
  subscribe: (callback: (wishes: WishItem[]) => void) => () => void;
  add: (input: { name: string; message: string }) => Promise<WishItem>;
  getOnce: () => Promise<WishItem[]>;
}

export interface RealtimeHeartsService {
  subscribe: (callback: (count: number) => void) => () => void;
  increment: () => Promise<number>;
  getOnce: () => Promise<number>;
}

export interface RealtimeRsvpService {
  submit: (payload: RsvpPayload) => Promise<{ success: boolean; message: string }>;
  subscribeStats?: (callback: (stats: { yes: number; no: number; total: number }) => void) => () => void;
}

// ============================================
// Mock Implementation (default - no dependencies)
// ============================================

function createMockWishesService(initial: WishItem[]): RealtimeWishesService {
  let store = [...initial];
  let subscribers: Set<(wishes: WishItem[]) => void> = new Set();

  const notify = () => {
    const sorted = [...store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    subscribers.forEach((cb) => cb(sorted));
  };

  return {
    subscribe: (callback) => {
      subscribers.add(callback);
      callback([...store].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      return () => subscribers.delete(callback);
    },
    async add({ name, message }) {
      await new Promise((r) => setTimeout(r, 500));
      const wish: WishItem = {
        id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name,
        message,
        createdAt: new Date().toISOString(),
      };
      store = [wish, ...store];
      notify();
      return wish;
    },
    async getOnce() {
      await new Promise((r) => setTimeout(r, 300));
      return [...store].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  };
}

function createMockHeartsService(initialCount: number): RealtimeHeartsService {
  let count = initialCount;
  let subscribers: Set<(count: number) => void> = new Set();

  const notify = () => subscribers.forEach((cb) => cb(count));

  return {
    subscribe: (callback) => {
      subscribers.add(callback);
      callback(count);
      return () => subscribers.delete(callback);
    },
    async increment() {
      await new Promise((r) => setTimeout(r, 200));
      count += 1;
      notify();
      return count;
    },
    async getOnce() {
      await new Promise((r) => setTimeout(r, 100));
      return count;
    },
  };
}

function createMockRsvpService(): RealtimeRsvpService {
  return {
    async submit(payload) {
      await new Promise((r) => setTimeout(r, 700));
      console.info('[RSVP mock] Received:', payload);
      return { success: true, message: 'Cảm ơn bạn đã phản hồi!' };
    },
  };
}

// ============================================
// Factory - Choose implementation at runtime
// ============================================

type BackendType = 'mock' | 'firebase' | 'supabase';

function getBackendType(): BackendType {
  const env = import.meta.env.VITE_BACKEND_TYPE;
  if (env === 'firebase' || env === 'supabase') return env;
  if (import.meta.env.VITE_FIREBASE_API_KEY) return 'firebase';
  if (import.meta.env.VITE_SUPABASE_URL) return 'supabase';
  return 'mock';
}

let wishesServiceCache: RealtimeWishesService | null = null;
let heartsServiceCache: RealtimeHeartsService | null = null;
let rsvpServiceCache: RealtimeRsvpService | null = null;

// Use dynamic import with variable to prevent Vite static analysis
async function loadFirebaseServices() {
  // This import is dynamic and uses a variable, so Vite won't analyze it at build time
  const mod = await import('./firebase');
  return mod;
}

async function loadSupabaseServices() {
  const mod = await import('./supabase');
  return mod;
}

export async function getRealtimeWishesService(mockData: WishItem[]): Promise<RealtimeWishesService> {
  if (wishesServiceCache) return wishesServiceCache;

  const backend = getBackendType();

  if (backend === 'firebase') {
    const firebase = await loadFirebaseServices();
    wishesServiceCache = (await firebase.createFirebaseWishesService()) ?? createMockWishesService(mockData);
  } else if (backend === 'supabase') {
    const supabase = await loadSupabaseServices();
    wishesServiceCache = (await supabase.createSupabaseWishesService()) ?? createMockWishesService(mockData);
  } else {
    wishesServiceCache = createMockWishesService(mockData);
  }

  console.info(`[Realtime] Using ${backend} backend for wishes`);
  return wishesServiceCache;
}

export async function getRealtimeHeartsService(initialCount: number): Promise<RealtimeHeartsService> {
  if (heartsServiceCache) return heartsServiceCache;

  const backend = getBackendType();

  if (backend === 'firebase') {
    const firebase = await loadFirebaseServices();
    heartsServiceCache = (await firebase.createFirebaseHeartsService()) ?? createMockHeartsService(initialCount);
  } else if (backend === 'supabase') {
    const supabase = await loadSupabaseServices();
    heartsServiceCache = (await supabase.createSupabaseHeartsService()) ?? createMockHeartsService(initialCount);
  } else {
    heartsServiceCache = createMockHeartsService(initialCount);
  }

  console.info(`[Realtime] Using ${backend} backend for hearts`);
  return heartsServiceCache;
}

export async function getRealtimeRsvpService(): Promise<RealtimeRsvpService> {
  if (rsvpServiceCache) return rsvpServiceCache;

  const backend = getBackendType();

  if (backend === 'firebase') {
    const firebase = await loadFirebaseServices();
    rsvpServiceCache = (await firebase.createFirebaseRsvpService()) ?? createMockRsvpService();
  } else if (backend === 'supabase') {
    const supabase = await loadSupabaseServices();
    rsvpServiceCache = (await supabase.createSupabaseRsvpService()) ?? createMockRsvpService();
  } else {
    rsvpServiceCache = createMockRsvpService();
  }

  console.info(`[Realtime] Using ${backend} backend for RSVP`);
  return rsvpServiceCache;
}

export function resetRealtimeServices() {
  wishesServiceCache = null;
  heartsServiceCache = null;
  rsvpServiceCache = null;
}