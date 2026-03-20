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
      <div className="panel-glass rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group" style={{ transformStyle: 'preserve-3d' }}>
        <header className="flex justify-between items-center mb-6" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-400" />
            <h4 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">AI Strategic Insights</h4>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent-500/5 ring-1 ring-accent-400/20 text-accent-400">
             <Sparkles className="w-3 h-3" />
             <span className="text-[8px] font-bold tracking-widest">LIVE</span>
          </div>
        </header>

        <div className="space-y-4 flex-grow" style={{ transform: 'translateZ(30px)' }}>
          {insights.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -15, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
              className="flex gap-4 p-4 rounded-2xl group hover:bg-white/[0.03] transition-all relative border border-white/[0.04]"
              style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}
            >
              <div className={cn("p-3 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-6", 
                  item.color === 'rose' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20' : 
                  item.color === 'amber' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' : 
                  'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
              )}>
                  <item.icon className="w-5 h-5" />
              </div>
              <div style={{ transform: 'translateZ(15px)' }}>
                  <div className="text-[13px] font-bold text-white mb-1 tracking-tight">{item.label}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-5 border-t border-white/[0.06]" style={{ transform: 'translateZ(10px)' }}>
          <div className="p-3.5 rounded-2xl text-[10px] font-bold flex items-center justify-center gap-2.5 tracking-[0.15em] uppercase"
               style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)', color: 'rgb(139,92,246)', filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.1))' }}>
              <motion.span className="w-2 h-2 rounded-full bg-accent-400" animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
              Analysis Subsystem Active
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default AIExplanation;
