import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Loader2, BookOpen, ChevronDown, ArrowDownAZ, Clock, BarChart3, CalendarDays, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DrillCard } from './DrillCard';
import type { Drill } from '../services/supabase';

export const Dashboard: React.FC = () => {
    const { drills, loading, fetchDrills, addDrill } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newDrill, setNewDrill] = useState<Partial<Drill>>({
        title: '',
        description: '',
        duration_minutes: 10,
        difficulty: 'Intermediate',
        category: 'Passing',
        tags: []
    });
    const [sortBy, setSortBy] = useState<'alphabetical' | 'difficulty' | 'duration' | 'newest'>('newest');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

    const difficultyOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };

    useEffect(() => {
        fetchDrills();
    }, []);

    const filteredDrills = drills
        .filter(d =>
            (d.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'difficulty':
                    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
                case 'duration':
                    return a.duration_minutes - b.duration_minutes;
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                default:
                    return 0;
            }
        });

    const handleCreateDrill = async (e: React.FormEvent) => {
        e.preventDefault();
        await addDrill(newDrill as any);
        setIsCreateModalOpen(false);
        setNewDrill({
            title: '',
            description: '',
            duration_minutes: 10,
            difficulty: 'Intermediate',
            category: 'Passing',
            tags: []
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Drill Library <span className="text-[10px] font-bold text-stonehill-gold bg-stonehill-gold/10 px-2 py-0.5 rounded ml-2 align-middle">PRO V1.1</span></h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-stonehill-purple" />
                        Manage volleyball drills and training sessions
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-stonehill-purple hover:bg-stonehill-purple/90 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-stonehill-purple/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
                >
                    <Plus className="w-5 h-5" />
                    Create New Drill
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search drills by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-stonehill-purple/20 focus:border-stonehill-purple transition-all shadow-sm"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm font-medium min-w-[140px] justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <span>Sort & Filter</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSortMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-[60]"
                                onClick={() => setIsSortMenuOpen(false)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Sort Drills By</div>

                                <button
                                    onClick={() => { setSortBy('alphabetical'); setIsSortMenuOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sortBy === 'alphabetical' ? 'bg-stonehill-purple/5 text-stonehill-purple font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <ArrowDownAZ className="w-4 h-4" />
                                        Alphabetical (A-Z)
                                    </div>
                                    {sortBy === 'alphabetical' && <Check className="w-4 h-4" />}
                                </button>

                                <button
                                    onClick={() => { setSortBy('difficulty'); setIsSortMenuOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sortBy === 'difficulty' ? 'bg-stonehill-purple/5 text-stonehill-purple font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <BarChart3 className="w-4 h-4" />
                                        Difficulty Level
                                    </div>
                                    {sortBy === 'difficulty' && <Check className="w-4 h-4" />}
                                </button>

                                <button
                                    onClick={() => { setSortBy('duration'); setIsSortMenuOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sortBy === 'duration' ? 'bg-stonehill-purple/5 text-stonehill-purple font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4" />
                                        Duration
                                    </div>
                                    {sortBy === 'duration' && <Check className="w-4 h-4" />}
                                </button>

                                <button
                                    onClick={() => { setSortBy('newest'); setIsSortMenuOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sortBy === 'newest' ? 'bg-stonehill-purple/5 text-stonehill-purple font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CalendarDays className="w-4 h-4" />
                                        Newest to Oldest
                                    </div>
                                    {sortBy === 'newest' && <Check className="w-4 h-4" />}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {loading && drills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-stonehill-purple/30" />
                    <p className="font-medium">Loading drills...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDrills.map((drill) => {
                        console.log('[Dashboard] Rendering drill card:', drill.id, drill.title);
                        return (
                            <DrillCard
                                key={drill.id}
                                drill={drill}
                            />
                        );
                    })}

                    {filteredDrills.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium text-lg">No drills found</p>
                            <p className="text-gray-400 text-sm">Try a different search or create your first drill!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Basic Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stonehill-purple/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
                        <div className="bg-stonehill-gold p-6 text-stonehill-purple">
                            <h3 className="text-xl font-bold">New Drill Details <span className="text-[10px] bg-stonehill-purple text-white px-2 py-0.5 rounded ml-2">UPDATE 1.1</span></h3>
                            <p className="text-stonehill-purple/70 text-sm mt-1">Categorize and save your drills</p>
                        </div>

                        <form onSubmit={handleCreateDrill} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Drill Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newDrill.title}
                                    onChange={e => setNewDrill({ ...newDrill, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stonehill-purple/20 focus:border-stonehill-purple outline-none"
                                    placeholder="e.g. 6-vs-6 Side-out Wash"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Duration (min)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newDrill.duration_minutes}
                                        onChange={e => setNewDrill({ ...newDrill, duration_minutes: parseInt(e.target.value) })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stonehill-purple/20 focus:border-stonehill-purple outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Difficulty</label>
                                    <select
                                        value={newDrill.difficulty}
                                        onChange={e => setNewDrill({ ...newDrill, difficulty: e.target.value as any })}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stonehill-purple/20 focus:border-stonehill-purple outline-none bg-white"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Skill Category</label>
                                <select
                                    value={newDrill.category}
                                    onChange={e => setNewDrill({ ...newDrill, category: e.target.value as any })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stonehill-purple/20 focus:border-stonehill-purple outline-none bg-white font-medium"
                                >
                                    <option value="Passing">Passing</option>
                                    <option value="Attacking">Attacking</option>
                                    <option value="Setting">Setting</option>
                                    <option value="Serving">Serving</option>
                                    <option value="Defense">Defense</option>
                                    <option value="Blocking">Blocking</option>
                                    <option value="Competition">Competition</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={newDrill.description}
                                    onChange={e => setNewDrill({ ...newDrill, description: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-stonehill-purple/20 focus:border-stonehill-purple outline-none resize-none"
                                    placeholder="Explain how the drill works..."
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-stonehill-gold hover:bg-stonehill-gold/90 text-stonehill-purple font-bold py-3 rounded-xl shadow-lg transition-all"
                                >
                                    Save Drill
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
