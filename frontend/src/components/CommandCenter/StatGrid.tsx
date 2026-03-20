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

// Animated counter component
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [current, setCurrent] = React.useState(0);
  
  React.useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(Math.round(increment * step), value));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <>{current}</>;
};

const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  const cards = [
    { label: 'Total Analyzed', value: stats?.total || 0, icon: Users, color: 'brand', trend: 'Live System', isNumber: true },
    { label: 'Critical Risk', value: stats?.critical || 0, icon: UserX, color: 'red', trend: 'Priority Actions', isNumber: true },
    { label: 'Avg Attendance', value: stats?.avgAttendance || '0%', icon: Activity, color: 'amber', trend: 'Institutional Avg', isNumber: false },
    { label: 'Model Accuracy', value: '98.2%', icon: Brain, color: 'emerald', trend: 'Production Ready', isNumber: false }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <motion.div
           key={idx}
           initial={{ opacity: 0, y: 40, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ delay: idx * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           whileHover={{ y: -6, transition: { duration: 0.3 } }}
           className="panel-glass p-6 rounded-[2rem] border border-white/5 glow-card group relative overflow-hidden cursor-pointer"
        >
          {/* Animated glow on hover */}
          <motion.div
            className={cn(
              "absolute top-0 right-0 w-32 h-32 blur-[70px] rounded-full transition-all duration-700",
              card.color === 'brand' ? 'bg-brand-500' : 
              card.color === 'red' ? 'bg-red-500' :
              card.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            initial={{ opacity: 0.05 }}
            whileHover={{ opacity: 0.25 }}
          />
          
          {/* Animated border glow */}
          <div className={cn(
            "absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700",
            card.color === 'brand' ? 'shadow-[inset_0_0_30px_rgba(139,92,246,0.1)]' :
            card.color === 'red' ? 'shadow-[inset_0_0_30px_rgba(239,68,68,0.1)]' :
            card.color === 'amber' ? 'shadow-[inset_0_0_30px_rgba(245,158,11,0.1)]' : 'shadow-[inset_0_0_30px_rgba(16,185,129,0.1)]'
          )} />
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-3 rounded-2xl bg-white/5 border border-white/10"
            >
              <card.icon className={cn(
                "w-5 h-5 transition-colors duration-500",
                card.color === 'brand' ? 'text-brand-400' :
                card.color === 'red' ? 'text-red-400' :
                card.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'
              )} />
            </motion.div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{card.trend}</span>
          </div>

          <div className="space-y-1 relative z-10">
            <div className="text-3xl font-black text-white tracking-tighter">
              {card.isNumber ? <AnimatedNumber value={card.value as number} /> : card.value}
            </div>
            <div className="text-[11px] font-bold uppercase text-slate-500 tracking-[0.2em]">{card.label}</div>
          </div>
          
          {/* Bottom accent line */}
          <motion.div 
            className={cn(
              "absolute bottom-0 left-0 h-[2px] rounded-full",
              card.color === 'brand' ? 'bg-brand-500' :
              card.color === 'red' ? 'bg-red-500' :
              card.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default StatGrid;
