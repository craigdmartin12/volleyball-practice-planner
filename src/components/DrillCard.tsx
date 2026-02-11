import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Tag, MoreVertical, ChevronDown, ChevronUp, ExternalLink, Pencil } from 'lucide-react';
import type { Drill } from '../services/supabase';

interface DrillCardProps {
    drill: Drill;
    onEdit?: (drill: Drill) => void;
    onDelete?: (id: string) => void;
}

export const DrillCard: React.FC<DrillCardProps> = ({ drill, onEdit }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const getDifficultyColor = (diff: string) => {
        switch (diff || 'Intermediate') {
            case 'Beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Advanced': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // If clicking a button inside, let its handler work
        if ((e.target as HTMLElement).closest('button')) return;

        console.log('[DrillCard] Card clicked, toggling expansion for:', drill.id);
        setIsExpanded(!isExpanded);
    };

    const goToDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('[DrillCard] Navigating to details page:', drill.id);
        navigate(`/drill/${drill.id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) onEdit(drill);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`flex flex-col h-full rounded-2xl shadow-sm border p-6 transition-all duration-200 cursor-pointer ${isExpanded
                ? 'bg-[#F9FAFB] border-stonehill-purple ring-2 ring-stonehill-purple/10'
                : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                }`}
        >
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                    <h3 className={`font-black text-gray-900 leading-tight transition-colors ${isExpanded ? 'text-xl text-stonehill-purple' : 'text-base group-hover:text-stonehill-purple line-clamp-1'}`}>
                        {drill.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(drill.difficulty)} uppercase tracking-wider`}>
                            {drill.difficulty || 'Intermediate'}
                        </span>
                        {drill.category && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-stonehill-purple/20 bg-stonehill-purple/[0.03] text-stonehill-purple uppercase tracking-wider">
                                {drill.category}
                            </span>
                        )}
                        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 ml-1">
                            <Clock className="w-3.5 h-3.5" />
                            {drill.duration_minutes || 5} min
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={handleEdit}
                        className="p-2 rounded-xl text-gray-400 hover:text-stonehill-gold hover:bg-stonehill-gold/10 transition-colors"
                        title="Edit Drill"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-stonehill-purple text-white' : 'bg-gray-50 text-gray-400 hover:text-stonehill-purple'}`}
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <button
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className={`text-gray-600 text-sm leading-relaxed mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
                <p className={isExpanded ? 'whitespace-pre-wrap' : ''}>
                    {drill.description || <span className="italic text-gray-400">No description provided for this drill.</span>}
                </p>
            </div>

            {isExpanded && (
                <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    {drill.tags && drill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {drill.tags.map((tag) => (
                                <span key={tag} className="flex items-center gap-1 text-[11px] text-gray-400 bg-white border border-gray-100 px-2.5 py-1 rounded-lg italic">
                                    <Tag className="w-3 h-3 text-stonehill-gold" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={goToDetails}
                        className="w-full bg-stonehill-purple text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-stonehill-purple/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open Full View
                    </button>
                </div>
            )}

            {!isExpanded && (
                <div className="mt-auto flex justify-end">
                    <span className="text-[10px] font-bold text-stonehill-purple uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to details
                    </span>
                </div>
            )}
        </div>
    );
};
