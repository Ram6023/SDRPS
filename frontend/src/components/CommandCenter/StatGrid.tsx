import React from 'react';
import { Users, UserX, Activity, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface StatGridProps {
  stats?: { total?: number; critical?: number; avgAttendance?: string; };
}

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const steps = 50, inc = value / steps;
    let s = 0;
    const t = setInterval(() => { s++; setCurrent(Math.min(Math.round(inc * s), value)); if (s >= steps) clearInterval(t); }, 25);
    return () => clearInterval(t);
  }, [value]);
  return <>{current}</>;
};

const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  const cards = [
    { label: 'Total Analyzed', value: stats?.total || 0, icon: Users, glow: '139, 92, 246', iconBg: 'bg-accent-500/10 ring-1 ring-accent-500/20', iconColor: 'text-accent-400', tag: 'Live', tagBg: 'text-accent-400/70 bg-accent-500/5', isNumber: true },
    { label: 'Critical Risk', value: stats?.critical || 0, icon: UserX, glow: '244, 63, 94', iconBg: 'bg-rose-500/10 ring-1 ring-rose-500/20', iconColor: 'text-rose-400', tag: 'Alert', tagBg: 'text-rose-400/70 bg-rose-500/5', isNumber: true },
    { label: 'Avg Attendance', value: stats?.avgAttendance || '0%', icon: Activity, glow: '251, 191, 36', iconBg: 'bg-amber-500/10 ring-1 ring-amber-500/20', iconColor: 'text-amber-400', tag: 'Avg', tagBg: 'text-amber-400/70 bg-amber-500/5', isNumber: false },
    { label: 'Model Accuracy', value: '98.2%', icon: Brain, glow: '16, 185, 129', iconBg: 'bg-emerald-500/10 ring-1 ring-emerald-500/20', iconColor: 'text-emerald-400', tag: 'Stable', tagBg: 'text-emerald-400/70 bg-emerald-500/5', isNumber: false }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
        >
          <TiltCard glowColor={card.glow} className="cursor-pointer">
            <div className="panel-glass p-6 rounded-2xl relative overflow-hidden h-full" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center justify-between mb-5" style={{ transform: 'translateZ(20px)' }}>
                <motion.div whileHover={{ rotate: 8, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }} className={cn("p-2.5 rounded-xl", card.iconBg)}>
                  <card.icon className={cn("w-4.5 h-4.5", card.iconColor)} />
                </motion.div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md", card.tagBg)}>{card.tag}</span>
              </div>
              <div className="space-y-1.5" style={{ transform: 'translateZ(30px)' }}>
                <div className="text-3xl font-black text-white tracking-tight">
                  {card.isNumber ? <AnimatedNumber value={card.value as number} /> : card.value}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 tracking-wide">{card.label}</div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
};

export default StatGrid;
