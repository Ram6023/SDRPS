import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from '@/components/ui/TiltCard';

interface ResultGaugeProps {
  probability: number;
  riskLevel: string;
}

const ResultGauge: React.FC<ResultGaugeProps> = ({ probability, riskLevel }) => {
  const percent = Math.round(probability * 100);
  
  const getColor = () => {
    if (riskLevel === 'Critical') return '#f43f5e';
    if (riskLevel === 'High') return '#f59e0b';
    if (riskLevel === 'Moderate') return '#8b5cf6';
    return '#10b981';
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '139, 92, 246';
  };

  const color = getColor();
  const rgbColor = hexToRgb(color);

  return (
    <TiltCard glowColor={rgbColor} className="w-full">
      <div className="panel-glass rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group h-full shadow-3xl" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 bg-grid-white opacity-10 pointer-events-none" />
        
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-10 relative z-10" style={{ transform: 'translateZ(25px)' }}>Neural Risk Analysis</h4>

        <div className="relative w-64 h-64 mb-6" style={{ transform: 'translateZ(50px)' }}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
            <motion.circle 
              initial={{ strokeDashoffset: 276 }}
              animate={{ strokeDashoffset: 276 - (276 * probability) }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="6" strokeDasharray="276.46" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 15px ${color}80)` }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-7xl font-black text-white tracking-tighter">
                  {percent}<span className="text-xl opacity-20">%</span>
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2 opacity-80">PROBABILITY_INDEX</span>
          </div>
        </div>

        <div className="mt-8 space-y-3 relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-black uppercase tracking-[0.2em]" style={{ color, filter: `drop-shadow(0 0 15px ${color}50)` }}>
              {riskLevel}
          </motion.div>
          <div className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">System Classification Status</div>
        </div>

        <div className="mt-10 flex gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] relative z-10 shadow-inner" style={{ transform: 'translateZ(20px)' }}>
          {['Low', 'Moderate', 'High', 'Critical'].map(level => (
              <motion.div 
                  key={level}
                  animate={riskLevel === level ? { scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className={`h-2 rounded-full transition-all duration-1000 ${riskLevel === level ? 'w-12 shadow-2xl' : 'w-5 bg-white/5 opacity-40'}`}
                  style={{ backgroundColor: riskLevel === level ? color : undefined, boxShadow: riskLevel === level ? `0 0 15px ${color}` : 'none' }}
              />
          ))}
        </div>
      </div>
    </TiltCard>
  );
};

export default ResultGauge;
