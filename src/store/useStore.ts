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
    // Builder Persistence
    builderDrills: (Drill & { instanceId: string })[];
    builderTitle: string;
    builderDate: string;
    setBuilderDrills: (drills: (Drill & { instanceId: string })[]) => void;
    setBuilderTitle: (title: string) => void;
    setBuilderDate: (date: string) => void;
    resetBuilder: () => void;
}

const getStoredBuilder = () => {
    try {
        const stored = localStorage.getItem('skyhawk_builder_state');
        if (stored) {
            const parsed = JSON.parse(stored);
            const today = new Date().toISOString().split('T')[0];
            // If the stored plan is for a past date, reset it
            if (parsed.date < today) return null;
            return parsed;
        }
    } catch (e) {
        return null;
    }
    return null;
};

const persistBuilder = (drills: any[], title: string, date: string) => {
    localStorage.setItem('skyhawk_builder_state', JSON.stringify({ drills, title, date }));
};

export const useStore = create<AppState>((set, get) => ({
    drills: [],
    practices: [],
    loading: false,
    error: null,

    // Initial Builder State
    builderDrills: getStoredBuilder()?.drills || [],
    builderTitle: getStoredBuilder()?.title || 'New Practice Plan',
    builderDate: getStoredBuilder()?.date || new Date().toISOString().split('T')[0],

    setBuilderDrills: (drills) => {
        set({ builderDrills: drills });
        persistBuilder(drills, get().builderTitle, get().builderDate);
    },
    setBuilderTitle: (title) => {
        set({ builderTitle: title });
        persistBuilder(get().builderDrills, title, get().builderDate);
    },
    setBuilderDate: (date) => {
        set({ builderDate: date });
        persistBuilder(get().builderDrills, get().builderTitle, date);
    },
    resetBuilder: () => {
        const today = new Date().toISOString().split('T')[0];
        set({ builderDrills: [], builderTitle: 'New Practice Plan', builderDate: today });
        localStorage.removeItem('skyhawk_builder_state');
    },

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
