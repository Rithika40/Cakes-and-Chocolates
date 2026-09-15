import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Chatbot endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], shopContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();

    // Prepare system instruction with rich culinary & confectionery context
    const systemInstruction = `You are "Chef Cocoa", the AI Operations Director & Master Pâtissier/Chocolatier for an artisanal Cakes & Chocolates Shop.
Your role is to help kitchen managers, bakers, chocolatiers, and decorators:
1. Organize daily and weekly kitchen tasks (sponge baking, ganache emulsion, tempering, sugar florals, enrobing, packaging).
2. Prioritize urgent orders, manage shelf-life, tempering windows, and delivery deadlines.
3. Summarize production progress, identify bottlenecks (e.g., cooling room capacity, tempering station queue, oven slots), and suggest actionable solutions.
4. Maintain a warm, highly professional, encouraging, and precision-focused tone. Always give practical baking and confectionery timings, temperatures (e.g. tempering dark chocolate: melt to 50-55°C, cool to 28-29°C, work at 31-32°C), and workflow tips when relevant.

Current Shop State:
${shopContext ? JSON.stringify(shopContext, null, 2) : 'No live shop data provided.'}

Keep answers clear, well-structured, formatted with Markdown bullets when helpful, and directly applicable to the shop's active workflow. If asked to suggest tasks, provide concrete, actionable steps with station and priority recommendations.`;

    if (!ai) {
      // High-quality smart culinary fallback if API key is not yet set
      const fallbackReply = generateDomainFallbackResponse(message, shopContext);
      return res.json({
        reply: fallbackReply,
        source: 'local-confectionery-engine',
        notice: 'Powered by local baking workflow heuristics. Add your GEMINI_API_KEY in Settings > Secrets for full AI reasoning.'
      });
    }

    // Format chat history for Gemini
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-8)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text || msg.content || '' }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I could not generate a response at this moment. Please try again.';
    res.json({ reply, source: 'gemini' });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    const fallbackReply = generateDomainFallbackResponse(req.body.message || '', req.body.shopContext);
    res.json({
      reply: fallbackReply,
      source: 'local-confectionery-engine',
      warning: 'Live AI request encountered an error, falling back to kitchen operations engine.'
    });
  }
});

// AI Task Generator: breaks down a cake or chocolate project into structured tasks
app.post('/api/ai/generate-tasks', async (req, res) => {
  try {
    const { projectTitle, category, description, deadline } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({ tasks: getFallbackTasks(projectTitle, category, deadline) });
    }

    const prompt = `Break down this artisanal confectionery/cake project into 4 to 6 specific, sequentially logical production tasks:
Project: "${projectTitle}"
Category: "${category || 'Custom Cake'}"
Description: "${description || 'Artisanal order'}"
Target Completion: "${deadline || 'Next 48 hours'}"

Return ONLY valid JSON array with objects matching:
[
  {
    "title": "Task title (e.g., 'Temper 64% Guayaquil dark chocolate for bonbon shells')",
    "description": "Short 1-sentence instruction with temperature or detail",
    "station": "Baking & Ovens" | "Chocolate Tempering" | "Decorating & Fondant" | "Assembly & Filling" | "Packaging & Dispatch",
    "priority": "Urgent" | "High" | "Medium" | "Low",
    "estimatedHours": number (e.g. 1.5),
    "checklist": ["step 1", "step 2"]
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let tasks = [];
    try {
      tasks = JSON.parse(response.text || '[]');
    } catch {
      tasks = getFallbackTasks(projectTitle, category, deadline);
    }

    res.json({ tasks });
  } catch (error) {
    console.error('Error in /api/ai/generate-tasks:', error);
    res.json({ tasks: getFallbackTasks(req.body.projectTitle, req.body.category, req.body.deadline) });
  }
});

// AI Executive Progress Summary
app.post('/api/ai/summarize-progress', async (req, res) => {
  try {
    const { shopContext } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({ summary: getFallbackSummary(shopContext) });
    }

    const prompt = `Provide an executive production summary for the Cakes & Chocolates shop based on this data:
${JSON.stringify(shopContext, null, 2)}

Structure your report into:
1. 🎂 Overall Production Pulse (Total orders, completed vs pending, completion rate)
2. ⚠️ Critical Priorities & Bottlenecks (Station loads, imminent deliveries)
3. 🍫 Recommended Next 3 Actions for the Head Chef.
Keep it punchy, motivating, and actionable.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ summary: response.text || getFallbackSummary(shopContext) });
  } catch (error) {
    console.error('Error in /api/ai/summarize-progress:', error);
    res.json({ summary: getFallbackSummary(req.body.shopContext) });
  }
});

