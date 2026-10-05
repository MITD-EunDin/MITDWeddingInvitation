/**
 * Supabase service implementation
 * Only loaded when VITE_BACKEND_TYPE=supabase
 */

let supabaseClient: any = null;

async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  try {
    const { createClient } = await import('@supabase/supabase-js');

    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;

    supabaseClient = createClient(url, anonKey);
    return supabaseClient;
  } catch (e) {
    console.warn('[Supabase] Not configured or failed to init:', e);
    return null;
  }
}

export async function createSupabaseWishesService(): Promise<any> {
  const supabase = await initSupabase();
  if (!supabase) return null;

  let subscribers: Set<(wishes: any[]) => void> = new Set();
  let channel: any = null;

  const setupRealtime = () => {
    if (channel) return;
    channel = supabase
      .channel('wishes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wishes' },
        () => {
          fetchWishes().then((wishes) => subscribers.forEach((cb) => cb(wishes)));
        }
      )
      .subscribe();
  };

  const fetchWishes = async () => {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as any[];
  };

  setupRealtime();

  return {
    subscribe: (callback: (wishes: any[]) => void) => {
      subscribers.add(callback);
      fetchWishes().then(callback);
      return () => {
        subscribers.delete(callback);
        if (subscribers.size === 0 && channel) {
          supabase.removeChannel(channel);
          channel = null;
        }
      };
    },
    async add({ name, message }: { name: string; message: string }) {
      const { data, error } = await supabase
        .from('wishes')
        .insert({ name, message, created_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async getOnce() {
      return fetchWishes();
    },
  };
}

export async function createSupabaseHeartsService(): Promise<any> {
  const supabase = await initSupabase();
  if (!supabase) return null;

  let subscribers: Set<(count: number) => void> = new Set();
  let channel: any = null;

  const fetchCount = async () => {
    const { data, error } = await supabase
      .from('counters')
      .select('count')
      .eq('id', 'hearts')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.count ?? 0;
  };

  const setupRealtime = () => {
    if (channel) return;
    channel = supabase
      .channel('hearts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'counters', filter: 'id=eq.hearts' },
        (payload: any) => {
          const count = payload.new?.count ?? 0;
          subscribers.forEach((cb) => cb(count));
        }
      )
      .subscribe();
  };

  setupRealtime();

  return {
    subscribe: (callback: (count: number) => void) => {
      subscribers.add(callback);
      fetchCount().then(callback);
      return () => {
        subscribers.delete(callback);
        if (subscribers.size === 0 && channel) {
          supabase.removeChannel(channel);
          channel = null;
        }
      };
    },
    async increment() {
      const { data, error } = await supabase.rpc('increment_hearts');
      if (error) throw error;
      return data ?? 0;
    },
    async getOnce() {
      return fetchCount();
    },
  };
}

export async function createSupabaseRsvpService(): Promise<any> {
  const supabase = await initSupabase();
  if (!supabase) return null;

  return {
    async submit(payload: any) {
      const { error } = await supabase.from('rsvps').insert({
        ...payload,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      return { success: true, message: 'Cảm ơn bạn đã phản hồi!' };
    },
  };
}