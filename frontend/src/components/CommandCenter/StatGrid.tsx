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
    { label: 'Total Analyzed', value: stats?.total || 0, icon: Users, accent: 'cyan', gradient: 'from-cyan-500/20 to-cyan-600/5', iconColor: 'text-cyan-400', trend: 'Live', isNumber: true },
    { label: 'Critical Risk', value: stats?.critical || 0, icon: UserX, accent: 'rose', gradient: 'from-rose-500/20 to-rose-600/5', iconColor: 'text-rose-400', trend: 'Priority', isNumber: true },
    { label: 'Avg Attendance', value: stats?.avgAttendance || '0%', icon: Activity, accent: 'amber', gradient: 'from-amber-500/20 to-amber-600/5', iconColor: 'text-amber-400', trend: 'Average', isNumber: false },
    { label: 'Model Accuracy', value: '98.2%', icon: Brain, accent: 'emerald', gradient: 'from-emerald-500/20 to-emerald-600/5', iconColor: 'text-emerald-400', trend: 'Stable', isNumber: false }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <motion.div
           key={idx}
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: idx * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
           whileHover={{ y: -4, transition: { duration: 0.3 } }}
           className="panel-glass p-6 rounded-2xl glow-card group relative overflow-hidden cursor-pointer"
        >
          {/* Accent gradient bg */}
          <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br", card.gradient)} />
          
          <div className="flex items-center justify-between mb-5 relative z-10">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={cn("p-2.5 rounded-xl", 
                card.accent === 'cyan' ? 'bg-cyan-500/10 ring-1 ring-cyan-500/20' :
                card.accent === 'rose' ? 'bg-rose-500/10 ring-1 ring-rose-500/20' :
                card.accent === 'amber' ? 'bg-amber-500/10 ring-1 ring-amber-500/20' :
                'bg-emerald-500/10 ring-1 ring-emerald-500/20'
              )}
            >
              <card.icon className={cn("w-4.5 h-4.5", card.iconColor)} />
            </motion.div>
            <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
              card.accent === 'cyan' ? 'text-cyan-400/70 bg-cyan-500/5' :
              card.accent === 'rose' ? 'text-rose-400/70 bg-rose-500/5' :
              card.accent === 'amber' ? 'text-amber-400/70 bg-amber-500/5' :
              'text-emerald-400/70 bg-emerald-500/5'
            )}>{card.trend}</span>
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="text-3xl font-black text-white tracking-tight">
              {card.isNumber ? <AnimatedNumber value={card.value as number} /> : card.value}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 tracking-wide">{card.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatGrid;
