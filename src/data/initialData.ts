import { Project, Task, StationStatus } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Imperial Gold & Velvet 3-Tier Wedding Cake',
    clientName: 'Lady Eleanor & Lord Arthur Sterling',
    clientContact: '+1 (555) 234-8901 • eleanor.sterling@example.com',
    category: 'Custom Cake',
    status: 'decorating',
    dueDate: '2026-09-16',
    deliveryTime: '14:00',
    price: 980,
    depositPaid: true,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: '3-tiered architectural wedding cake with hand-painted 24K edible gold leaf, wafer paper peonies, and velvet cocoa spray finish.',
    flavorProfile: 'Tier 1: Madagascar Vanilla Bean & Raspberry Compote • Tier 2: Belgian Dark Chocolate Ganache • Tier 3: Roasted Pistachio & Lemon Curd',
    servingsOrUnits: '120 guests (3 Tiers: 12", 9", 6")',
    dietaryNotes: ['Nut-containing (Tier 3)', 'Alcohol-free', 'Pasteurized eggs only'],
    progress: 75,
    notes: [
      'Client requested sturdy center doweling for 45-minute refrigerated van transit to St. Jude Manor.',
      'Sugar flowers must match blush pink swatch #E8C3B9.'
    ]
  },
  {
    id: 'proj-2',
    title: 'Grand Cru Single-Origin Truffle Box Collection (120 Sets)',
    clientName: 'Lumina Tech Gala (Corporate Executive Gifts)',
    clientContact: '+1 (555) 890-1234 • events@luminatech.io',
    category: 'Artisan Chocolate',
    status: 'production',
    dueDate: '2026-09-17',
    deliveryTime: '10:00',
    price: 1680,
    depositPaid: true,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    description: '16-piece luxury ballotins featuring 4 origin chocolates: 70% Madagascar Bourbon, 66% Ecuador Passionfruit, 64% Guayaquil Smoked Salt, and 38% White Yuzu.',
    flavorProfile: 'Madagascar Bourbon, Smoked Fleur de Sel Caramel, Passionfruit Ganache, and Piemonte Praline',
    servingsOrUnits: '120 ballotin gift boxes (1,920 bonbons total)',
    dietaryNotes: ['Soy-lecithin free', 'Gluten-free kitchen certified', 'Contains dairy'],
    progress: 55,
    notes: [
      'Embossed gold foil ribbon on matte charcoal packaging.',
      'Keep transport temperature at strictly 16°C–18°C.'
    ]
  },
  {
    id: 'proj-3',
    title: 'Botanical Sugar Bloom Celebration Cake',
    clientName: 'Dr. Aris Thorne',
    clientContact: '+1 (555) 456-7890 • aris.thorne@medical.org',
    category: 'Custom Cake',
    status: 'prep',
    dueDate: '2026-09-18',
    deliveryTime: '16:30',
    price: 450,
    depositPaid: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Modern rustic semi-naked cake adorned with pressed edible pansies, fresh blackberries, and gold splattered dark chocolate sails.',
    flavorProfile: 'Earl Grey Bergamot infused sponge with Meyer Lemon Curd and Swiss Meringue Buttercream',
    servingsOrUnits: '35 servings (2 Tiers: 8", 6")',
    dietaryNotes: ['Nut-free', 'Vegetarian'],
    progress: 30,
    notes: ['Celebration topper to be supplied by client upon pickup.']
  },
  {
    id: 'proj-4',
    title: 'Artisan Hand-Painted Ganache Bonbon Series',
    clientName: 'Le Petit Boutique Hotel',
    clientContact: '+1 (555) 678-9012 • concierge@lepetit-hotel.com',
    category: 'Artisan Chocolate',
    status: 'quality_check',
    dueDate: '2026-09-15',
    deliveryTime: '18:00',
    price: 820,
    depositPaid: true,
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=80',
    description: 'Bespoke pillow-shaped chocolate bonbons with cosmic airbrushed cocoa butter designs for VIP turn-down amenities.',
    flavorProfile: 'Tahitian Vanilla Bean, Espresso Kahlua Ganache, and Raspberry Balsamic Reduction',
    servingsOrUnits: '300 VIP individual dual-bonbon cases',
    dietaryNotes: ['Contains gelatin in fruit pate', 'Fair Trade Cacao'],
    progress: 90,
    notes: ['Inspect for mirror shine finish and shell snap before sealing.']
  },
  {
    id: 'proj-5',
    title: 'Autumn Hazelnut & Gianduja Macaron Tower (150pcs)',
    clientName: 'Camilla Moreau High Tea',
    clientContact: '+1 (555) 321-6549 • c.moreau@chateau.fr',
    category: 'Patisserie',
    status: 'ready',
    dueDate: '2026-09-15',
    deliveryTime: '15:00',
    price: 520,
    depositPaid: true,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
    description: '7-tier graduated ombre acrylic tower featuring Italian meringue macarons with roasted hazelnut gianduja and salted caramel cream.',
    flavorProfile: 'Roasted Gianduja, Fleur de Sel Caramel, and Dark Chocolate Ganache',
    servingsOrUnits: '150 pieces on 7-tier acrylic stand',
    dietaryNotes: ['Contains Almond & Hazelnut', 'Naturally Gluten-free'],
    progress: 100,
    notes: ['Tower stand requires $100 deposit bond; client returns Monday.']
  },
  {
    id: 'proj-6',
    title: 'Single-Estate Dark Chocolate Bar Batch (500 Bars)',
    clientName: 'Reserve Wine & Cacao Cellars',
    clientContact: '+1 (555) 765-4321 • cellars@reservewine.com',
    category: 'Gift Box',
    status: 'planning',
    dueDate: '2026-09-22',
    deliveryTime: '12:00',
    price: 2400,
    depositPaid: false,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    description: 'Batch of custom labeled 72% Chuao Venezuela chocolate bars with custom relief logo embossing.',
    flavorProfile: 'Single Estate Chuao 72% with notes of plum, molasses and cedar',
    servingsOrUnits: '500 foil-wrapped 80g artisanal bars',
    dietaryNotes: ['100% Vegan', 'Single Origin', 'Zero artificial additives'],
    progress: 15,
    notes: ['Awaiting final proof approval on paper sleeve artwork.']
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Hand-paint 24K edible gold leaf on Wedding Cake Tier 2',
    description: 'Use food-grade lemon extract with metallic gold dust; apply delicate geometric accents to 9" tier.',
    projectId: 'proj-1',
    projectName: 'Imperial Gold & Velvet 3-Tier Wedding Cake',
    category: 'Custom Cake',
    station: 'Decorating & Fondant',
    priority: 'Urgent',
    status: 'in_progress',
    dueDate: '2026-09-15',
    dueTime: '13:30',
    estimatedHours: 2.0,
    assignedTo: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      role: 'Master Cake Artist'
    },
    checklist: [
      { id: 'c1', text: 'Ensure cake surface chill is dry without condensation', completed: true },
      { id: 'c2', text: 'Mix gold luster with 95% neutral spirit', completed: true },
      { id: 'c3', text: 'Apply gold leaf detailing along tier rim', completed: false },
      { id: 'c4', text: 'Seal with edible glaze spray', completed: false }
    ],
    tags: ['Gold Leaf', 'Wedding Cake', 'VIP'],
    createdAt: '2026-09-14T08:00:00Z',
    temperatureNote: 'Room at 18°C'
  },
  {
    id: 'task-2',
    title: 'Temper 15kg Valrhona Guanaja (70%) dark chocolate',
    description: 'Melt to 55°C, cool to 28.5°C using table seeding method, reheat to working temp 31.5°C.',
    projectId: 'proj-2',
    projectName: 'Grand Cru Single-Origin Truffle Box Collection',
    category: 'Artisan Chocolate',
    station: 'Chocolate Tempering',
    priority: 'Urgent',
    status: 'in_progress',
    dueDate: '2026-09-15',
    dueTime: '14:00',
    estimatedHours: 2.5,
    assignedTo: {
      name: 'Henri Dubois',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Chief Chocolatier'
    },
    checklist: [
      { id: 'c5', text: 'Check melting kettle temperature readout (54.5°C)', completed: true },
      { id: 'c6', text: 'Add 20% fresh seeded couverture callets', completed: true },
      { id: 'c7', text: 'Perform crystallization paper test (snap in 3 min)', completed: false },
      { id: 'c8', text: 'Transfer to continuous tempering enrober', completed: false }
    ],
    tags: ['Tempering', 'Valrhona', 'Bulk Production'],
    createdAt: '2026-09-14T09:00:00Z',
    temperatureNote: 'Target: 31.5°C'
  },
  {
    id: 'task-3',
    title: 'Assemble & inspect 7-tier Macaron Tower for Camilla Moreau',
    description: 'Fasten acrylic tiers, arrange ombre shade gradient from roasted hazelnut to deep gianduja.',
    projectId: 'proj-5',
    projectName: 'Autumn Hazelnut & Gianduja Macaron Tower',
    category: 'Patisserie',
    station: 'Packaging & Dispatch',
    priority: 'High',
    status: 'completed',
    dueDate: '2026-09-15',
    dueTime: '11:00',
    estimatedHours: 1.5,
    assignedTo: {
      name: 'Sophie Lin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Pastry Assembler'
    },
    checklist: [
      { id: 'c9', text: 'Sanitize acrylic display tier plates', completed: true },
      { id: 'c10', text: 'Sort 150 shells by color gradations', completed: true },
      { id: 'c11', text: 'Apply food-safe royal icing glue points', completed: true },
      { id: 'c12', text: 'Enclose inside tall clear protective transit sleeve', completed: true }
    ],
    tags: ['Macaron', 'Tower', 'Ready for Pickup'],
    createdAt: '2026-09-14T10:00:00Z',
    completedAt: '2026-09-15T11:20:00Z'
  },
  {
    id: 'task-4',
    title: 'Bake Earl Grey sponge bases for Dr. Thorne cake',
    description: 'Steep whole bergamot tea leaves in hot milk, prepare tender sponge batter, bake in deck ovens at 165°C.',
    projectId: 'proj-3',
    projectName: 'Botanical Sugar Bloom Celebration Cake',
    category: 'Custom Cake',
    station: 'Baking & Ovens',
    priority: 'Medium',
    status: 'todo',
    dueDate: '2026-09-16',
    dueTime: '09:30',
    estimatedHours: 3.0,
    assignedTo: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Head Baker'
    },
    checklist: [
      { id: 'c13', text: 'Steep Earl Grey reduction concentrate for 20 mins', completed: false },
      { id: 'c14', text: 'Weigh organic flour and French butter', completed: false },
      { id: 'c15', text: 'Bake 8" and 6" cake pans for 32 mins', completed: false },
      { id: 'c16', text: 'Cool and plastic-wrap for crumb resting', completed: false }
    ],
    tags: ['Sponge', 'Deck Oven', 'Earl Grey'],
    createdAt: '2026-09-14T11:00:00Z'
  },
  {
    id: 'task-5',
    title: 'Quality inspection: check bonbon gloss & shell thickness',
    description: 'Random sample 10 bonbons under halogen reflection; measure shell caliber (<1.3mm) and filling seal.',
    projectId: 'proj-4',
    projectName: 'Artisan Hand-Painted Ganache Bonbon Series',
    category: 'Artisan Chocolate',
    station: 'Assembly & Filling',
    priority: 'Urgent',
    status: 'review',
    dueDate: '2026-09-15',
    dueTime: '16:00',
    estimatedHours: 1.0,
    assignedTo: {
      name: 'Henri Dubois',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Chief Chocolatier'
    },
    checklist: [
      { id: 'c17', text: 'Check for air bubble inclusions or fat bloom streaks', completed: true },
      { id: 'c18', text: 'Test base seal hermetic closure with light', completed: true },
      { id: 'c19', text: 'Package into VIP gold dual-cavity trays', completed: false }
    ],
    tags: ['Quality Check', 'Boutique Hotel', 'Gloss Meter'],
    createdAt: '2026-09-15T06:00:00Z'
  },
  {
    id: 'task-6',
    title: 'Prepare passionfruit & hazelnut praline ganache fillings',
    description: 'Emulsify 40% fruit puree with 34% cocoa butter white chocolate; grind Piemonte praline paste.',
    projectId: 'proj-2',
    projectName: 'Grand Cru Single-Origin Truffle Box Collection',
    category: 'Artisan Chocolate',
    station: 'Assembly & Filling',
    priority: 'High',
    status: 'todo',
    dueDate: '2026-09-16',
    dueTime: '11:00',
    estimatedHours: 2.0,
    assignedTo: {
      name: 'Sophie Lin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Pastry Assembler'
    },
    checklist: [
      { id: 'c20', text: 'Puree reduction to 68° Brix', completed: false },
      { id: 'c21', text: 'Immersion blend at 35°C for shiny elastic emulsion', completed: false },
      { id: 'c22', text: 'Fill into disposable piping bags and rest at 20°C', completed: false }
    ],
    tags: ['Ganache', 'Passionfruit', 'Emulsion'],
    createdAt: '2026-09-15T07:00:00Z'
  },
  {
    id: 'task-7',
    title: 'Reinforce Tier 1 to Tier 3 structural center dowels',
    description: 'Insert hardwood food-safe dowel rods into bottom tiers to support 18kg cake weight.',
    projectId: 'proj-1',
    projectName: 'Imperial Gold & Velvet 3-Tier Wedding Cake',
    category: 'Custom Cake',
    station: 'Decorating & Fondant',
    priority: 'Urgent',
    status: 'todo',
    dueDate: '2026-09-16',
    dueTime: '10:00',
    estimatedHours: 1.5,
    assignedTo: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      role: 'Master Cake Artist'
    },
    checklist: [
      { id: 'c23', text: 'Measure exact tier heights with depth gauge', completed: false },
      { id: 'c24', text: 'Cut 6 perimeter support dowels + 1 center spine', completed: false },
      { id: 'c25', text: 'Verify plumb level on spirit level indicator', completed: false }
    ],
    tags: ['Structure', 'Wedding Cake', 'Safety'],
    createdAt: '2026-09-15T07:30:00Z'
  },
  {
    id: 'task-8',
    title: 'Assemble 120 velvet ribbon ballotin boxes & cooling pads',
    description: 'Fold luxury gift boxes, insert gold dividers, place thermal cold gel packs into shipping crates.',
    projectId: 'proj-2',
    projectName: 'Grand Cru Single-Origin Truffle Box Collection',
    category: 'Gift Box',
    station: 'Packaging & Dispatch',
    priority: 'Medium',
    status: 'todo',
    dueDate: '2026-09-17',
    dueTime: '08:30',
    estimatedHours: 3.0,
    assignedTo: {
      name: 'Sophie Lin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Pastry Assembler'
    },
    checklist: [
      { id: 'c26', text: 'Inspect 120 printed allergen booklets', completed: false },
      { id: 'c27', text: 'Tie charcoal satin ribbons with diagonal cut', completed: false }
    ],
    tags: ['Packaging', 'Corporate Gala'],
    createdAt: '2026-09-15T08:00:00Z'
  }
];

