import React from 'react';
import { X, Clock, Tag, BookOpen } from 'lucide-react';
import type { Drill } from '../services/supabase';

interface DrillDetailsModalProps {
    drill: Drill | null;
    onClose: () => void;
}

export const DrillDetailsModal: React.FC<DrillDetailsModalProps> = ({ drill, onClose }) => {
    if (!drill) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-stonehill-purple/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-stonehill-purple p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 bg-white/10 uppercase tracking-widest`}>
                            {drill.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-blue-100">
                            <Clock className="w-3.5 h-3.5" />
                            {drill.duration_minutes} Minutes
                        </div>
                    </div>

                    <h2 className="text-3xl font-black tracking-tight">{drill.title}</h2>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="flex items-center gap-2 text-stonehill-purple mb-4">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-widest text-xs">Description & Instructions</h3>
                    </div>

                    <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {drill.description || 'No description provided for this drill.'}
                    </div>

                    {drill.tags && drill.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-gray-400 mb-3">
                                <Tag className="w-4 h-4" />
                                <h3 className="font-bold uppercase tracking-widest text-[10px]">Tagged Skills</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {drill.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100 italic">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 flex justify-end border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="bg-stonehill-purple text-white px-8 py-3 rounded-xl font-bold hover:bg-stonehill-purple/90 transition-all shadow-lg shadow-stonehill-purple/20"
                    >
                        Got it, Coach
                    </button>
                </div>
            </div>
        </div>
    );
};
