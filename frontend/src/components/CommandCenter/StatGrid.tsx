import React from 'react';
import { Users, Activity, Shield, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface StatGridProps {
  history?: any[];
}

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const steps = 60, inc = value / steps;
    let s = 0;
    const t = setInterval(() => { s++; setCurrent(Math.min(Math.round(inc * s), value)); if (s >= steps) clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <>{current.toLocaleString()}</>;
};

const StatGrid: React.FC<StatGridProps> = ({ history = [] }) => {
  const totalStudents = history.length || 0;
  const criticalRisk = history.filter(h => h.risk_level === 'High' || h.risk_level === 'Critical').length;
  const avgAttendance = history.length > 0 
    ? (history.reduce((acc, curr) => acc + (parseFloat(curr.attendance) || 0), 0) / history.length).toFixed(1) 
    : '0';

  const cards = [
    { label: 'TOTAL_ENROLLMENT', value: totalStudents, icon: Users, glow: '99, 102, 241', iconBg: 'bg-indigo-vibrant/10 ring-1 ring-indigo-vibrant/30', iconColor: 'text-indigo-vibrant', tag: 'ACTIVE_NODE', tagBg: 'text-indigo-vibrant/80 bg-indigo-vibrant/5 border-indigo-vibrant/20', isNumber: true, pattern: 'bg-grid-cyber' },
    { label: 'CRITICAL_RISK_ALERTS', value: criticalRisk, icon: Shield, glow: '239, 68, 68', iconBg: 'bg-rose-vibrant/10 ring-1 ring-rose-vibrant/30', iconColor: 'text-rose-vibrant', tag: 'MITIGATE', tagBg: 'text-rose-vibrant/80 bg-rose-vibrant/5 border-rose-vibrant/20', isNumber: true, pattern: 'bg-neural-dots' },
    { label: 'ENGAGEMENT_INDEX', value: `${avgAttendance}%`, icon: Activity, glow: '30, 27, 75', iconBg: 'bg-slate-navy/10 ring-1 ring-slate-navy/30', iconColor: 'text-slate-400', tag: 'STABLE', tagBg: 'text-slate-400/80 bg-white/5 border-white/10', isNumber: false, pattern: 'bg-grid-cyber' },
    { label: 'PREDICTION_CONFIDENCE', value: '99.4%', icon: GraduationCap, glow: '99, 102, 241', iconBg: 'bg-indigo-vibrant/10 ring-1 ring-indigo-vibrant/30', iconColor: 'text-indigo-vibrant', tag: 'CERTIFIED', tagBg: 'text-indigo-vibrant/80 bg-indigo-vibrant/5 border-indigo-vibrant/20', isNumber: false, pattern: 'bg-neural-dots' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(15px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <TiltCard glowColor={card.glow} className="cursor-pointer group h-full">
            <div className={cn("panel-glass p-10 rounded-[3rem] relative overflow-hidden h-full flex flex-col justify-between border-white/[0.04] shadow-3xl", card.pattern)} style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute top-0 right-0 w-44 h-44 blur-[120px] rounded-full pointer-events-none opacity-20" style={{ background: `rgb(${card.glow})` }} />
              
              <div className="flex items-center justify-between mb-12" style={{ transform: 'translateZ(30px)' }}>
                <motion.div whileHover={{ scale: 1.2, rotate: 12 }} className={cn("p-5 rounded-2xl shadow-3xl", card.iconBg)}>
                   <card.icon className={cn("w-7 h-7", card.iconColor)} />
                </motion.div>
                <div className={cn("text-[8px] font-black uppercase tracking-[0.4em] px-4 py-2 rounded-xl backdrop-blur-3xl border", card.tagBg)}>
                   {card.tag}
                </div>
              </div>

              <div className="space-y-4 mt-auto" style={{ transform: 'translateZ(50px)' }}>
                <div className="text-6xl font-black text-white tracking-tighter leading-none mb-2 font-mono group-hover:scale-110 transition-transform origin-left duration-1000 shadow-2xl">
                  {card.isNumber ? <AnimatedNumber value={card.value as number} /> : card.value}
                </div>
                <div className="text-[11px] font-mono font-black text-slate-700 tracking-[0.3em] uppercase group-hover:text-sunset-amber transition-colors duration-700">
                   {card.label}
                </div>
              </div>

              <div className="mt-8 h-[2px] w-full bg-white/[0.03] rounded-full overflow-hidden relative">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, delay: 1 + idx * 0.1, ease: 'easeInOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, rgb(${card.glow}), transparent)` }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer scale-x-50" />
              </div>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </div>
  );
};

export default StatGrid;
