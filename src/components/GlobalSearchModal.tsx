import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FolderKanban, CheckSquare, Clock, ArrowRight, User, Sparkles } from 'lucide-react';
import { Task, Project } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
  onSelectProject: (project: Project) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  onSelectTask,
  onSelectProject
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'projects'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedProjects = (filterType === 'all' || filterType === 'projects')
    ? projects.filter(p => 
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.flavorProfile.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    : [];

  const matchedTasks = (filterType === 'all' || filterType === 'tasks')
    ? tasks.filter(t => 
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.station.toLowerCase().includes(q) ||
        t.assignedTo.name.toLowerCase().includes(q) ||
        (t.projectName && t.projectName.toLowerCase().includes(q))
      )
    : [];

  const totalResults = matchedProjects.length + matchedTasks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E8DEC8] shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E8DEC8] flex items-center gap-3 bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#8C7665] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, orders, clients, flavors, and chefs..."
            className="flex-1 bg-transparent text-sm text-[#2C1810] placeholder-[#8C7665] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8C7665] hover:text-[#2C1810] p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EAE0D1] text-[#8C7665] hover:text-[#2C1810] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#F2ECE1] flex items-center justify-between text-xs bg-white">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#2C1810] text-white'
                  : 'text-[#6E5848] hover:bg-[#FAF7F2]'
              }`}
            >
              All Results ({totalResults})
            </button>
            <button
              onClick={() => setFilterType('tasks')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'tasks'
                  ? 'bg-[#2C1810] text-white'
                  : 'text-[#6E5848] hover:bg-[#FAF7F2]'
              }`}
            >
              Tasks ({matchedTasks.length})
            </button>
            <button
              onClick={() => setFilterType('projects')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                filterType === 'projects'
                  ? 'bg-[#2C1810] text-white'
                  : 'text-[#6E5848] hover:bg-[#FAF7F2]'
              }`}
            >
              Orders ({matchedProjects.length})
            </button>
          </div>

          <span className="text-[11px] text-[#8C7665] hidden sm:inline">
            Press ESC to exit
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-xs text-[#8C7665]">
              <Search className="w-8 h-8 text-[#C8B8A6] mx-auto mb-2" />
              <p className="font-semibold text-sm text-[#2C1810]">No confectionery items matched "{query}"</p>
              <p className="mt-1">Try searching for "ganache", "wedding cake", "temper", or "Valrhona"</p>
            </div>
          ) : (
            <>
              {/* Projects Section */}
              {matchedProjects.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A25A24] px-1 flex items-center gap-1">
                    <FolderKanban className="w-3 h-3" />
                    Orders & Projects ({matchedProjects.length})
                  </span>

                  <div className="space-y-1.5">
                    {matchedProjects.map(project => (
                      <div
                        key={project.id}
                        onClick={() => {
                          onSelectProject(project);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-[#E8DEC8] hover:border-[#C07D3E] hover:bg-[#FAF7F2] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E2D2BE] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs text-[#2C1810] group-hover:text-[#A25A24] transition-colors truncate">
                              {project.title}
                            </h4>
                            <p className="text-[11px] text-[#7A6656] truncate">
                              Client: {project.clientName} • Due {project.dueDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-[#2C1810]">
                            ${project.price}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C07D3E] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Section */}
              {matchedTasks.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A25A24] px-1 flex items-center gap-1">
                    <CheckSquare className="w-3 h-3" />
                    Kitchen Tasks ({matchedTasks.length})
                  </span>

                  <div className="space-y-1.5">
                    {matchedTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => {
                          onSelectTask(task);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-[#E8DEC8] hover:border-[#C07D3E] hover:bg-[#FAF7F2] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FAF7F2] text-[#7A6656] border border-[#E8DEC8]">
                              {task.station}
                            </span>
                            <span className="text-xs font-semibold text-[#2C1810] group-hover:text-[#A25A24] transition-colors truncate">
                              {task.title}
                            </span>
                          </div>
                          {task.projectName && (
                            <p className="text-[11px] text-[#A25A24] truncate">
                              {task.projectName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#7A6656] shrink-0">
                          <span className="font-medium text-[#2C1810]">{task.assignedTo.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C07D3E] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
