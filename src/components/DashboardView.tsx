import React from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Flame, 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle,
  Layers,
  Thermometer,
  Calendar,
  ChefHat,
  Eye
} from 'lucide-react';
import { Project, Task, StationStatus, ViewTab } from '../types';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  stations: StationStatus[];
  onNavigateTab: (tab: ViewTab) => void;
  onSelectTask: (task: Task) => void;
  onSelectProject: (project: Project) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenNewTask: () => void;
  onOpenNewProject: () => void;
  onTriggerAISummary: () => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  tasks,
  stations,
  onNavigateTab,
  onSelectTask,
  onSelectProject,
  onToggleTaskComplete,
  onOpenNewTask,
  onOpenNewProject,
  onTriggerAISummary,
  onOpenAIAssistantWithPrompt
}) => {
  // Calculations
  const urgentTasks = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'completed');
  const todayTasks = tasks.filter(t => t.dueDate === '2026-09-15' && t.status !== 'completed');
  const completedToday = tasks.filter(t => t.status === 'completed').length;
  
  const totalProgress = Math.round(
    projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1)
  );

  const totalRevenue = projects.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & AI Executive Briefing Callout */}
      <div className="bg-gradient-to-r from-[#3B2215] via-[#4A2B1B] to-[#2C1810] rounded-2xl p-6 text-white shadow-lg shadow-amber-950/20 border border-amber-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#E8C08A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Kitchen Operations Active
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Today's Atelier Production Overview
          </h1>
          <p className="text-sm text-[#DFD1C4] leading-relaxed">
            {urgentTasks.length} critical batches require immediate tempering or structural attention before afternoon dispatch. Overall kitchen capacity is running smoothly at optimal cacao ambient climate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={onTriggerAISummary}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C07D3E] to-[#9C5824] hover:from-[#D18B4A] hover:to-[#AC632B] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            AI Executive Briefing
          </button>
          <button
            onClick={() => onOpenAIAssistantWithPrompt('Prioritize today\'s urgent tasks and check for kitchen bottlenecks')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Ask Chef Cocoa
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Projects */}
        <div 
          onClick={() => onNavigateTab('projects')}
          className="bg-white p-5 rounded-2xl border border-[#E8DEC8] hover:border-[#C07D3E]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7665] uppercase tracking-wider">Active Orders</span>
            <div className="w-9 h-9 rounded-xl bg-[#F6EFE6] text-[#A25A24] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-[#2C1810]">{projects.length}</span>
            <span className="text-xs text-emerald-600 font-medium">100% on schedule</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#7A6656] pt-2 border-t border-[#F2ECE1]">
            <span>{projects.filter(p => p.category === 'Custom Cake').length} Cakes • {projects.filter(p => p.category === 'Artisan Chocolate').length} Chocolates</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C07D3E] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Tasks Due Today */}
        <div 
          onClick={() => onNavigateTab('tasks')}
          className="bg-white p-5 rounded-2xl border border-[#E8DEC8] hover:border-[#C07D3E]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7665] uppercase tracking-wider">Today's Kitchen Queue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-[#2C1810]">{todayTasks.length}</span>
            <span className="text-xs text-amber-700 font-medium bg-amber-100/60 px-1.5 py-0.5 rounded">
              {urgentTasks.length} Urgent
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#7A6656] pt-2 border-t border-[#F2ECE1]">
            <span>{completedToday} completed today</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C07D3E] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Production Progress */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-5 rounded-2xl border border-[#E8DEC8] hover:border-[#C07D3E]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7665] uppercase tracking-wider">Kitchen Fulfillment</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-[#2C1810]">{totalProgress}%</span>
            <span className="text-xs text-emerald-700 font-medium">On Target</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#EAE1D3] h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#C07D3E] to-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Active Pipeline Value */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7665] uppercase tracking-wider">Active Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-[#F6EFE6] text-[#7A4B29] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-[#2C1810]">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-[#7A6656] font-medium">in active orders</span>
          </div>
          <div className="mt-3 text-xs text-[#7A6656] pt-2 border-t border-[#F2ECE1] flex items-center justify-between">
            <span>5 clients confirmed</span>
            <span className="text-emerald-700 font-semibold">92% deposits secured</span>
          </div>
        </div>

      </div>

      {/* Stations Workload & Climate Monitor */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8DEC8] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2EBE1]">
          <div>
            <h2 className="font-display font-bold text-lg text-[#2C1810] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C07D3E]" />
              Artisan Stations & Ambient Climate
            </h2>
            <p className="text-xs text-[#7A6656]">
              Real-time monitoring of kitchen work centers, temperatures, and team assignments
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Systems Calibrated
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {stations.map(station => {
            const isBusy = station.status === 'busy';
            return (
              <div 
                key={station.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isBusy 
                    ? 'bg-amber-50/40 border-amber-200/80 shadow-xs' 
                    : 'bg-[#FAF7F2] border-[#E8DEC8]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-bold text-xs text-[#2C1810] line-clamp-1">{station.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isBusy ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {station.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1 text-[#6E5848] text-[11px]">
                    <ChefHat className="w-3 h-3 text-[#A25A24]" />
                    <span className="font-medium truncate">{station.headChef}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#7A6656] text-[11px]">
                    <Thermometer className="w-3 h-3 text-[#C07D3E]" />
                    <span className="truncate">{station.ambientCondition}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-medium pt-1.5 border-t border-[#E8DEC8]/60">
                    <span className="text-[#8C7665]">{station.activeTasks} in queue</span>
                    <span className="text-emerald-700 font-semibold">{station.completedToday} finished</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout: Priority Queue & Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Today's Priority Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#E8DEC8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F2EBE1]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h2 className="font-display font-bold text-lg text-[#2C1810]">
                  Urgent Kitchen Production Queue
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenNewTask}
                  className="text-xs font-semibold text-[#A25A24] hover:text-[#7A421A] flex items-center gap-1 cursor-pointer"
                >
                  + Add Task
                </button>
                <span className="text-[#D8C7B5]">|</span>
                <button
                  onClick={() => onNavigateTab('tasks')}
                  className="text-xs font-semibold text-[#6E5848] hover:text-[#2C1810] flex items-center gap-1 cursor-pointer"
                >
                  View All ({tasks.length})
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Task list items */}
            <div className="divide-y divide-[#F2EBE1] mt-1">
              {tasks
                .filter(t => t.status !== 'completed')
                .slice(0, 5)
                .map(task => {
                  const isUrgent = task.priority === 'Urgent';
                  return (
                    <div 
                      key={task.id}
                      className="py-3.5 flex items-start justify-between gap-3 group hover:bg-[#FAF7F2] -mx-2 px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleTaskComplete(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                            task.status === 'completed'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-[#C8B8A6] hover:border-[#A25A24] bg-white'
                          }`}
                          title="Mark completed"
                        >
                          {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span 
                              onClick={() => onSelectTask(task)}
                              className="font-semibold text-sm text-[#2C1810] group-hover:text-[#A25A24] transition-colors cursor-pointer"
                            >
                              {task.title}
                            </span>
                            
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              isUrgent 
                                ? 'bg-red-50 text-red-700 border border-red-200' 
                                : task.priority === 'High'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-stone-100 text-stone-700'
                            }`}>
                              {task.priority}
                            </span>

                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F2ECE1] text-[#7A6656] font-medium">
                              {task.station}
                            </span>
                          </div>

                          <p className="text-xs text-[#7A6656] line-clamp-1">
                            {task.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-[#8C7665]">
                            <span className="flex items-center gap-1 font-medium text-[#2C1810]">
                              <img 
                                src={task.assignedTo.avatar} 
                                alt={task.assignedTo.name} 
                                className="w-4 h-4 rounded-full object-cover" 
                              />
                              {task.assignedTo.name}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#A25A24]" />
                              Due: {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                            </span>
                            {task.projectName && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[140px] text-[#A25A24]">
                                  {task.projectName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectTask(task)}
                        className="p-1.5 rounded-lg hover:bg-white text-[#8C7665] hover:text-[#2C1810] transition-colors cursor-pointer shrink-0"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F2EBE1] flex items-center justify-between text-xs text-[#7A6656]">
            <span>Showing top urgent priority items</span>
            <button
              onClick={() => onOpenAIAssistantWithPrompt('Suggest optimal order of execution for my tasks based on cooling and tempering requirements')}
              className="text-[#A25A24] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              AI Optimize Task Sequence
            </button>
          </div>
        </div>

        {/* Right Column: Active High-Value Orders & Projects (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E8DEC8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F2EBE1]">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#C07D3E]" />
                <h2 className="font-display font-bold text-lg text-[#2C1810]">
                  Featured Custom Orders
                </h2>
              </div>
              <button
                onClick={onOpenNewProject}
                className="text-xs font-semibold text-[#A25A24] hover:text-[#7A421A] cursor-pointer"
              >
                + New Order
              </button>
            </div>

            <div className="space-y-3.5 mt-3">
              {projects.slice(0, 3).map(project => {
                return (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="p-3 rounded-xl border border-[#E8DEC8] hover:border-[#C07D3E]/50 hover:shadow-xs bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#E2D2BE]" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase bg-[#EFE3D3] text-[#7A4B29]">
                            {project.category}
                          </span>
                          <span className="text-xs font-bold text-[#2C1810]">
                            ${project.price}
                          </span>
                        </div>

                        <h3 className="font-semibold text-xs sm:text-sm text-[#2C1810] group-hover:text-[#A25A24] transition-colors truncate mt-1">
                          {project.title}
                        </h3>

                        <p className="text-[11px] text-[#7A6656] truncate mt-0.5">
                          Client: {project.clientName}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex-1 bg-[#E8DEC8] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#C07D3E] h-full rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-bold text-[#2C1810]">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('projects')}
            className="mt-4 w-full py-2 rounded-xl bg-[#F2ECE1] hover:bg-[#EAE0D1] text-[#2C1810] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            Browse All {projects.length} Orders
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
