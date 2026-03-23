import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Wallet, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface AIExplanationProps {
  result: any;
}

const AIExplanation: React.FC<AIExplanationProps> = ({ result }) => {
  const factors = [
    { label: 'ATTENDANCE_DEFICIT', val: `${(100 - parseFloat(result.attendance)).toFixed(1)}%`, icon: Clock, color: 'text-sunset-rose', bg: 'bg-sunset-rose/10', border: 'border-sunset-rose/30', desc: 'Critical engagement gap detected.' },
    { label: 'ACADEMIC_CONCERN', val: `${result.gpa} GPA`, icon: TrendingDown, color: 'text-sunset-amber', bg: 'bg-sunset-amber/10', border: 'border-sunset-amber/30', desc: 'Subject performance below threshold.' },
    { label: 'FINANCIAL_RISK', val: result.tuition_fees_up_to_date === '1' ? 'CLEAR' : 'PROTOCOL_VOID', icon: Wallet, color: result.tuition_fees_up_to_date === '1' ? 'text-matrix-green' : 'text-sunset-rose', bg: result.tuition_fees_up_to_date === '1' ? 'bg-matrix-green/10' : 'bg-sunset-rose/10', border: result.tuition_fees_up_to_date === '1' ? 'border-matrix-green/30' : 'border-sunset-rose/30', desc: 'Institutional protocol alignment status.' }
  ];

  return (
    <TiltCard glowColor="245, 158, 11" className="h-full">
      <div className="panel-glass rounded-[4rem] p-16 flex flex-col h-full relative overflow-hidden group border-white/[0.04] shadow-3xl" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunset-rose/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="flex items-center gap-6 mb-20" style={{ transform: 'translateZ(30px)' }}>
             <div className="p-4 bg-sunset-amber/10 rounded-2xl ring-1 ring-sunset-amber/40 shadow-3xl">
                <AlertTriangle className="w-8 h-8 text-sunset-amber" />
             </div>
             <div>
                <h3 className="text-4xl font-black text-white tracking-tight leading-none uppercase italic border-l-4 border-sunset-amber pl-6">DROPOUT_DIAGNOSTICS</h3>
                <span className="text-[10px] font-mono font-black text-slate-700 tracking-[0.4em] uppercase ml-6">INSTITUTIONAL_RISK_SCAN_V5.0</span>
             </div>
        </div>

        <div className="space-y-12 flex-1" style={{ transform: 'translateZ(50px)' }}>
          {factors.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 1.2 + i * 0.2, duration: 1 }}
              className={cn("p-10 rounded-[2.5rem] border backdrop-blur-3xl group/item relative overflow-hidden transition-all duration-700 hover:bg-white/[0.02] shadow-2xl", f.bg, f.border)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                   <div className={cn("p-4 rounded-xl shadow-2xl", f.bg)}>
                      <f.icon className={cn("w-7 h-7", f.color)} />
                   </div>
                   <div className="text-[11px] font-mono font-black tracking-[0.3em] uppercase text-slate-700">{f.label}</div>
                </div>
                <div className={cn("text-4xl font-black font-mono tracking-tighter drop-shadow-2xl", f.color)}>{f.val}</div>
              </div>
              <p className="text-[13px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed group-hover/item:text-slate-300 transition-colors">{" >> "} {f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity duration-1000" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-matrix-green/10 flex items-center justify-center text-matrix-green border border-matrix-green/30"><ShieldCheck className="w-6 h-6" /></div>
                 <span className="text-[10px] font-mono font-black text-slate-800 tracking-[0.4em] uppercase">VALIDATED_BY_CORE_V5</span>
            </div>
            <div className="flex gap-2">
                 {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-6 bg-white/5 rounded-full" />)}
            </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default AIExplanation;
