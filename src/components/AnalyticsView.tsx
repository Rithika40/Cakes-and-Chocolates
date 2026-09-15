import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Thermometer, 
  Layers, 
  ChefHat, 
  Clock,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Project, Task, StationStatus } from '../types';

interface AnalyticsViewProps {
  projects: Project[];
  tasks: Task[];
  stations: StationStatus[];
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  projects,
  tasks,
  stations,
  onOpenAIAssistantWithPrompt
}) => {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const todoTasks = tasks.filter(t => t.status === 'todo');

  const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const completedHours = completedTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  // Station counts
  const stationWorkload = stations.map(station => {
    const stationTasks = tasks.filter(t => t.station === station.name);
    const stationCompleted = stationTasks.filter(t => t.status === 'completed').length;
    return {
      name: station.name,
      total: stationTasks.length,
      completed: stationCompleted,
      active: stationTasks.length - stationCompleted,
      headChef: station.headChef
    };
  });

  // Category counts
  const categories = ['Custom Cake', 'Artisan Chocolate', 'Patisserie', 'Gift Box'] as const;
  const categoryStats = categories.map(cat => {
    const catProjects = projects.filter(p => p.category === cat);
    const revenue = catProjects.reduce((sum, p) => sum + p.price, 0);
    return {
      category: cat,
      count: catProjects.length,
      revenue
    };
  });

  const totalRevenue = projects.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1810] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#C07D3E]" />
            Kitchen Progress & Confectionery Analytics
          </h1>
          <p className="text-sm text-[#7A6656] mt-0.5">
            Real-time telemetry on station velocity, tempering quality gates, and project completion rates
          </p>
        </div>

        <button
          onClick={() => onOpenAIAssistantWithPrompt('Generate an in-depth confectionery progress and efficiency report based on our current analytics')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C07D3E] to-[#9C5824] hover:from-[#B16F34] hover:to-[#8B4C1D] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          AI Efficiency Audit
        </button>
      </div>

      {/* Top 4 Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7665] text-xs font-semibold uppercase">
            <span>Task Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-[#2C1810]">{completionRate}%</span>
            <span className="text-xs text-emerald-700 font-medium">+{completedTasks.length} done</span>
          </div>
          <div className="w-full bg-[#EAE1D3] h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7665] text-xs font-semibold uppercase">
            <span>Tempering & Gloss Pass</span>
            <ShieldCheck className="w-4 h-4 text-[#A25A24]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-[#2C1810]">99.4%</span>
            <span className="text-xs text-emerald-700 font-medium">Zero bloom errors</span>
          </div>
          <p className="text-[11px] text-[#7A6656] mt-2">
            18.8°C / 43% RH constant climate compliance
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7665] text-xs font-semibold uppercase">
            <span>Production Hours</span>
            <Clock className="w-4 h-4 text-[#C07D3E]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-[#2C1810]">{completedHours}h</span>
            <span className="text-xs text-[#7A6656]">of {totalEstimatedHours}h booked</span>
          </div>
          <p className="text-[11px] text-[#7A6656] mt-2">
            Average 1.8h turnaround per station batch
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7665] text-xs font-semibold uppercase">
            <span>Active Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-[#2C1810]">${totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-emerald-700 font-medium">6 custom orders</span>
          </div>
          <p className="text-[11px] text-[#7A6656] mt-2">
            92% advance customer deposits paid
          </p>
        </div>

      </div>

      {/* Two Column Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Station Workload Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#E8DEC8] shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1]">
            <div>
              <h2 className="font-display font-bold text-base text-[#2C1810]">
                Workload & Velocity by Kitchen Station
              </h2>
              <p className="text-xs text-[#7A6656]">
                Distribution of active prep vs finished production batches
              </p>
            </div>
            <span className="text-xs font-semibold text-[#8C7665]">5 Active Work Centers</span>
          </div>

          <div className="space-y-4 mt-5">
            {stationWorkload.map(item => {
              const total = item.total || 1;
              const percent = Math.round((item.completed / total) * 100);
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2C1810] flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-[#A25A24]" />
                      {item.name}
                      <span className="text-[11px] text-[#8C7665] font-normal">({item.headChef})</span>
                    </span>
                    <span className="text-[11px] text-[#7A6656] font-medium">
                      {item.completed} completed • {item.active} active ({percent}%)
                    </span>
                  </div>

                  {/* Dual bar: Completed in dark cocoa, Active in warm caramel */}
                  <div className="w-full bg-[#FAF7F2] border border-[#E8DEC8] h-3 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-[#2C1810] h-full transition-all" 
                      style={{ width: `${percent}%` }}
                      title={`${percent}% Completed`}
                    ></div>
                    <div 
                      className="bg-[#C07D3E] h-full transition-all" 
                      style={{ width: `${100 - percent}%` }}
                      title={`${100 - percent}% Active`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#8C7665]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C1810]"></span>
                Completed Batches
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C07D3E]"></span>
                Active In-Queue
              </span>
            </div>
            <span className="italic">Updated live from kitchen stations</span>
          </div>
        </div>

        {/* Right: Revenue & Category Share (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E8DEC8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1]">
              <div>
                <h2 className="font-display font-bold text-base text-[#2C1810]">
                  Category Portfolio Share
                </h2>
                <p className="text-xs text-[#7A6656]">
                  Order value breakdown across artisanal specialties
                </p>
              </div>
              <PieChart className="w-4 h-4 text-[#C07D3E]" />
            </div>

            <div className="space-y-3 mt-4">
              {categoryStats.map(stat => {
                const percent = Math.round((stat.revenue / (totalRevenue || 1)) * 100);
                return (
                  <div key={stat.category} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#2C1810]">{stat.category}</span>
                      <span className="font-bold text-[#2C1810]">${stat.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#7A6656] mb-1.5">
                      <span>{stat.count} confirmed orders</span>
                      <span className="font-semibold text-[#A25A24]">{percent}% of revenue</span>
                    </div>
                    <div className="w-full bg-[#EAE1D3] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#C07D3E] h-full rounded-full" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-medium">Highest Margin: Custom Tiered Wedding Cakes (62% margin)</span>
          </div>
        </div>

      </div>

      {/* Weekly Production Trajectory Simulation */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8DEC8] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE1]">
          <div>
            <h2 className="font-display font-bold text-base text-[#2C1810] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C07D3E]" />
              Weekly Batch Production Throughput
            </h2>
            <p className="text-xs text-[#7A6656]">
              Completed custom cakes, bonbon ballotins, and patisserie orders across the current week
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            +18% vs Last Week
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 mt-6 text-center">
          {[
            { day: 'Mon', count: 6, height: '45%' },
            { day: 'Tue', count: 9, height: '65%' },
            { day: 'Wed', count: 12, height: '90%', current: true },
            { day: 'Thu', count: 8, height: '55%' },
            { day: 'Fri', count: 14, height: '100%' },
            { day: 'Sat', count: 11, height: '80%' },
            { day: 'Sun', count: 4, height: '30%' }
          ].map(d => (
            <div key={d.day} className="flex flex-col items-center gap-2">
              <div className="w-full bg-[#FAF7F2] rounded-xl h-36 flex items-end justify-center p-2 border border-[#E8DEC8]">
                <div 
                  className={`w-full rounded-lg transition-all ${
                    d.current ? 'bg-[#C07D3E]' : 'bg-[#2C1810]/80'
                  }`}
                  style={{ height: d.height }}
                  title={`${d.count} orders/batches`}
                ></div>
              </div>
              <span className={`text-xs font-bold ${d.current ? 'text-[#C07D3E]' : 'text-[#2C1810]'}`}>
                {d.day}
              </span>
              <span className="text-[10px] text-[#8C7665]">{d.count} batches</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
