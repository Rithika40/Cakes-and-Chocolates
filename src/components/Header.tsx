import React from 'react';
import { 
  Cake, 
  Sparkles, 
  Search, 
  Plus, 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Flame, 
  BarChart3, 
  Thermometer, 
  Bot,
  Bell
} from 'lucide-react';
import { ViewTab } from '../types';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenSearch: () => void;
  onOpenAIAssistant: () => void;
  onOpenNewTask: () => void;
  onOpenNewProject: () => void;
  urgentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenSearch,
  onOpenAIAssistant,
  onOpenNewTask,
  onOpenNewProject,
  urgentCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEC8]">
      {/* Top Banner: Climate & Quick Alert */}
      <div className="bg-[#2C1810] text-[#EADCC9] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Kitchen Status: Active Production
          </span>
          <span className="hidden sm:inline text-[#C0A892]">|</span>
          <span className="hidden sm:flex items-center gap-1.5 text-[#D4C3B2]">
            <Thermometer className="w-3.5 h-3.5 text-amber-300" />
            Chocolate Room: <strong className="text-white">18.8°C • 43% RH</strong> (Optimal Cacao Temp)
          </span>
          <span className="hidden md:inline text-[#C0A892]">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-[#D4C3B2]">
            Deck Ovens: <strong className="text-white">175°C / 160°C</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {urgentCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-semibold">
              <Flame className="w-3 h-3 text-amber-300" />
              {urgentCount} urgent tasks due today
            </span>
          )}
          <span className="text-[#C0A892] hidden sm:inline text-[11px]">
            Valrhona & French Butter Certified
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Atelier Name */}
          <div 
            onClick={() => onTabChange('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A3320] to-[#2C1810] flex items-center justify-center text-amber-300 shadow-md shadow-amber-950/10 border border-amber-400/20 group-hover:scale-105 transition-transform">
              <Cake className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-[#2C1810]">
                  Maison Cacao & Pâtisserie
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#EFE4D6] text-[#7A4B29] border border-[#E2D2BE]">
                  Studio Pro
                </span>
              </div>
              <p className="text-[11px] text-[#7C6757] font-medium hidden sm:block">
                Artisanal Bakery & Confectionery Operations
              </p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F2EBE1] p-1 rounded-xl border border-[#E5DAC6]">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-white text-[#2C1810] shadow-sm font-bold'
                  : 'text-[#6E5848] hover:text-[#2C1810] hover:bg-[#EBE2D5]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#C07D3E]" />
              Dashboard
            </button>

            <button
              onClick={() => onTabChange('tasks')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'tasks'
                  ? 'bg-white text-[#2C1810] shadow-sm font-bold'
                  : 'text-[#6E5848] hover:text-[#2C1810] hover:bg-[#EBE2D5]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#C07D3E]" />
              Task Management
            </button>

            <button
              onClick={() => onTabChange('projects')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'projects'
                  ? 'bg-white text-[#2C1810] shadow-sm font-bold'
                  : 'text-[#6E5848] hover:text-[#2C1810] hover:bg-[#EBE2D5]'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#C07D3E]" />
              Project Orders
            </button>

            <button
              onClick={() => onTabChange('priorities')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'priorities'
                  ? 'bg-white text-[#2C1810] shadow-sm font-bold'
                  : 'text-[#6E5848] hover:text-[#2C1810] hover:bg-[#EBE2D5]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#C07D3E]" />
              Priorities Matrix
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'analytics'
                  ? 'bg-white text-[#2C1810] shadow-sm font-bold'
                  : 'text-[#6E5848] hover:text-[#2C1810] hover:bg-[#EBE2D5]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#C07D3E]" />
              Progress Analytics
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Trigger Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F2EBE1] hover:bg-[#EBE2D5] border border-[#E5DAC6] text-[#6E5848] text-xs font-medium transition-colors cursor-pointer"
              title="Search orders, tasks, and ingredients (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#8A715F]" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#8A715F] bg-white rounded border border-[#D9CABE]">
                ⌘K
              </kbd>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C07D3E] to-[#9C5824] hover:from-[#B16F34] hover:to-[#8B4C1D] text-white text-xs font-bold shadow-sm shadow-amber-900/20 transition-all transform active:scale-95 cursor-pointer"
              title="Open Chef Cocoa AI Assistant"
            >
              <Bot className="w-4 h-4 text-amber-200 animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="hidden md:inline">Ask</span>
              <span>Chef Cocoa AI</span>
              <Sparkles className="w-3 h-3 text-amber-200" />
            </button>

            {/* Create Task Button */}
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C1810] hover:bg-[#43261A] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span> Task
            </button>

            {/* Create Project Button */}
            <button
              onClick={onOpenNewProject}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F7F2EA] text-[#2C1810] border border-[#D8C7B5] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C07D3E]" />
              New Order
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 gap-1 border-t border-[#EAE0CD] text-xs no-scrollbar">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'dashboard' ? 'bg-[#2C1810] text-white' : 'text-[#6E5848]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('tasks')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'tasks' ? 'bg-[#2C1810] text-white' : 'text-[#6E5848]'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => onTabChange('projects')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'projects' ? 'bg-[#2C1810] text-white' : 'text-[#6E5848]'
            }`}
          >
            Project Orders
          </button>
          <button
            onClick={() => onTabChange('priorities')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'priorities' ? 'bg-[#2C1810] text-white' : 'text-[#6E5848]'
            }`}
          >
            Priorities
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`px-3 py-1 rounded-md whitespace-nowrap font-medium ${
              currentTab === 'analytics' ? 'bg-[#2C1810] text-white' : 'text-[#6E5848]'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
