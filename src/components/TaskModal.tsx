import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  CheckSquare, 
  User, 
  Layers, 
  Flame, 
  Thermometer,
  Loader2
} from 'lucide-react';
import { Task, Project, Station, Priority, Category, ChecklistItem } from '../types';
import { TEAM_MEMBERS } from '../data/initialData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  projects: Project[];
  onSaveTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  projects,
  onSaveTask,
  onDeleteTask
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [category, setCategory] = useState<Category>('Custom Cake');
  const [station, setStation] = useState<Station>('Baking & Ovens');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('2026-09-16');
  const [dueTime, setDueTime] = useState('14:00');
  const [estimatedHours, setEstimatedHours] = useState<number>(2.0);
  const [assignedName, setAssignedName] = useState(TEAM_MEMBERS[0].name);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [temperatureNote, setTemperatureNote] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setProjectId(task.projectId || '');
      setCategory(task.category);
      setStation(task.station);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setDueTime(task.dueTime || '12:00');
      setEstimatedHours(task.estimatedHours);
      setAssignedName(task.assignedTo.name);
      setChecklist(task.checklist || []);
      setTemperatureNote(task.temperatureNote || '');
    } else {
      // Reset defaults for new task
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || '');
      setCategory('Custom Cake');
      setStation('Baking & Ovens');
      setPriority('Medium');
      setDueDate('2026-09-16');
      setDueTime('14:00');
      setEstimatedHours(1.5);
      setAssignedName(TEAM_MEMBERS[0].name);
      setChecklist([
        { id: '1', text: 'Mise en place: weigh dry ingredients & chocolate couverture', completed: false },
        { id: '2', text: 'Preheat oven / calibrate tempering kettle', completed: false }
      ]);
      setTemperatureNote('');
    }
  }, [task, projects, isOpen]);

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistText.trim(),
      completed: false
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistText('');
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  // AI Suggest Kitchen Steps
  const handleAiSuggestSteps = async () => {
    if (!title.trim()) {
      alert('Please enter a task title first so Chef Cocoa knows what steps to formulate!');
      return;
    }

    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Given this confectionery/bakery task: "${title}" (Station: ${station}), provide 3 to 5 concise chronological kitchen checklist steps with specific temperatures or techniques. Format each as a bullet point starting with "- ".`
        })
      });

      const data = await response.json();
      const text = data.reply || '';
      
      // Parse bullet points
      const lines = text.split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => l.startsWith('- ') || l.startsWith('* ') || /^\d+\./.test(l))
        .map((l: string) => l.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter((l: string) => l.length > 5);

      if (lines.length > 0) {
        const newItems: ChecklistItem[] = lines.map((step: string, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          text: step,
          completed: false
        }));
        setChecklist(prev => [...prev, ...newItems]);
      } else {
        // Fallback culinary steps if model reply format differed
        setChecklist(prev => [
          ...prev,
          { id: `ai-1`, text: `Sanitize work station and check room humidity (<50% RH)`, completed: false },
          { id: `ai-2`, text: `Execute precise temperature check for ${station}`, completed: false },
          { id: `ai-3`, text: `Quality inspect texture, crumb, or chocolate gloss`, completed: false }
        ]);
      }
    } catch (err) {
      console.error('Failed to generate steps:', err);
      setChecklist(prev => [
        ...prev,
        { id: `ai-1`, text: `Measure ingredients with gram-precision scale`, completed: false },
        { id: `ai-2`, text: `Process at designated station temperature`, completed: false },
        { id: `ai-3`, text: `Transfer to temperature-controlled holding area`, completed: false }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedMember = TEAM_MEMBERS.find(m => m.name === assignedName) || TEAM_MEMBERS[0];
    const selectedProj = projects.find(p => p.id === projectId);

    const updatedTask: Task = {
      id: task ? task.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      projectId: selectedProj?.id,
      projectName: selectedProj?.title,
      category,
      station,
      priority,
      status: task ? task.status : 'todo',
      dueDate,
      dueTime,
      estimatedHours: Number(estimatedHours) || 1.5,
      assignedTo: {
        name: assignedMember.name,
        avatar: assignedMember.avatar,
        role: assignedMember.role
      },
      checklist,
      tags: task?.tags || [station.split(' ')[0], priority],
      createdAt: task ? task.createdAt : new Date().toISOString(),
      temperatureNote: temperatureNote.trim()
    };

    onSaveTask(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E8DEC8] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#2C1810] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className="font-display font-bold text-lg">
              {task ? 'Edit Production Task' : 'Create New Production Task'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-[#C0A892] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Temper 8kg Guayaquil 64% couverture for bonbon shells"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-sm text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
              Description & Specific Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed pastry techniques, specific flavor notes, or mold numbers..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
            />
          </div>

          {/* Row: Project & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Associated Order / Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
              >
                <option value="">-- General Kitchen Prep (No Order) --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} (${p.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Confectionery Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
              >
                <option value="Custom Cake">Custom Cake</option>
                <option value="Artisan Chocolate">Artisan Chocolate</option>
                <option value="Patisserie">Patisserie</option>
                <option value="Gift Box">Gift Box</option>
              </select>
            </div>
          </div>

          {/* Row: Station & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Kitchen Station *
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value as Station)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
              >
                <option value="Baking & Ovens">Baking & Ovens</option>
                <option value="Chocolate Tempering">Chocolate Tempering</option>
                <option value="Decorating & Fondant">Decorating & Fondant</option>
                <option value="Assembly & Filling">Assembly & Filling</option>
                <option value="Packaging & Dispatch">Packaging & Dispatch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs font-bold text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
              >
                <option value="Urgent">🔥 Urgent (Today / Perishable)</option>
                <option value="High">⚡ High Priority</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Low">Low (Maintenance / Stock)</option>
              </select>
            </div>
          </div>

          {/* Row: Due Date, Due Time & Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Target Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>
          </div>

          {/* Assigned Chef & Climate Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Assigned Chef / Specialist
              </label>
              <select
                value={assignedName}
                onChange={(e) => setAssignedName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
              >
                {TEAM_MEMBERS.map(member => (
                  <option key={member.name} value={member.name}>
                    {member.name} — {member.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Climate / Temperature Target
              </label>
              <input
                type="text"
                value={temperatureNote}
                onChange={(e) => setTemperatureNote(e.target.value)}
                placeholder="e.g., Hold at 31.5°C or Cool at 16°C"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>
          </div>

          {/* Interactive Checklist Section with AI Assistant */}
          <div className="pt-2 border-t border-[#F2ECE1]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#C07D3E]" />
                Station Checklist & Quality Gates ({checklist.length})
              </label>

              <button
                type="button"
                onClick={handleAiSuggestSteps}
                disabled={isAiLoading}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#C07D3E] to-[#9C5824] hover:from-[#B16F34] hover:to-[#8B4C1D] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-amber-200" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-200" />
                )}
                {isAiLoading ? 'Analyzing...' : 'AI Suggest Steps'}
              </button>
            </div>

            {/* Checklist items list */}
            <div className="space-y-1.5 mb-2.5 max-h-36 overflow-y-auto">
              {checklist.length === 0 ? (
                <p className="text-xs text-[#8C7665] italic py-1">No checklist steps yet. Add one below or click "AI Suggest Steps".</p>
              ) : (
                checklist.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8DEC8] text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklist(item.id)}
                        className="rounded border-[#C8B8A6] text-[#C07D3E] focus:ring-0 cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-[#8C7665]' : 'text-[#2C1810] font-medium'}>
                        {item.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklist(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new checklist input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                placeholder="Add checklist step (e.g. 'Chill for 45 mins'). Press Enter..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 rounded-xl bg-[#F2ECE1] hover:bg-[#EAE0D1] text-[#2C1810] text-xs font-semibold border border-[#E2D2BE] cursor-pointer"
              >
                Add Step
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between gap-3">
            {task && onDeleteTask ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this kitchen task?')) {
                    onDeleteTask(task.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            ) : <div></div>}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[#7A6656] hover:bg-[#FAF7F2] border border-[#E8DEC8] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2C1810] hover:bg-[#43261A] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {task ? 'Update Task' : 'Add to Kitchen Queue'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