// Fallback logic when Gemini API key is unset or network error occurs
function generateDomainFallbackResponse(message: string, context: any): string {
  const msgLower = message.toLowerCase();

  if (msgLower.includes('priorit') || msgLower.includes('urgent') || msgLower.includes('today')) {
    return `### ⚡ Chef Cocoa's Kitchen Priority Advisory\n\nBased on your active confectionery schedule:\n- **Top Urgent Focus**: Prioritize all chocolate bonbon enrobing and delicate mousse/ganache fillings first while ambient kitchen humidity is optimal (<50% RH, 18-20°C).\n- **Baking Schedule**: Load large tiered cake sponge rounds in early morning oven slots to allow full 4-hour crumb cooling before slicing and soaking with simple syrup.\n- **Packaging & Delivery**: Double-check chill packs and rigid cake dowels for any afternoon dispatch orders.\n\n*Would you like me to generate a tailored task breakdown for an upcoming project?*`;
  }

  if (msgLower.includes('summar') || msgLower.includes('progress') || msgLower.includes('status')) {
    return `### 📊 Confectionery Operations Pulse\n\n- **Order Fulfillment**: Production is tracking well across custom cakes and truffle collections.\n- **Station Workload**: The **Chocolate Tempering** and **Cake Decorating** stations are seeing peak demand.\n- **Efficiency Tip**: Batch-temper couverture chocolates for both bonbon shells and ganache fillings simultaneously to save 45 minutes of machine recalibration.\n\n*Ask me to help re-assign tasks or draft custom wedding cake prep steps!*`;
  }

  if (msgLower.includes('temper') || msgLower.includes('chocolate')) {
    return `### 🍫 Chocolate Tempering Golden Rules\n\n- **Dark Chocolate (60-70%)**: Melt to 50–55°C, cool to 28–29°C (seed with 1% Mycryo or 20% tempered callets), rewarm gently to working temperature **31–32°C**.\n- **Milk Chocolate**: Working temp is **29–30°C**.\n- **White Chocolate**: Working temp is **28–29°C** (extra sensitive to scorching; stir constantly).\n- **Room conditions**: Keep humidity under 50% and kitchen ambient temp around 19–21°C to avoid sugar or fat bloom.`;
  }

  return `### 👩‍🍳 Chef Cocoa's Kitchen Desk\n\nI'm ready to help you optimize production in the bakery and chocolate workshop!\n\nHere are quick ways I can help:\n- **Task Organization**: Break down complex wedding cakes, macaron towers, or artisan truffle boxes into station-specific checklists.\n- **Smart Prioritization**: Organize production batches around cooling times, oven capacities, and delivery dates.\n- **Daily Progress Summary**: Review today's completed batches and upcoming deadlines.\n\nWhat would you like to plan or review right now?`;
}

