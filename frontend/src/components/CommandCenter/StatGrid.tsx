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
    { label: 'Total Analyzed', value: stats?.total || 0, icon: Users, glow: '139, 92, 246', iconBg: 'bg-accent-500/10 ring-1 ring-accent-500/20', iconColor: 'text-accent-400', tag: 'Live', tagBg: 'text-accent-400/70 bg-accent-500/5', isNumber: true, pattern: 'bg-grid-white' },
    { label: 'Critical Risk', value: stats?.critical || 0, icon: UserX, glow: '244, 63, 94', iconBg: 'bg-rose-500/10 ring-1 ring-rose-500/20', iconColor: 'text-rose-400', tag: 'Alert', tagBg: 'text-rose-400/70 bg-rose-500/5', isNumber: true, pattern: 'bg-dots' },
    { label: 'Avg Attendance', value: stats?.avgAttendance || '0%', icon: Activity, glow: '251, 191, 36', iconBg: 'bg-amber-500/10 ring-1 ring-amber-500/20', iconColor: 'text-amber-400', tag: 'Avg', tagBg: 'text-amber-400/70 bg-amber-500/5', isNumber: false, pattern: 'bg-grid-white' },
    { label: 'Model Accuracy', value: '98.2%', icon: Brain, glow: '16, 185, 129', iconBg: 'bg-emerald-500/10 ring-1 ring-emerald-500/20', iconColor: 'text-emerald-400', tag: 'Stable', tagBg: 'text-emerald-400/70 bg-emerald-500/5', isNumber: false, pattern: 'bg-dots' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <TiltCard glowColor={card.glow} className="cursor-pointer group h-full">
            <div className={cn("panel-glass p-7 rounded-[2rem] relative overflow-hidden h-full flex flex-col justify-between", card.pattern)} style={{ transformStyle: 'preserve-3d' }}>
              {/* Internal Accent Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full pointer-events-none opacity-20" style={{ background: `rgb(${card.glow})` }} />
              
              <div className="flex items-center justify-between mb-8" style={{ transform: 'translateZ(25px)' }}>
                <motion.div whileHover={{ rotate: 12, scale: 1.25 }} transition={{ type: "spring", stiffness: 400 }} className={cn("p-3.5 rounded-2xl shadow-xl", card.iconBg)}>
                   <card.icon className={cn("w-5 h-5", card.iconColor)} />
                </motion.div>
                <div className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/5", card.tagBg)}>
                   {card.tag}
                </div>
              </div>

              <div className="space-y-2 mt-auto" style={{ transform: 'translateZ(40px)' }}>
                <div className="text-4xl font-black text-white tracking-tighter leading-none mb-1 group-hover:scale-105 transition-transform origin-left duration-500">
                  {card.isNumber ? <AnimatedNumber value={card.value as number} /> : card.value}
                </div>
                <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                   {card.label}
                </div>
              </div>

              {/* Decorative progress-bar style strip at bottom */}
              <div className="mt-4 h-[1.5px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5 + idx * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, rgba(${card.glow}, 0.1), rgb(${card.glow}), rgba(${card.glow}, 0.1))` }}
                 />
              </div>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
};

export default StatGrid;
