import { create } from 'zustand';
import type { Drill, Practice } from '../services/supabase';
import { api } from '../services/supabase';

interface AppState {
    drills: Drill[];
    practices: Practice[];
    loading: boolean;
    error: string | null;
    fetchDrills: () => Promise<void>;
    fetchPractices: () => Promise<void>;
    addDrill: (drill: Omit<Drill, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
    updateDrill: (id: string, drill: Partial<Drill>) => Promise<void>;
    addPractice: (practice: Omit<Practice, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
    drills: [],
    practices: [],
    loading: false,
    error: null,

    fetchDrills: async () => {
        set({ loading: true, error: null });
        try {
            const drills = await api.drills.list();
            set({ drills, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchPractices: async () => {
        set({ loading: true, error: null });
        try {
            const practices = await api.practices.list();
            set({ practices, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addDrill: async (drill) => {
        set({ loading: true, error: null });
        try {
            const newDrill = await api.drills.create(drill);
            set((state) => ({ drills: [newDrill, ...state.drills], loading: false }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    updateDrill: async (id, drill) => {
        set({ loading: true, error: null });
        try {
            const updated = await api.drills.update(id, drill);
            set((state) => ({
                drills: state.drills.map((d) => (d.id === id ? updated : d)),
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addPractice: async (practice) => {
        set({ loading: true, error: null });
        try {
            const newPractice = await api.practices.create(practice);
            set((state) => ({ practices: [newPractice, ...state.practices], loading: false }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
