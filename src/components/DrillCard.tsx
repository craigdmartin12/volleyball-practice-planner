import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Tag, MoreVertical, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { Drill } from '../services/supabase';

interface DrillCardProps {
    drill: Drill;
    onEdit?: (drill: Drill) => void;
    onDelete?: (id: string) => void;
}

export const DrillCard: React.FC<DrillCardProps> = ({ drill }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Advanced': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[DrillCard] Toggling expansion for:', drill.id);
        setIsExpanded(!isExpanded);
    };

    const goToDetails = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('[DrillCard] Navigating to details page:', drill.id);
        navigate(`/drill/${drill.id}`);
    };

    return (
        <div
            onClick={toggleExpand}
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 group relative cursor-pointer hover:shadow-md hover:border-stonehill-purple/20 ${isExpanded ? 'ring-2 ring-stonehill-purple/10 border-stonehill-purple/30' : ''}`}
        >
            <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                    <h3 className={`font-bold text-gray-900 group-hover:text-stonehill-purple transition-colors ${isExpanded ? 'text-lg' : 'line-clamp-1'}`}>
                        {drill.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(drill.difficulty)} uppercase tracking-wider`}>
                            {drill.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            {drill.duration_minutes} min
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleExpand}
                        className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-stonehill-purple transition-colors"
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <button
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className={`text-gray-600 text-sm leading-relaxed mb-4 transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-[2.5rem] overflow-hidden opacity-80'}`}>
                <p className={`${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
                    {drill.description}
                </p>
            </div>

            {isExpanded && (
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-wrap gap-2">
                        {drill.tags?.map((tag) => (
                            <span key={tag} className="flex items-center gap-1 text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md italic">
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={goToDetails}
                        className="w-full bg-stonehill-purple/5 hover:bg-stonehill-purple text-stonehill-purple hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stonehill-purple/10"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Full Drill Page
                    </button>
                </div>
            )}

            {!isExpanded && (
                <div className="flex justify-end text-[10px] font-bold text-stonehill-purple opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to expand details
                </div>
            )}
        </div>
    );
};
