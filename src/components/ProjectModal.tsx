import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Trash2, 
  CheckSquare, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Project, Category, ProjectStatus, Task } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  tasks: Task[];
  onSaveProject: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  onAddGeneratedTasks: (tasks: Task[]) => void;
  onSelectTask?: (task: Task) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  tasks,
  onSaveProject,
  onDeleteProject,
  onAddGeneratedTasks,
  onSelectTask
}) => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [category, setCategory] = useState<Category>('Custom Cake');
  const [status, setStatus] = useState<ProjectStatus>('prep');
  const [dueDate, setDueDate] = useState('2026-09-18');
  const [deliveryTime, setDeliveryTime] = useState('14:00');
  const [price, setPrice] = useState<number>(450);
  const [depositPaid, setDepositPaid] = useState<boolean>(true);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [flavorProfile, setFlavorProfile] = useState('');
  const [servingsOrUnits, setServingsOrUnits] = useState('40 servings');
  const [progress, setProgress] = useState<number>(30);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [generatedNotification, setGeneratedNotification] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setClientName(project.clientName);
      setClientContact(project.clientContact);
      setCategory(project.category);
      setStatus(project.status);
      setDueDate(project.dueDate);
      setDeliveryTime(project.deliveryTime);
      setPrice(project.price);
      setDepositPaid(project.depositPaid);
      setImage(project.image);
      setDescription(project.description);
      setFlavorProfile(project.flavorProfile);
      setServingsOrUnits(project.servingsOrUnits);
      setProgress(project.progress);
      setNotes(project.notes || []);
    } else {
      setTitle('');
      setClientName('');
      setClientContact('');
      setCategory('Custom Cake');
      setStatus('planning');
      setDueDate('2026-09-20');
      setDeliveryTime('15:00');
      setPrice(500);
      setDepositPaid(true);
      setImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80');
      setDescription('');
      setFlavorProfile('Valrhona dark chocolate sponge with fresh raspberries & dark ganache');
      setServingsOrUnits('50 servings (2-tier)');
      setProgress(10);
      setNotes(['Refrigerate at 14°C before transport']);
    }
    setGeneratedNotification(null);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const projectTasks = project ? tasks.filter(t => t.projectId === project.id) : [];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes([...notes, newNote.trim()]);
    setNewNote('');
  };

  const handleRemoveNote = (idx: number) => {
    setNotes(notes.filter((_, i) => i !== idx));
  };

  // AI Task Breakdown Generation
  const handleGenerateTaskBreakdown = async () => {
    setIsGeneratingTasks(true);
    setGeneratedNotification(null);

    try {
      const response = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: title,
          category,
          description,
          deadline: `${dueDate} ${deliveryTime}`
        })
      });

      const data = await response.json();
      const rawTasks = data.tasks || [];

      if (Array.isArray(rawTasks) && rawTasks.length > 0) {
        const assignedTargetProject = project?.id || `proj-${Date.now()}`;
        const newFormattedTasks: Task[] = rawTasks.map((t: any, idx: number) => ({
          id: `task-gen-${Date.now()}-${idx}`,
          title: t.title || 'Production step',
          description: t.description || 'Follow standard recipe procedure',
          projectId: assignedTargetProject,
          projectName: title,
          category,
          station: t.station || 'Baking & Ovens',
          priority: t.priority || 'High',
          status: 'todo',
          dueDate,
          dueTime: '12:00',
          estimatedHours: t.estimatedHours || 1.5,
          assignedTo: {
            name: 'Elena Rostova',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
            role: 'Master Cake Artist'
          },
          checklist: Array.isArray(t.checklist) 
            ? t.checklist.map((stepText: string, cIdx: number) => ({
                id: `c-${Date.now()}-${cIdx}`,
                text: stepText,
                completed: false
              }))
            : [],
          tags: [category, 'AI-Generated'],
          createdAt: new Date().toISOString()
        }));

        onAddGeneratedTasks(newFormattedTasks);
        setGeneratedNotification(`✨ Successfully formulated ${newFormattedTasks.length} production tasks for the kitchen board!`);
      }
    } catch (err) {
      console.error('Task breakdown generation failed:', err);
      setGeneratedNotification('Kitchen generation error. Please try again.');
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const updatedProject: Project = {
      id: project ? project.id : `proj-${Date.now()}`,
      title: title.trim(),
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      category,
      status,
      dueDate,
      deliveryTime,
      price: Number(price) || 0,
      depositPaid,
      image,
      description: description.trim(),
      flavorProfile: flavorProfile.trim(),
      servingsOrUnits: servingsOrUnits.trim(),
      dietaryNotes: project?.dietaryNotes || ['Standard Artisanal'],
      progress: Number(progress) || 0,
      notes
    };

    onSaveProject(updatedProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#E8DEC8] shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-[#2C1810] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h2 className="font-display font-bold text-lg">
              {project ? 'Order Project Details' : 'New Custom Confectionery Order'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* Row: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Order / Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Imperial Gold & Velvet 3-Tier Wedding Cake"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-sm text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
              >
                <option value="Custom Cake">Custom Cake</option>
                <option value="Artisan Chocolate">Artisan Chocolate</option>
                <option value="Patisserie">Patisserie</option>
                <option value="Gift Box">Gift Box</option>
              </select>
            </div>
          </div>

          {/* Row: Client Details & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Client Name / Organization *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Lady Eleanor Sterling"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Client Contact Details
              </label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="Phone & Email"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>
          </div>

          {/* Row: Flavor Profile & Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Flavor Profile & Couvertures
              </label>
              <textarea
                rows={2}
                value={flavorProfile}
                onChange={(e) => setFlavorProfile(e.target.value)}
                placeholder="Specific sponges, ganaches, and fruit reductions..."
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Servings / Units & Scale
              </label>
              <input
                type="text"
                value={servingsOrUnits}
                onChange={(e) => setServingsOrUnits(e.target.value)}
                placeholder="e.g. 120 guests (3 Tiers: 12', 9', 6')"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E] mb-2"
              />
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Reference Image URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>
          </div>

          {/* Row: Price, Status & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Price ($ USD)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Production Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#C07D3E] cursor-pointer"
              >
                <option value="planning">Planning</option>
                <option value="prep">Recipe Prep</option>
                <option value="production">In Production</option>
                <option value="decorating">Decorating</option>
                <option value="quality_check">Quality Check</option>
                <option value="ready">Ready for Dispatch</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Progress ({progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-[#C07D3E] cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Row: Due Date & Delivery Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Delivery / Event Date
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
                Dispatch Target Time
              </label>
              <input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
              />
            </div>
          </div>

          {/* AI Task Breakdown Generator Section */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF7F2] to-[#F5EFE6] border border-[#E8DEC8] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-xs text-[#2C1810] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C07D3E]" />
                  AI Production Task Breakdown
                </span>
                <p className="text-[11px] text-[#7A6656]">
                  Automatically generate sequential pastry & tempering checklist tasks for this order
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateTaskBreakdown}
                disabled={isGeneratingTasks}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#C07D3E] to-[#9C5824] hover:from-[#B16F34] hover:to-[#8B4C1D] text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
              >
                {isGeneratingTasks ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-200" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                )}
                {isGeneratingTasks ? 'Formulating Steps...' : 'Generate Tasks with AI'}
              </button>
            </div>

            {generatedNotification && (
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                {generatedNotification}
              </div>
            )}
          </div>

          {/* Associated Active Tasks for this Project */}
          {project && (
            <div className="pt-2 border-t border-[#F2ECE1]">
              <h3 className="text-xs font-bold text-[#2C1810] uppercase tracking-wider mb-2">
                Active Kitchen Tasks for this Order ({projectTasks.length})
              </h3>

              {projectTasks.length === 0 ? (
                <p className="text-xs text-[#8C7665] italic py-1">
                  No tasks assigned yet. Click "Generate Tasks with AI" above to automatically create them!
                </p>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {projectTasks.map(task => {
                    const isDone = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask && onSelectTask(task)}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E8DEC8] text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600' : 'text-[#8C7665]'}`} />
                          <span className={`font-medium ${isDone ? 'line-through text-[#8C7665]' : 'text-[#2C1810]'}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#7A6656] border border-[#E8DEC8]">
                            {task.station}
                          </span>
                          <span className="text-[10px] font-bold text-[#A25A24]">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between gap-3">
            {project && onDeleteProject ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this custom order project?')) {
                    onDeleteProject(project.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Order
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
                {project ? 'Save Changes' : 'Create Order Project'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