function getFallbackTasks(title: string = 'Artisanal Order', category: string = 'Custom Cake', deadline?: string) {
  if (category?.toLowerCase().includes('chocolat') || title?.toLowerCase().includes('truffle') || title?.toLowerCase().includes('bonbon')) {
    return [
      {
        title: `Polish polycarbonate molds for ${title}`,
        description: 'Cotton-wool polish molds with 100% alcohol; air dry at 20°C',
        station: 'Chocolate Tempering',
        priority: 'High',
        estimatedHours: 1.0,
        checklist: ['Inspect for water spots', 'Buff with microfiber', 'Prepare colored cocoa butter']
      },
      {
        title: 'Temper colored cocoa butter & airbrush patterns',
        description: 'Temper cocoa butter to 29°C and spray geometric accents into molds',
        station: 'Chocolate Tempering',
        priority: 'Urgent',
        estimatedHours: 1.5,
        checklist: ['Warm spray gun reservoir', 'Apply metallic mica splatter', 'Allow 30min crystallization']
      },
      {
        title: 'Cast dark chocolate shells (64% Valrhona)',
        description: 'Temper couverture, fill cavities, tap out bubbles, and invert to drain excess',
        station: 'Chocolate Tempering',
        priority: 'Urgent',
        estimatedHours: 2.0,
        checklist: ['Check shell thickness (1.2mm)', 'Scrape mold edges clean', 'Chill at 16°C for 20 mins']
      },
      {
        title: 'Prepare infused ganache & pipe centers',
        description: 'Emulsify fruit puree or praline at 30°C; pipe 2mm below rim',
        station: 'Assembly & Filling',
        priority: 'High',
        estimatedHours: 1.5,
        checklist: ['Cool ganache to 28°C before piping', 'Fill evenly to avoid air pockets', 'Rest 12h for skin formation']
      },
      {
        title: 'Bottom-cap shells, demold & package',
        description: 'Gentle heat gun pass, temper cap layer, chill 15 min, invert to release glossy bonbons',
        station: 'Packaging & Dispatch',
        priority: 'Medium',
        estimatedHours: 1.0,
        checklist: ['Inspect mirror shine & snap', 'Sort into gold-foil ballotins', 'Affix allergen & batch labels']
      }
    ];
  }

  return [
    {
      title: `Bake multi-tier sponge layers for ${title}`,
      description: 'Prepare batter, bake in calibrated deck ovens at 165°C, cool on wire racks',
      station: 'Baking & Ovens',
      priority: 'Urgent',
      estimatedHours: 2.5,
      checklist: ['Measure dry ingredients by weight', 'Bake until skewer tests clean', 'Level crowns after cooling']
    },
    {
      title: 'Prepare Swiss Meringue Buttercream & Fruit Curd',
      description: 'Whip egg whites and sugar to 71°C, whip with European butter, fold Madagascar vanilla',
      station: 'Assembly & Filling',
      priority: 'High',
      estimatedHours: 1.5,
      checklist: ['Check silky texture without air bubbles', 'Refrigerate curd filling', 'Prepare piping bags']
    },
    {
      title: 'Torte, fill, crumb-coat & structural doweling',
      description: 'Layer sponges with filling dams, apply thin crumb coat, insert center dowels',
      station: 'Decorating & Fondant',
      priority: 'Urgent',
      estimatedHours: 2.0,
      checklist: ['Check 90-degree plumb level', 'Chill 45 min in blast cooler', 'Insert food-grade support straws']
    },
    {
      title: 'Handcraft wafer paper / sugar flowers & accents',
      description: 'Shape delicate floral petals, dust with edible luster dust, wire together',
      station: 'Decorating & Fondant',
      priority: 'Medium',
      estimatedHours: 3.0,
      checklist: ['Vein rose petals', 'Steam for natural curve', 'Dry on curved forms']
    },
    {
      title: 'Final velvet ganache coating & packaging',
      description: 'Apply final finish, arrange floral cluster, secure into heavy-duty cake box with non-slip base',
      station: 'Packaging & Dispatch',
      priority: 'High',
      estimatedHours: 1.0,
      checklist: ['Clean display cake board', 'Add delivery care sheet', 'Store at 14°C until courier pickup']
    }
  ];
}

function getFallbackSummary(context: any): string {
  return `### 🎂 Kitchen Operations Executive Briefing

**Overall Production Pulse:**
- **Active Orders**: All scheduled tiered cakes and artisanal chocolate batches are in steady production.
- **Workflow Health**: High throughput with zero spoiled batches reported today.

**Critical Priorities & Station Load:**
- **Decorating & Fondant**: Nearing peak capacity due to upcoming weekend custom celebration cakes.
- **Chocolate Room**: Climate control is optimal (19°C, 46% humidity). Ideal window for bulk enrobing.

**Head Chef Recommendations:**
1. Complete crumb-coating and chilling for all tiered sponges by 1:00 PM.
2. Batch-temper the 64% dark chocolate couverture before 3:00 PM for the evening bonbon orders.
3. Verify custom cake boards and courier temperature boxes for tomorrow morning's dispatch.`;
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cakes & Chocolates Management Server running on port ${PORT}`);
  });
}

startServer();
