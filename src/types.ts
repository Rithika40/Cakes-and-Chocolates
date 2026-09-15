export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export type Category = 'Custom Cake' | 'Artisan Chocolate' | 'Patisserie' | 'Gift Box';

export type Station = 
  | 'Baking & Ovens'
  | 'Chocolate Tempering'
  | 'Decorating & Fondant'
  | 'Assembly & Filling'
  | 'Packaging & Dispatch';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  projectName?: string;
  category: Category;
  station: Station;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedHours: number;
  assignedTo: {
    name: string;
    avatar: string;
    role: string;
  };
  checklist: ChecklistItem[];
  tags: string[];
  createdAt: string;
  completedAt?: string;
  temperatureNote?: string;
}

export type ProjectStatus = 
  | 'planning' 
  | 'prep' 
  | 'production' 
  | 'decorating' 
  | 'quality_check' 
  | 'ready' 
  | 'delivered';

export interface Project {
  id: string;
  title: string;
  clientName: string;
  clientContact: string;
  category: Category;
  status: ProjectStatus;
  dueDate: string;
  deliveryTime: string;
  price: number;
  depositPaid: boolean;
  image: string;
  description: string;
  flavorProfile: string;
  servingsOrUnits: string;
  dietaryNotes: string[];
  progress: number; // 0 - 100
  notes: string[];
}

export interface StationStatus {
  id: string;
  name: Station;
  headChef: string;
  activeTasks: number;
  completedToday: number;
  ambientCondition: string;
  status: 'optimal' | 'busy' | 'cooling' | 'cleaning';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  suggestedTasks?: Partial<Task>[];
}

export type ViewTab = 'dashboard' | 'tasks' | 'projects' | 'priorities' | 'analytics';
