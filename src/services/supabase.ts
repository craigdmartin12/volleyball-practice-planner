import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Drill = {
    id: string;
    user_id: string;
    title: string;
    description: string;
    duration_minutes: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    category: 'Passing' | 'Attacking' | 'Setting' | 'Serving' | 'Defense' | 'Blocking' | 'Competition';
    tags: string[];
    diagram_url?: string;
    created_at: string;
};

export type Practice = {
    id: string;
    user_id: string;
    title: string;
    practice_date: string;
    notes: string;
    created_at: string;
};

export type PracticeItem = {
    id: string;
    practice_id: string;
    drill_id: string;
    sort_order: number;
    drills?: Drill;
};

export const api = {
    drills: {
        list: async () => {
            const { data, error } = await supabase
                .from('drills')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Drill[];
        },
        create: async (drill: Omit<Drill, 'id' | 'user_id' | 'created_at'>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('drills')
                .insert([{ ...drill, user_id: user.id }])
                .select()
                .single();
            if (error) throw error;
            return data as Drill;
        },
        update: async (id: string, drill: Partial<Drill>) => {
            const { data, error } = await supabase
                .from('drills')
                .update(drill)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data as Drill;
        },
        delete: async (id: string) => {
            const { error } = await supabase.from('drills').delete().eq('id', id);
            if (error) throw error;
        },
    },
    practices: {
        list: async () => {
            const { data, error } = await supabase
                .from('practices')
                .select('*')
                .order('practice_date', { ascending: false });
            if (error) throw error;
            return data as Practice[];
        },
        create: async (practice: Omit<Practice, 'id' | 'user_id' | 'created_at'>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('practices')
                .insert([{ ...practice, user_id: user.id }])
                .select()
                .single();
            if (error) throw error;
            return data as Practice;
        },
        getWithItems: async (id: string) => {
            const { data: practice, error: pError } = await supabase
                .from('practices')
                .select('*')
                .eq('id', id)
                .single();

            if (pError) throw pError;

            const { data: items, error: iError } = await supabase
                .from('practice_items')
                .select(`
          *,
          drills (*)
        `)
                .eq('practice_id', id)
                .order('sort_order', { ascending: true });

            if (iError) throw iError;

            return {
                ...practice,
                items: items as (PracticeItem & { drills: Drill })[],
            };
        },
        updateItems: async (practiceId: string, drillIds: string[]) => {
            // Simple strategy: delete all and re-insert
            const { error: dError } = await supabase
                .from('practice_items')
                .delete()
                .eq('practice_id', practiceId);

            if (dError) throw dError;

            const items = drillIds.map((drillId, index) => ({
                practice_id: practiceId,
                drill_id: drillId,
                sort_order: index,
            }));

            const { error: iError } = await supabase
                .from('practice_items')
                .insert(items);

            if (iError) throw iError;
        }
    }
};
