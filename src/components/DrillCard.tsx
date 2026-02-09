import { useNavigate } from 'react-router-dom';
import { Clock, Tag, MoreVertical } from 'lucide-react';
import type { Drill } from '../services/supabase';

interface DrillCardProps {
    drill: Drill;
    onEdit?: (drill: Drill) => void;
    onDelete?: (id: string) => void;
}

export const DrillCard: React.FC<DrillCardProps> = ({ drill }) => {
    const navigate = useNavigate();

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Advanced': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleCardClick = () => {
        console.log('Navigating to drill:', drill.id);
        navigate(`/drill/${drill.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all group relative cursor-pointer active:scale-[0.98] block"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-900 group-hover:text-stonehill-purple transition-colors line-clamp-1">
                    {drill.title}
                </h3>
                <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-50 flex-shrink-0"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                {drill.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(drill.difficulty)} uppercase tracking-wider`}>
                    {drill.difficulty}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                    <Clock className="w-3 h-3" />
                    {drill.duration_minutes} min
                </div>
            </div>

            <div className="flex flex-wrap gap-1">
                {drill.tags?.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] text-gray-400 italic">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};