export const INITIAL_STATIONS: StationStatus[] = [
  {
    id: 'st-1',
    name: 'Baking & Ovens',
    headChef: 'Marcus Vance',
    activeTasks: 2,
    completedToday: 5,
    ambientCondition: 'Deck 1: 175°C • Deck 2: 160°C',
    status: 'optimal'
  },
  {
    id: 'st-2',
    name: 'Chocolate Tempering',
    headChef: 'Henri Dubois',
    activeTasks: 3,
    completedToday: 4,
    ambientCondition: '18.8°C • 43% RH (Ideal Cacao Climate)',
    status: 'busy'
  },
  {
    id: 'st-3',
    name: 'Decorating & Fondant',
    headChef: 'Elena Rostova',
    activeTasks: 3,
    completedToday: 3,
    ambientCondition: '20.2°C • Low Air Draft',
    status: 'busy'
  },
  {
    id: 'st-4',
    name: 'Assembly & Filling',
    headChef: 'Sophie Lin',
    activeTasks: 2,
    completedToday: 6,
    ambientCondition: 'Chilled Prep: 15.5°C',
    status: 'optimal'
  },
  {
    id: 'st-5',
    name: 'Packaging & Dispatch',
    headChef: 'Sophie Lin',
    activeTasks: 2,
    completedToday: 8,
    ambientCondition: 'Transit Hold: 16°C',
    status: 'optimal'
  }
];

export const TEAM_MEMBERS = [
  {
    name: 'Elena Rostova',
    role: 'Master Cake Artist & Decorator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    station: 'Decorating & Fondant'
  },
  {
    name: 'Henri Dubois',
    role: 'Chief Chocolatier & Confectioner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    station: 'Chocolate Tempering'
  },
  {
    name: 'Marcus Vance',
    role: 'Head Baker & Sponge Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    station: 'Baking & Ovens'
  },
  {
    name: 'Sophie Lin',
    role: 'Pastry Assembler & Quality Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    station: 'Packaging & Dispatch'
  }
];
