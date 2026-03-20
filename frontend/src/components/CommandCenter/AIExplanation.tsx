import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Wallet, CheckCircle2, Sparkles, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface AIExplanationProps {
  result: {
    factors: {
      attendance: number;
      academic: number;
      financial: number;
    };
    risk_level: string;
  } | null;
}

const AIExplanation: React.FC<AIExplanationProps> = ({ result }) => {
  if (!result) return null;

  const { factors } = result;

  const getInsights = () => {
    const list = [];
    if (factors.attendance > 0.4) list.push({ icon: TrendingDown, label: 'Attendance Deficit', color: 'rose', desc: 'Critical absence patterns detected — attendance is a primary dropout indicator.' });
    if (factors.academic > 0.45) list.push({ icon: AlertTriangle, label: 'Academic Concern', color: 'amber', desc: 'GPA fluctuations between semesters suggest academic struggle or disengagement.' });
    if (factors.financial > 0.5) list.push({ icon: Wallet, label: 'Financial Risk', color: 'rose', desc: 'Unpaid fees are historically correlated with higher dropout probability.' });
    
    if (list.length === 0) list.push({ icon: CheckCircle2, label: 'On Track', color: 'emerald', desc: 'All indicators suggest this student is on track for successful completion.' });
    
    return list;
  };

  const insights = getInsights();

  return (
    <TiltCard glowColor="139, 92, 246" className="w-full">
      <div className="panel-glass rounded-[2.5rem] p-10 flex flex-col h-full relative overflow-hidden group shadow-3xl" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        
        <header className="flex justify-between items-center mb-10 relative z-10" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-400 ring-1 ring-accent-400/20"><Brain className="w-5 h-5 shadow-2xl" /></div>
            <h4 className="text-[11px] font-black text-white/50 tracking-[0.25em] uppercase">AI Strategic Insights</h4>
          </div>
          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 3, repeat: Infinity }} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent-500/10 ring-1 ring-accent-400/20 text-accent-400">
             <Sparkles className="w-3.5 h-3.5" />
             <span className="text-[9px] font-black tracking-widest uppercase">Live Scan</span>
          </motion.div>
        </header>

        <div className="space-y-5 flex-grow relative z-10" style={{ transform: 'translateZ(35px)' }}>
          {insights.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.3 + idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-5 p-5 rounded-3xl group hover:bg-white/[0.04] transition-all relative border border-white/[0.06] backdrop-blur-sm"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={cn("p-4 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-12 shadow-2xl", 
                  item.color === 'rose' ? 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30' : 
                  item.color === 'amber' ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30' : 
                  'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
              )}>
                  <item.icon className="w-6 h-6" />
              </div>
              <div style={{ transform: 'translateZ(10px)' }}>
                  <div className="text-[14px] font-black text-white mb-1.5 tracking-tight group-hover:text-accent-300 transition-colors uppercase">{item.label}</div>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-bold opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.08] relative z-10" style={{ transform: 'translateZ(20px)' }}>
          <div className="p-4 rounded-[1.25rem] text-[10px] font-black flex items-center justify-center gap-3 tracking-[0.3em] uppercase transition-all duration-700 hover:ring-2 hover:ring-accent-500/50"
               style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgb(167,139,250)', filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.15))' }}>
              <motion.span className="w-2.5 h-2.5 rounded-full bg-accent-400 shadow-[0_0_10px_#8b5cf6]" animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              Analysis Subsystem: Nominal
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default AIExplanation;
