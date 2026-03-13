import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Wallet, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    if (factors.attendance > 0.4) list.push({ icon: TrendingDown, label: 'Attendance Deficit', color: 'red', desc: 'Neural analysis detected critical absence patterns exceeding safety levels.' });
    if (factors.academic > 0.45) list.push({ icon: AlertTriangle, label: 'Academic Friction', color: 'amber', desc: 'Semester CGPA fluctuations indicate potential cognitive or learning strain.' });
    if (factors.financial > 0.5) list.push({ icon: Wallet, label: 'Financial Sensitivity', color: 'red', desc: 'Outstanding dues correlate historically with early student departure.' });
    
    if (list.length === 0) list.push({ icon: CheckCircle2, label: 'Success Alignment', color: 'emerald', desc: 'All behavioral vectors align with successful institutional completion.' });
    
    return list;
  };

  const insights = getInsights();

  return (
    <div className="panel-glass rounded-[2.5rem] p-8 border border-white/5 space-y-6 overflow-hidden relative shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <ShieldCheck className="w-32 h-32 text-brand-500" />
      </div>

      <header className="flex justify-between items-center relative z-10">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Interpretation</h4>
        <div className="flex -space-x-2">
           {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-950 bg-slate-900 shadow-xl" />)}
        </div>
      </header>

      <div className="space-y-4 relative z-10">
        {insights.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-4 p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.04] group hover:bg-white/[0.04] transition-all"
          >
            <div className={`p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                item.color === 'red' ? 'bg-red-500/10 text-red-400' : 
                item.color === 'amber' ? 'bg-amber-500/10 text-amber-400' : 
                'bg-emerald-500/10 text-emerald-400'
            }`}>
                <item.icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-[13px] font-black text-white mb-0.5 tracking-tight uppercase">{item.label}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5 relative z-10">
        <div className="p-4 rounded-2xl bg-brand-500/5 text-brand-400 text-[9px] font-black flex items-center justify-center gap-2 uppercase tracking-widest border border-brand-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            VEC-INTEL INTERPRETER ACTIVE
        </div>
      </div>
    </div>
  );
};

export default AIExplanation;
