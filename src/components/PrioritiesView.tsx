import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Layers,
  Thermometer
} from 'lucide-react';
import { Task, Priority, TaskStatus } from '../types';

interface PrioritiesViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onUpdatePriority: (taskId: string, newPriority: Priority) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const PrioritiesView: React.FC<PrioritiesViewProps> = ({
  tasks,
  onSelectTask,
  onUpdatePriority,
  onToggleTaskComplete,
  onOpenAIAssistantWithPrompt
}) => {
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  // Matrix categories
  const urgentHigh = activeTasks.filter(t => t.priority === 'Urgent');
  const highPriority = activeTasks.filter(t => t.priority === 'High');
  const mediumPriority = activeTasks.filter(t => t.priority === 'Medium');
  const lowPriority = activeTasks.filter(t => t.priority === 'Low');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & AI Priority Advisory */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810] flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-600" />
            Kitchen Priority & Urgency Matrix
          </h1>
          <p className="text-sm text-[#7A6656] mt-0.5">
            Balance confectionery shelf-life, tempering climate windows, and imminent wedding deliveries
          </p>
        </div>

        <button
          onClick={() => onOpenAIAssistantWithPrompt('Analyze all our active orders and tasks to construct an optimal hour-by-hour kitchen priority schedule for today')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C07D3E] to-[#9C5824] hover:from-[#B16F34] hover:to-[#8B4C1D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          AI Optimize Priority Sequence
        </button>
      </div>

      {/* Priority Matrix 4 Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Quadrant 1: Urgent & Critical */}
        <div className="bg-rose-50/50 rounded-2xl p-5 border-2 border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
                <h3 className="font-display font-bold text-sm text-rose-950 uppercase tracking-wide">
                  Q1: Urgent & Time-Sensitive ({urgentHigh.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                Immediate Action
              </span>
            </div>
            <p className="text-xs text-rose-800/80 mb-3">
              Perishable ganaches, same-day tiered cake stabilization, and high-value event dispatches.
            </p>

            <div className="space-y-2.5">
              {urgentHigh.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/60 text-center text-xs text-rose-700 italic border border-dashed border-rose-200">
                  No urgent emergencies in the kitchen right now!
                </div>
              ) : (
                urgentHigh.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 bg-white rounded-xl border border-rose-200 hover:border-rose-400 shadow-xs transition-all flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 uppercase">
                          {task.station}
                        </span>
                        <span className="text-xs font-semibold text-[#2C1810] group-hover:text-rose-700 transition-colors">
                          {task.title}
                        </span>
                      </div>
                      {task.projectName && (
                        <p className="text-[11px] text-[#A25A24] truncate">
                          Order: {task.projectName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-[#7A6656]">
                        <span className="flex items-center gap-1 text-rose-700 font-medium">
                          <Clock className="w-3 h-3" />
                          Due: {task.dueDate} {task.dueTime}
                        </span>
                        <span>•</span>
                        <span>{task.assignedTo.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onUpdatePriority(task.id, 'High')}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer flex items-center gap-0.5"
                        title="Demote to High"
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                        Demote
                      </button>
                      <button
                        onClick={() => onToggleTaskComplete(task.id)}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quadrant 2: High Impact Scheduled */}
        <div className="bg-amber-50/40 rounded-2xl p-5 border-2 border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <h3 className="font-display font-bold text-sm text-amber-950 uppercase tracking-wide">
                  Q2: High Impact Scheduled ({highPriority.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Core Production
              </span>
            </div>
            <p className="text-xs text-amber-800/80 mb-3">
              Bulk tempering batches, artisan chocolate fillings, multi-tier sponge baking.
            </p>

            <div className="space-y-2.5">
              {highPriority.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/60 text-center text-xs text-amber-700 italic border border-dashed border-amber-200">
                  No high priority tasks pending.
                </div>
              ) : (
                highPriority.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 shadow-xs transition-all flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 uppercase">
                          {task.station}
                        </span>
                        <span className="text-xs font-semibold text-[#2C1810] group-hover:text-amber-700 transition-colors">
                          {task.title}
                        </span>
                      </div>
                      {task.projectName && (
                        <p className="text-[11px] text-[#A25A24] truncate">
                          Order: {task.projectName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-[#7A6656]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A25A24]" />
                          Due: {task.dueDate}
                        </span>
                        <span>•</span>
                        <span>{task.assignedTo.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onUpdatePriority(task.id, 'Urgent')}
                        className="text-[10px] px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer flex items-center gap-0.5"
                        title="Promote to Urgent"
                      >
                        <ArrowUp className="w-2.5 h-2.5" />
                        Urgent
                      </button>
                      <button
                        onClick={() => onUpdatePriority(task.id, 'Medium')}
                        className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 cursor-pointer flex items-center gap-0.5"
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                        Demote
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quadrant 3: Medium Priority - Prep & Aging */}
        <div className="bg-[#FAF7F2] rounded-2xl p-5 border-2 border-[#E8DEC8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DEC8]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-stone-400"></span>
                <h3 className="font-display font-bold text-sm text-[#2C1810] uppercase tracking-wide">
                  Q3: Standard Prep & Rest ({mediumPriority.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#7A6656] bg-[#EAE0D1] px-2 py-0.5 rounded-full">
                Scheduled Workflow
              </span>
            </div>
            <p className="text-xs text-[#7A6656] mb-3">
              Advance sponge freezing, tea infusions, ribbon tying, and mold inventory replenishment.
            </p>

            <div className="space-y-2.5">
              {mediumPriority.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/60 text-center text-xs text-[#8C7665] italic border border-dashed border-[#E8DEC8]">
                  No medium tasks currently queued.
                </div>
              ) : (
                mediumPriority.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 bg-white rounded-xl border border-[#E8DEC8] hover:border-[#C07D3E] shadow-xs transition-all flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#FAF7F2] text-[#6E5848] border border-[#E8DEC8]">
                          {task.station}
                        </span>
                        <span className="text-xs font-semibold text-[#2C1810] group-hover:text-[#A25A24] transition-colors">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#7A6656]">
                        <span>Due: {task.dueDate}</span>
                        <span>•</span>
                        <span>{task.assignedTo.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onUpdatePriority(task.id, 'High')}
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer flex items-center gap-0.5"
                      >
                        <ArrowUp className="w-2.5 h-2.5" />
                        Promote
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quadrant 4: Low Priority / Maintenance */}
        <div className="bg-[#FAF7F2] rounded-2xl p-5 border-2 border-[#E8DEC8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DEC8]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <h3 className="font-display font-bold text-sm text-[#2C1810] uppercase tracking-wide">
                  Q4: Kitchen Maintenance & Backlog ({lowPriority.length})
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                Secondary
              </span>
            </div>
            <p className="text-xs text-[#7A6656] mb-3">
              Polycarbonate mold cotton-wool polishing, ingredient audit, recipe notebook updates.
            </p>

            <div className="space-y-2.5">
              {lowPriority.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/60 text-center text-xs text-[#8C7665] italic border border-dashed border-[#E8DEC8]">
                  No low priority backlog items.
                </div>
              ) : (
                lowPriority.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 bg-white rounded-xl border border-[#E8DEC8] hover:border-[#C07D3E] shadow-xs transition-all flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="space-y-1 flex-1">
                      <span className="text-xs font-semibold text-[#2C1810] group-hover:text-[#A25A24] transition-colors">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-[#7A6656]">
                        <span>{task.station}</span>
                        <span>•</span>
                        <span>{task.assignedTo.name}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePriority(task.id, 'Medium');
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] hover:bg-[#EAE0D1] text-[#2C1810] border border-[#E8DEC8] cursor-pointer flex items-center gap-0.5"
                    >
                      <ArrowUp className="w-2.5 h-2.5" />
                      Boost
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
