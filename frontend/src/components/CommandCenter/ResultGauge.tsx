import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface ResultGaugeProps {
  probability: number;
  riskLevel: string;
}

const ResultGauge: React.FC<ResultGaugeProps> = ({ probability, riskLevel }) => {
  const percent = Math.round(probability * 100);
  
  const getColor = () => {
    if (riskLevel === 'Critical') return '#be123c'; // sunset-rose
    if (riskLevel === 'High') return '#ea580c';    // orange-600
    if (riskLevel === 'Medium') return '#f59e0b';  // sunset-amber
    return '#10b981'; // emerald
  };

  const color = getColor();

  return (
    <TiltCard glowColor={color === '#be123c' ? '190, 18, 60' : color === '#f59e0b' ? '245, 158, 11' : '16, 185, 129'} className="w-full h-full">
      <div className="panel-glass rounded-[3rem] p-8 sm:p-12 flex flex-col items-center justify-center h-full relative group border-white/[0.04] shadow-3xl" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute top-8 left-8 text-[8px] font-mono font-black text-slate-800 uppercase tracking-[0.3em] px-3 py-1.5 border border-white/[0.03] rounded-lg backdrop-blur-3xl z-20">RISK_ANALYSIS_NODE</div>
        
        <div className="relative w-full max-w-[280px] aspect-square mb-8" style={{ transform: 'translateZ(50px)' }}>
          <svg viewBox="0 0 288 288" className="w-full h-full -rotate-90 transform group-hover:scale-105 transition-transform duration-1000">
            <circle cx="144" cy="144" r="120" stroke="rgba(255,255,255,0.03)" strokeWidth="12" fill="none" />
            <motion.circle
              cx="144" cy="144" r="120"
              stroke={color} strokeWidth="12" fill="none"
              strokeDasharray={2 * Math.PI * 120}
              initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - probability) }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 20px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4" style={{ transform: 'translateZ(30px)' }}>
            <span className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{percent}%</span>
            <span className="text-[9px] font-mono font-black text-slate-700 tracking-[0.4em] uppercase">PROBABILITY</span>
          </div>
        </div>

        <div className="text-center mt-4" style={{ transform: 'translateZ(40px)' }}>
          <div className="text-[12px] font-mono font-black text-slate-700 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-pulse" /> CLASSIFICATION_LEVEL
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className={cn("text-4xl font-black px-10 py-5 rounded-[2rem] border transition-all duration-1000 shadow-3xl uppercase tracking-tighter",
                riskLevel === 'Critical' ? 'bg-sunset-rose/10 border-sunset-rose text-sunset-rose' :
                riskLevel === 'High' ? 'bg-orange-600/10 border-orange-600 text-orange-600' :
                riskLevel === 'Medium' ? 'bg-sunset-amber/10 border-sunset-amber text-sunset-amber' :
                'bg-matrix-green/10 border-matrix-green text-matrix-green'
            )}
            style={{ 
                boxShadow: riskLevel === 'Critical' ? '0 0 50px rgba(190,18,60,0.2)' : 
                           riskLevel === 'Medium' ? '0 0 50px rgba(245,158,11,0.2)' : 'none'
            }}
          >
            {riskLevel}
          </motion.div>
        </div>
        
        {/* Artistic scan details */}
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center px-4 opacity-30 group-hover:opacity-100 transition-all duration-1000">
             <div className="text-[8px] font-mono font-bold text-slate-800 tracking-[0.2em] uppercase">SYSTEM_STABLE</div>
             <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-white/5 rounded-full" />)}
             </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default ResultGauge;
