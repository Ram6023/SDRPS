import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Wallet, CheckCircle2, Sparkles } from 'lucide-react';

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
    <div className="panel-glass rounded-3xl p-7 space-y-5 overflow-hidden relative">
      <header className="flex justify-between items-center relative z-10">
        <h4 className="text-[11px] font-semibold text-slate-500 tracking-wide">AI Insights</h4>
        <div className="flex items-center gap-1.5 text-accent-400/60">
           <Sparkles className="w-3.5 h-3.5" />
           <span className="text-[9px] font-medium tracking-wider">ANALYSIS</span>
        </div>
      </header>

      <div className="space-y-3 relative z-10">
        {insights.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-3.5 p-4 rounded-xl group hover:bg-white/[0.02] transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.03)' }}
          >
            <div className={`p-2.5 rounded-lg flex-shrink-0 transition-transform group-hover:scale-105 ${
                item.color === 'rose' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20' : 
                item.color === 'amber' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20' : 
                'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
            }`}>
                <item.icon className="w-4 h-4" />
            </div>
            <div>
                <div className="text-[12px] font-bold text-white mb-0.5">{item.label}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/[0.04] relative z-10">
        <div className="p-3 rounded-xl text-[10px] font-medium flex items-center justify-center gap-2 tracking-wide"
             style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)', color: 'rgb(34,211,238)' }}>
            <motion.span className="w-1.5 h-1.5 rounded-full bg-accent-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            AI Interpreter Active
        </div>
      </div>
    </div>
  );
};

export default AIExplanation;
