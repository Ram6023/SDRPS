import React from 'react';
import { Users, UserX, Activity, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatGridProps {
  stats?: {
    total?: number;
    critical?: number;
    avgAttendance?: string;
  };
}

const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  const cards = [
    { label: 'Total Analyzed', value: stats?.total || 1240, icon: Users, color: 'brand', trend: '+12% from prev month' },
    { label: 'Critical Risk', value: stats?.critical || 42, icon: UserX, color: 'red', trend: '8.2% avg' },
    { label: 'Avg Attendance', value: stats?.avgAttendance || '78%', icon: Activity, color: 'amber', trend: 'Stable' },
    { label: 'Model Confidence', value: '92.4%', icon: Brain, color: 'emerald', trend: 'Optimized' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <motion.div
           key={idx}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: idx * 0.1, duration: 0.5 }}
           className="panel-glass p-6 rounded-[2rem] border border-white/5 glow-card group relative overflow-hidden"
        >
          <div className={cn(
            "absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-10 rounded-full transition-opacity group-hover:opacity-20",
            card.color === 'brand' ? 'bg-brand-500' : 
            card.color === 'red' ? 'bg-red-500' :
            card.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
          )} />
          
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
              <card.icon className="w-5 h-5 text-brand-400" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{card.trend}</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white tracking-tighter">{card.value}</div>
            <div className="text-[11px] font-bold uppercase text-slate-500 tracking-[0.2em]">{card.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatGrid;
