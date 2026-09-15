import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  CheckSquare,
  AlertCircle,
  Eye,
  Trash2,
  Edit2
} from 'lucide-react';
import { Task, TaskStatus, Priority, Station, Category } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenNewTask: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onSelectTask,
  onOpenNewTask,
  onToggleTaskComplete,
  onUpdateTaskStatus,
  onDeleteTask,
  onOpenAIAssistantWithPrompt
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.projectName && t.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStation = selectedStation === 'all' || t.station === selectedStation;
      const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

      return matchesSearch && matchesStation && matchesPriority && matchesCategory;
    });
  }, [tasks, searchQuery, selectedStation, selectedPriority, selectedCategory]);

  const columns: { status: TaskStatus; label: string; color: string; description: string }[] = [
    { status: 'todo', label: 'To Do / Prep', color: 'border-amber-400/50 bg-amber-500/10 text-amber-900', description: 'Raw prep, mise en place & ingredient weighting' },
    { status: 'in_progress', label: 'In Production', color: 'border-blue-400/50 bg-blue-500/10 text-blue-900', description: 'Active baking, tempering & decorating' },
    { status: 'review', label: 'Cooling & Review', color: 'border-purple-400/50 bg-purple-500/10 text-purple-900', description: 'Crystallization, chilling & quality inspection' },
    { status: 'completed', label: 'Completed', color: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-900', description: 'Ready for packaging or dispatched' }
  ];

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & AI Assistant Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Kitchen Task Management
          </h1>
          <p className="text-sm text-[#7A6656] mt-0.5">
            Coordinate station workflows, tempering schedules, and cake decorating timelines
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAIAssistantWithPrompt('Organize my kitchen tasks into an efficient production sequence and identify any bottlenecks')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2ECE1] hover:bg-[#EAE0D1] text-[#7A4B29] border border-[#E2D2BE] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C07D3E]" />
            AI Organize Tasks
          </button>

          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C1810] hover:bg-[#43261A] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7665]" />
            <input
              type="text"
              placeholder="Search tasks, orders, stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs focus:outline-none focus:border-[#C07D3E] text-[#2C1810]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C7665] hover:text-[#2C1810]"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle: Kanban vs List */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DEC8] w-full md:w-auto justify-end">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'kanban' 
                  ? 'bg-white text-[#2C1810] shadow-xs font-bold' 
                  : 'text-[#8C7665] hover:text-[#2C1810]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-white text-[#2C1810] shadow-xs font-bold' 
                  : 'text-[#8C7665] hover:text-[#2C1810]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List View
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F2ECE1] text-xs">
          <span className="text-[#8C7665] font-medium flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#A25A24]" />
            Filter by:
          </span>

          {/* Station Filter */}
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
          >
            <option value="all">All Stations</option>
            <option value="Baking & Ovens">Baking & Ovens</option>
            <option value="Chocolate Tempering">Chocolate Tempering</option>
            <option value="Decorating & Fondant">Decorating & Fondant</option>
            <option value="Assembly & Filling">Assembly & Filling</option>
            <option value="Packaging & Dispatch">Packaging & Dispatch</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Custom Cake">Custom Cake</option>
            <option value="Artisan Chocolate">Artisan Chocolate</option>
            <option value="Patisserie">Patisserie</option>
            <option value="Gift Box">Gift Box</option>
          </select>

          {(selectedStation !== 'all' || selectedPriority !== 'all' || selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedStation('all');
                setSelectedPriority('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-[#A25A24] hover:underline font-medium text-xs ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Content: Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div 
                key={col.status}
                className="bg-[#F6EFE6]/60 rounded-2xl p-3.5 border border-[#E5DAC6] flex flex-col min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-[#2C1810] uppercase tracking-wider">
                        {col.label}
                      </h3>
                      <span className="w-5 h-5 rounded-full bg-[#EADCC9] text-[#2C1810] text-[11px] font-bold flex items-center justify-center">
                        {colTasks.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8C7665] mt-0.5">{col.description}</p>
                  </div>

                  {col.status === 'todo' && (
                    <button
                      onClick={onOpenNewTask}
                      className="p-1 rounded-md hover:bg-white text-[#7A4B29] transition-colors cursor-pointer"
                      title="Add task to this column"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Column Tasks */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9CABE] text-[#A89482] text-xs text-center p-3">
                      <span>No tasks in this stage</span>
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const completedChecklist = task.checklist.filter(c => c.completed).length;
                      const totalChecklist = task.checklist.length;
                      return (
                        <div
                          key={task.id}
                          className="bg-white rounded-xl p-3.5 border border-[#E8DEC8] hover:border-[#C07D3E]/60 shadow-xs hover:shadow-md transition-all group relative cursor-pointer"
                          onClick={() => onSelectTask(task)}
                        >
                          {/* Priority & Station row */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getPriorityBadgeClass(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-[10px] font-medium text-[#8C7665] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8DEC8] truncate max-w-[130px]">
                              {task.station}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="font-semibold text-xs text-[#2C1810] group-hover:text-[#A25A24] transition-colors leading-snug line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Project Tag */}
                          {task.projectName && (
                            <p className="text-[11px] text-[#A25A24] font-medium mt-1 truncate">
                              🏷️ {task.projectName}
                            </p>
                          )}

                          {/* Checklist & Duration */}
                          <div className="mt-3 flex items-center justify-between text-[11px] text-[#8C7665] pt-2 border-t border-[#F2ECE1]">
                            <div className="flex items-center gap-1.5">
                              {totalChecklist > 0 && (
                                <span className={`flex items-center gap-0.5 font-medium ${
                                  completedChecklist === totalChecklist ? 'text-emerald-700' : 'text-[#7A6656]'
                                }`}>
                                  <CheckSquare className="w-3 h-3" />
                                  {completedChecklist}/{totalChecklist}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#A25A24]" />
                                {task.estimatedHours}h
                              </span>
                            </div>

                            {/* Assigned Avatar */}
                            <div className="flex items-center gap-1.5" title={`Assigned: ${task.assignedTo.name}`}>
                              <img 
                                src={task.assignedTo.avatar} 
                                alt={task.assignedTo.name} 
                                className="w-5 h-5 rounded-full object-cover border border-[#D9CABE]" 
                              />
                            </div>
                          </div>

                          {/* Quick Stage Mover Buttons */}
                          <div 
                            className="mt-2.5 pt-2 border-t border-[#F2ECE1] flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[10px] text-[#8C7665]">Move:</span>
                            <div className="flex items-center gap-1">
                              {col.status !== 'todo' && (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, 'todo')}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF7F2] hover:bg-[#EAE0D1] text-[#2C1810] border border-[#E8DEC8] cursor-pointer"
                                  title="Move to To Do"
                                >
                                  Prep
                                </button>
                              )}
                              {col.status !== 'in_progress' && (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, 'in_progress')}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 cursor-pointer"
                                  title="Move to In Production"
                                >
                                  Prod
                                </button>
                              )}
                              {col.status !== 'review' && (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, 'review')}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 cursor-pointer"
                                  title="Move to Cooling/Review"
                                >
                                  Review
                                </button>
                              )}
                              {col.status !== 'completed' ? (
                                <button
                                  onClick={() => onToggleTaskComplete(task.id)}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold cursor-pointer"
                                  title="Mark as Completed"
                                >
                                  Done
                                </button>
                              ) : (
                                <button
                                  onClick={() => onUpdateTaskStatus(task.id, 'todo')}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#2C1810] border border-[#E8DEC8] cursor-pointer"
                                  title="Re-open task"
                                >
                                  Reopen
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#E8DEC8] text-[#8C7665] uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-8">Status</th>
                  <th className="py-3 px-4">Task & Order</th>
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Assigned Chef</th>
                  <th className="py-3 px-4">Checklist</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {filteredTasks.map(task => {
                  const isDone = task.status === 'completed';
                  const completedChecklist = task.checklist.filter(c => c.completed).length;
                  const totalChecklist = task.checklist.length;
                  return (
                    <tr 
                      key={task.id}
                      className="hover:bg-[#FAF7F2]/80 transition-colors cursor-pointer"
                      onClick={() => onSelectTask(task)}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onToggleTaskComplete(task.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                            isDone 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'border-[#C8B8A6] hover:border-[#A25A24] bg-white'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-xs text-[#2C1810] hover:text-[#A25A24]">
                          {task.title}
                        </div>
                        {task.projectName && (
                          <div className="text-[11px] text-[#A25A24] truncate">
                            {task.projectName}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] text-[#6E5848] border border-[#E8DEC8] font-medium">
                          {task.station}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#6E5848]">
                        <span className="font-medium">{task.dueDate}</span>
                        {task.dueTime && <span className="text-[11px] text-[#8C7665] ml-1">({task.dueTime})</span>}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-[#2C1810]">
                          <img 
                            src={task.assignedTo.avatar} 
                            alt={task.assignedTo.name} 
                            className="w-5 h-5 rounded-full object-cover" 
                          />
                          <span>{task.assignedTo.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#8C7665]">
                        {totalChecklist > 0 ? (
                          <span className={completedChecklist === totalChecklist ? 'text-emerald-700 font-bold' : ''}>
                            {completedChecklist}/{totalChecklist} steps
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectTask(task)}
                            className="p-1 rounded hover:bg-[#F2ECE1] text-[#7A6656] cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 rounded hover:bg-rose-50 text-rose-600 cursor-pointer"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
