import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    GripVertical,
    Trash2,
    Clock,
    ChevronRight,
    Save,
    Printer,
    Calendar,
    AlertCircle,
    Plus,
    Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Drill } from '../services/supabase';
import { api } from '../services/supabase';

interface SortableItemProps {
    id: string;
    drill: Drill;
    onRemove: (id: string) => void;
    onView: (drill: Drill) => void;
}

const SortablePracticeDrill: React.FC<SortableItemProps> = ({ id, drill, onRemove, onView }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm group hover:border-stonehill-purple/30 transition-colors"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-stonehill-purple">
                <GripVertical className="w-5 h-5" />
            </div>

            <div
                className="flex-1 cursor-pointer"
                onClick={() => onView(drill)}
            >
                <h4 className="font-bold text-gray-900 group-hover:text-stonehill-purple transition-colors">{drill.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] font-bold text-stonehill-purple bg-stonehill-purple/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {drill.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Clock className="w-3 h-3" />
                        {drill.duration_minutes} min
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onView(drill)}
                    className="p-2 text-gray-400 hover:text-stonehill-purple hover:bg-stonehill-purple/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="View details"
                >
                    <Info className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onRemove(id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from practice"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export const PracticeBuilder: React.FC = () => {
    const { drills, fetchDrills } = useStore();
    const navigate = useNavigate();
    const [practiceDrills, setPracticeDrills] = useState<(Drill & { instanceId: string })[]>([]);
    const [title, setTitle] = useState('New Practice Plan');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchDrills();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const totalTime = practiceDrills.reduce((acc, d) => acc + d.duration_minutes, 0);

    const addDrillToPractice = (drill: Drill) => {
        const instanceId = `${drill.id}-${Date.now()}`;
        setPracticeDrills([...practiceDrills, { ...drill, instanceId }]);
    };

    const removeDrillFromPractice = (instanceId: string) => {
        setPracticeDrills(practiceDrills.filter(d => d.instanceId !== instanceId));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPracticeDrills((items) => {
                const oldIndex = items.findIndex((i) => i.instanceId === active.id);
                const newIndex = items.findIndex((i) => i.instanceId === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async () => {
        try {
            const practice = await api.practices.create({
                title,
                practice_date: date,
                notes: ''
            });
            await api.practices.updateItems(practice.id, practiceDrills.map(d => d.id));
            alert('Practice saved successfully!');
        } catch (err: any) {
            alert(`Error saving practice: ${err.message}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Practice Builder</h1>
                    <p className="text-gray-500 mt-1">Design your session by dragging drills into the timeline</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-bold shadow-sm transition-all"
                    >
                        <Printer className="w-5 h-5" />
                        Print Plan
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-stonehill-gold text-stonehill-purple rounded-xl font-bold shadow-lg shadow-stonehill-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Save className="w-5 h-5" />
                        Save Practice
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Drill Library */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Available Drills
                            <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                {drills.length}
                            </span>
                        </h3>
                        <div className="space-y-3 h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
                            {drills.map((drill) => (
                                <div key={drill.id} className="relative group">
                                    <button
                                        onClick={() => addDrillToPractice(drill)}
                                        className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-stonehill-purple hover:shadow-md transition-all group/card flex items-start justify-between pr-10"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm group-hover/card:text-stonehill-purple transition-colors">{drill.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-stonehill-purple border border-stonehill-purple/20 px-1.5 py-0.5 rounded uppercase font-mono">
                                                    {drill.difficulty[0]}
                                                </span>
                                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {drill.duration_minutes}m
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover/card:text-stonehill-purple group-hover/card:translate-x-1 transition-all" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/drill/${drill.id}`);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-stonehill-purple hover:bg-stonehill-purple/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="View Details"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Practice Canvas */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Practice Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-xl font-bold text-gray-900 w-full focus:outline-none border-b-2 border-transparent focus:border-stonehill-purple transition-all pb-1"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</label>
                                <div className="flex items-center gap-2 text-gray-600 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 cursor-pointer">
                                    <Calendar className="w-4 h-4" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-transparent focus:outline-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-6 bg-stonehill-purple/5 px-4 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-stonehill-purple uppercase tracking-tighter">Total Duration</span>
                                    <span className="text-2xl font-black text-stonehill-purple">{totalTime} <small className="text-sm font-normal">min</small></span>
                                </div>
                                <div className="h-8 w-[1px] bg-stonehill-purple/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-stonehill-purple uppercase tracking-tighter">Activity Count</span>
                                    <span className="text-2xl font-black text-stonehill-purple">{practiceDrills.length} <small className="text-sm font-normal">items</small></span>
                                </div>
                            </div>

                            {totalTime > 120 && (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 text-xs font-bold">
                                    <AlertCircle className="w-4 h-4" />
                                    Long Session Warning
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 min-h-[300px] relative">
                            {practiceDrills.length === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                                    <Plus className="w-10 h-10 mb-2 opacity-20" />
                                    <p className="font-medium text-sm">Add drills to your practice timeline</p>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={practiceDrills.map(d => d.instanceId)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {practiceDrills.map((drill) => (
                                            <SortablePracticeDrill
                                                key={drill.instanceId}
                                                id={drill.instanceId}
                                                drill={drill}
                                                onRemove={removeDrillFromPractice}
                                                onView={(d) => navigate(`/drill/${d.id}`)}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
