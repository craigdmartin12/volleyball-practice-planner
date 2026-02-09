import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, BookOpen, Share2, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const DrillDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { drills, loading, fetchDrills } = useStore();

    useEffect(() => {
        if (drills.length === 0) {
            fetchDrills();
        }
    }, [drills.length, fetchDrills]);

    const drill = drills.find(d => d.id === id);

    if (loading && drills.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-stonehill-purple" />
            </div>
        );
    }

    if (!drill) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-mono">DRILL NOT FOUND</h2>
                <p className="text-gray-500 mb-8">We couldn't find the drill you're looking for. It may have been deleted.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-stonehill-purple text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-stonehill-purple/90 transition-all shadow-lg shadow-stonehill-purple/20"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Library
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-gray-500 hover:text-stonehill-purple font-bold transition-all mb-8"
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 group-hover:border-stonehill-purple/20 group-hover:bg-stonehill-purple/5 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-stonehill-purple/5 overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="bg-stonehill-purple p-8 md:p-12 text-white relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-stonehill-gold/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                                {drill.difficulty}
                            </span>
                            <div className="flex items-center gap-2 text-sm font-bold text-blue-100">
                                <Clock className="w-4 h-4" />
                                {drill.duration_minutes} Minutes
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                            {drill.title}
                        </h1>

                        <div className="h-1.5 w-24 bg-stonehill-gold rounded-full mb-8"></div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Description */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 text-stonehill-purple mb-6">
                                <BookOpen className="w-5 h-5" />
                                <h2 className="font-black uppercase tracking-widest text-sm">Execution & Instructions</h2>
                            </div>

                            <div className="prose prose-stone max-w-none">
                                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {drill.description || 'No detailed instructions provided for this drill.'}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-10">
                            {drill.tags && drill.tags.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 text-gray-400 mb-4">
                                        <Tag className="w-4 h-4" />
                                        <h3 className="font-black uppercase tracking-widest text-[10px]">Tagged Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {drill.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-50 text-stonehill-purple rounded-lg text-xs font-bold border border-gray-200 italic">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2 text-gray-400 mb-4">
                                    <Share2 className="w-4 h-4" />
                                    <h3 className="font-black uppercase tracking-widest text-[10px]">Actions</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all text-sm flex items-center justify-center gap-2"
                                        onClick={() => window.print()}
                                    >
                                        Print Drill Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="bg-gray-50 px-8 md:px-12 py-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-40">
                        <img src="https://stonehillskyhawks.com/images/logos/site/site.png" alt="" className="h-5 grayscale" />
                        <span className="font-bold text-[10px] uppercase tracking-widest">Skyhawk Athletics</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium italic">Volleyball Practice Planner</p>
                </div>
            </div>
        </div>
    );
};
