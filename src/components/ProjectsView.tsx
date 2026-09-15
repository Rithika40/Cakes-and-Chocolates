import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ChevronRight, 
  Layers,
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Project, Category, ProjectStatus, Task } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (project: Project) => void;
  onOpenNewProject: () => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onSelectProject,
  onOpenNewProject,
  onOpenAIAssistantWithPrompt
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.flavorProfile.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'planning':
        return { label: 'Planning', bg: 'bg-stone-100 text-stone-700 border-stone-200' };
      case 'prep':
        return { label: 'Recipe Prep', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'production':
        return { label: 'In Production', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'decorating':
        return { label: 'Decorating', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'quality_check':
        return { label: 'Quality Check', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'ready':
        return { label: 'Ready for Dispatch', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'delivered':
        return { label: 'Delivered', bg: 'bg-teal-100 text-teal-800 border-teal-200' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Bespoke Confectionery Orders & Projects
          </h1>
          <p className="text-sm text-[#7A6656] mt-0.5">
            Manage custom wedding cakes, luxury chocolate gift series, and high-tea patisseries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAIAssistantWithPrompt('Review all our custom cake and chocolate orders and recommend the ideal baking and tempering sequence')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2ECE1] hover:bg-[#EAE0D1] text-[#7A4B29] border border-[#E2D2BE] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C07D3E]" />
            AI Production Advice
          </button>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2C1810] hover:bg-[#43261A] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Order Project
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7665]" />
          <input
            type="text"
            placeholder="Search by client, flavor, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs focus:outline-none focus:border-[#C07D3E] text-[#2C1810]"
          />
        </div>

        {/* Category & Status tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Custom Cake">Custom Cake</option>
            <option value="Artisan Chocolate">Artisan Chocolate</option>
            <option value="Patisserie">Patisserie</option>
            <option value="Gift Box">Gift Box</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="prep">Recipe Prep</option>
            <option value="production">In Production</option>
            <option value="decorating">Decorating</option>
            <option value="quality_check">Quality Check</option>
            <option value="ready">Ready for Dispatch</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => {
          const statusInfo = getStatusBadge(project.status);
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const completedTasks = projectTasks.filter(t => t.status === 'completed');

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-white rounded-2xl border border-[#E8DEC8] hover:border-[#C07D3E]/60 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#2C1810] uppercase tracking-wider shadow-xs">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#2C1810]/90 text-amber-300 backdrop-blur-xs border border-amber-300/30">
                      ${project.price}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider backdrop-blur-xs ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#2C1810] group-hover:text-[#A25A24] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#8C7665] font-medium mt-0.5 truncate">
                      Client: <span className="text-[#2C1810]">{project.clientName}</span>
                    </p>
                  </div>

                  {/* Flavor profile highlight */}
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A25A24] block mb-0.5">
                      Flavor & Notes
                    </span>
                    <p className="text-[11px] text-[#6E5848] line-clamp-2">
                      {project.flavorProfile}
                    </p>
                  </div>

                  {/* Servings & Deadline */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7A6656] pt-1">
                    <div className="flex items-center gap-1 truncate">
                      <Layers className="w-3 h-3 text-[#A25A24] shrink-0" />
                      <span className="truncate">{project.servingsOrUnits}</span>
                    </div>

                    <div className="flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3 text-[#A25A24] shrink-0" />
                      <span>Due: {project.dueDate}</span>
                    </div>
                  </div>

                  {/* Production Progress Bar */}
                  <div className="space-y-1 pt-2 border-t border-[#F2ECE1]">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#7A6656]">Production Progress</span>
                      <span className="text-[#2C1810]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-[#EAE1D3] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#C07D3E] to-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Tasks count & View details trigger */}
              <div className="px-5 py-3 bg-[#FAF7F2] border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                <span className="text-[#7A6656] font-medium">
                  {projectTasks.length} Kitchen Tasks ({completedTasks.length} done)
                </span>
                <span className="text-[#A25A24] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect Order
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
