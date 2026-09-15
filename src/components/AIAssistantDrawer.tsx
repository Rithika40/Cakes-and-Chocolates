import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  RotateCcw, 
  ChefHat, 
  Flame, 
  CheckSquare, 
  BarChart3, 
  Plus, 
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage, Task, Project } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  onAddTaskFromAI: (taskData: Partial<Task>) => void;
  initialPrompt?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  onAddTaskFromAI,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `### 👩‍🍳 Bonjour! I am Chef Cocoa, your AI Kitchen Operations Director.

I'm monitoring our cakes and chocolates atelier in real-time. How can I assist you today?
- **Task Organization**: Break down complex wedding cakes, macaron towers, or artisan chocolate batches into station-ready checklists.
- **Smart Prioritization**: Coordinate oven schedules, ganache cooling windows, and urgent delivery deadlines.
- **Progress Summary**: Review today's completed batches and identify any station bottlenecks.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Gather relevant shop context
      const shopContext = {
        totalOrders: projects.length,
        projects: projects.map(p => ({
          title: p.title,
          category: p.category,
          progress: p.progress,
          dueDate: p.dueDate,
          price: p.price
        })),
        tasksSummary: {
          total: tasks.length,
          urgent: tasks.filter(t => t.priority === 'Urgent' && t.status !== 'completed').length,
          completed: tasks.filter(t => t.status === 'completed').length,
          active: tasks.filter(t => t.status !== 'completed').map(t => ({
            title: t.title,
            station: t.station,
            priority: t.priority,
            dueDate: t.dueDate
          }))
        }
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.slice(-6),
          shopContext
        })
      });

      const data = await res.json();
      const replyText = data.reply || "I apologize, I wasn't able to process that right now. Please try again.";

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          text: "I'm having trouble contacting the kitchen AI server. Here is a quick reminder: keep dark chocolate working temp at 31–32°C and ensure tiered cake dowels are inserted squarely before transit!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: '⚡ Prioritize urgent work', prompt: 'Prioritize today\'s urgent tasks based on cooling times and delivery deadlines' },
    { label: '📊 Summarize kitchen progress', prompt: 'Summarize today\'s overall production progress and highlight any bottlenecks' },
    { label: '🎂 3-Tier wedding cake workflow', prompt: 'Provide step-by-step production workflow for a 3-tier custom wedding cake with timings' },
    { label: '🍫 Chocolate tempering temperatures', prompt: 'What are the precise tempering curves and working temperatures for Dark, Milk, and White chocolate?' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg h-full border-l border-[#E8DEC8] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="bg-[#2C1810] px-5 py-4 text-white flex items-center justify-between border-b border-[#43261A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C07D3E] to-[#8C4E20] flex items-center justify-center text-amber-200 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-display font-bold text-sm">Chef Cocoa AI</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-[#C0A892]">
                Kitchen Operations Director & Confectionery Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([messages[0]]);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C0A892] hover:text-white transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#C0A892] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestions Bar */}
        <div className="px-4 py-2.5 bg-[#FAF7F2] border-b border-[#E8DEC8] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-semibold text-[#8C7665] whitespace-nowrap">
            Suggestions:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.prompt)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#F2ECE1] border border-[#E2D2BE] text-[#6E5848] hover:text-[#2C1810] whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF7F2]/40">
          {messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#2C1810] text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <ChefHat className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#2C1810] text-white rounded-br-xs font-medium'
                      : 'bg-white text-[#2C1810] border border-[#E8DEC8] rounded-bl-xs'
                  }`}
                >
                  {/* Message body with formatted markdown elements */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[10px] text-[#8C7665]">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-[#2C1810] cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-[#2C1810] text-amber-300 flex items-center justify-center shrink-0">
                <ChefHat className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl p-3.5 text-xs border border-[#E8DEC8] shadow-xs flex items-center gap-2 text-[#7A6656]">
                <Loader2 className="w-4 h-4 animate-spin text-[#C07D3E]" />
                <span>Chef Cocoa is formulating confectionery guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-[#E8DEC8]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about tasks, recipe timings, or urgent priorities..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-xs text-[#2C1810] focus:outline-none focus:border-[#C07D3E]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#2C1810] hover:bg-[#43261A] text-white disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-[#8C7665] mt-2 px-1">
            <span>Powered by Gemini 3.8 Flash & Confectionery Engine</span>
            <span>Esc to close</span>
          </div>
        </div>

      </div>
    </div>
  );
};
