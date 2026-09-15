import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { ProjectsView } from './components/ProjectsView';
import { PrioritiesView } from './components/PrioritiesView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { ProjectModal } from './components/ProjectModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';

import { 
  Project, 
  Task, 
  Priority, 
  TaskStatus, 
  StationStatus,
  ViewTab 
} from './types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_STATIONS 
} from './data/initialData';
import { Bot, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');

  // Persistence for Projects & Tasks
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('maison_cacao_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('maison_cacao_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [stations] = useState<StationStatus[]>(INITIAL_STATIONS);

  // Modal States
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('maison_cacao_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save failed for projects', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('maison_cacao_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage save failed for tasks', e);
    }
  }, [tasks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Task Handlers
  const handleSaveTask = (taskToSave: Task) => {
    setTasks(prev => {
      const index = prev.findIndex(t => t.id === taskToSave.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = taskToSave;
        return updated;
      }
      return [taskToSave, ...prev];
    });
    showToast(`Kitchen task saved: "${taskToSave.title.slice(0, 30)}..."`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    showToast('Task removed from kitchen queue');
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleUpdateTaskPriority = (taskId: string, newPriority: Priority) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, priority: newPriority };
      }
      return t;
    }));
    showToast(`Task priority updated to ${newPriority}`);
  };

  // Project Handlers
  const handleSaveProject = (projectToSave: Project) => {
    setProjects(prev => {
      const index = prev.findIndex(p => p.id === projectToSave.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = projectToSave;
        return updated;
      }
      return [projectToSave, ...prev];
    });
    showToast(`Order project saved: "${projectToSave.title}"`);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    showToast('Order project deleted');
  };

  // AI-generated tasks handler
  const handleAddGeneratedTasks = (newTasks: Task[]) => {
    setTasks(prev => [...newTasks, ...prev]);
    showToast(`Added ${newTasks.length} AI-formulated tasks to the kitchen schedule!`);
  };

  const handleOpenAIAssistantWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setIsAIAssistantOpen(true);
  };

  // Urgent count for Header badge
  const urgentCount = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'completed').length;

  // Keyboard shortcut (Cmd+K / Ctrl+K, Cmd+J / Ctrl+J)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAIAssistantOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1810] flex flex-col font-sans selection:bg-[#E8D0B5] selection:text-[#1E0F07]">
      
      {/* Top Navigation & Atelier Header */}
      <Header
        currentTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAIAssistant={() => {
          setAiInitialPrompt(undefined);
          setIsAIAssistantOpen(true);
        }}
        onOpenNewTask={() => {
          setSelectedTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenNewProject={() => {
          setSelectedProject(null);
          setIsProjectModalOpen(true);
        }}
        urgentCount={urgentCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            projects={projects}
            tasks={tasks}
            stations={stations}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectProject={(project) => {
              setSelectedProject(project);
              setIsProjectModalOpen(true);
            }}
            onSelectTask={(task) => {
              setSelectedTask(task);
              setIsTaskModalOpen(true);
            }}
            onToggleTaskComplete={handleToggleTaskComplete}
            onOpenNewTask={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            onOpenNewProject={() => {
              setSelectedProject(null);
              setIsProjectModalOpen(true);
            }}
            onTriggerAISummary={() => handleOpenAIAssistantWithPrompt('Provide a concise executive summary of today\'s confectionery production, active wedding cake orders, and stations needing immediate assistance.')}
            onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onSelectTask={(task) => {
              setSelectedTask(task);
              setIsTaskModalOpen(true);
            }}
            onOpenNewTask={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
            onToggleTaskComplete={handleToggleTaskComplete}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            tasks={tasks}
            onSelectProject={(project) => {
              setSelectedProject(project);
              setIsProjectModalOpen(true);
            }}
            onOpenNewProject={() => {
              setSelectedProject(null);
              setIsProjectModalOpen(true);
            }}
            onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
          />
        )}

        {activeTab === 'priorities' && (
          <PrioritiesView
            tasks={tasks}
            onSelectTask={(task) => {
              setSelectedTask(task);
              setIsTaskModalOpen(true);
            }}
            onUpdatePriority={handleUpdateTaskPriority}
            onToggleTaskComplete={handleToggleTaskComplete}
            onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            projects={projects}
            tasks={tasks}
            stations={stations}
            onOpenAIAssistantWithPrompt={handleOpenAIAssistantWithPrompt}
          />
        )}

      </main>

      {/* Floating Action Button: Quick Chef Cocoa AI Trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            setAiInitialPrompt(undefined);
            setIsAIAssistantOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#2C1810] to-[#43261A] text-white shadow-xl hover:shadow-2xl border border-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open Chef Cocoa AI Assistant (Ctrl+J)"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#2C1810] animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#2C1810]"></span>
          </div>
          <span className="text-xs font-bold font-display tracking-wide pr-1">
            Chef Cocoa AI
          </span>
          <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-amber-200">
            Ctrl+J
          </span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#2C1810] text-white text-xs font-semibold shadow-xl border border-amber-500/20 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projects={projects}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Project Order Details & AI Breakdown Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={selectedProject}
        tasks={tasks}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onAddGeneratedTasks={handleAddGeneratedTasks}
        onSelectTask={(task) => {
          setIsProjectModalOpen(false);
          setSelectedTask(task);
          setIsTaskModalOpen(true);
        }}
      />

      {/* AI Assistant Chatbot Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        tasks={tasks}
        projects={projects}
        onAddTaskFromAI={(taskData) => {
          handleSaveTask({
            id: `task-${Date.now()}`,
            title: taskData.title || 'AI Task',
            description: taskData.description || '',
            category: taskData.category || 'Custom Cake',
            station: taskData.station || 'Baking & Ovens',
            priority: taskData.priority || 'High',
            status: 'todo',
            dueDate: '2026-09-16',
            dueTime: '14:00',
            estimatedHours: taskData.estimatedHours || 1.5,
            assignedTo: {
              name: 'Elena Rostova',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
              role: 'Master Cake Artist'
            },
            checklist: [],
            tags: ['AI-Assistant'],
            createdAt: new Date().toISOString()
          });
        }}
        initialPrompt={aiInitialPrompt}
      />

      {/* Global Quick Search (Cmd+K) Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tasks={tasks}
        projects={projects}
        onSelectTask={(task) => {
          setSelectedTask(task);
          setIsTaskModalOpen(true);
        }}
        onSelectProject={(project) => {
          setSelectedProject(project);
          setIsProjectModalOpen(true);
        }}
      />

    </div>
  );
}
