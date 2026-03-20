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
    if (riskLevel === 'Moderate') return '#8b5cf6'; // Updated: Moderate -> Amethyst/Violet
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
      <div className="panel-glass rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group h-full" style={{ transformStyle: 'preserve-3d' }}>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8" style={{ transform: 'translateZ(20px)' }}>Neural Risk Analysis</h4>

        <div className="relative w-56 h-56 mb-4" style={{ transform: 'translateZ(40px)' }}>
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
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-white tracking-tighter">
                  {percent}<span className="text-xl opacity-20">%</span>
              </motion.div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1 opacity-60">Dropout Probability</span>
          </div>
        </div>

        <div className="mt-6 space-y-2 relative z-10" style={{ transform: 'translateZ(30px)' }}>
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-2xl font-black uppercase tracking-widest" style={{ color, filter: `drop-shadow(0 0 10px ${color}40)` }}>
              {riskLevel} Risk
          </motion.div>
        </div>

        <div className="mt-8 flex gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]" style={{ transform: 'translateZ(15px)' }}>
          {['Low', 'Moderate', 'High', 'Critical'].map(level => (
              <motion.div 
                  key={level}
                  animate={riskLevel === level ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className={`h-1.5 rounded-full transition-all duration-700 ${riskLevel === level ? 'w-10' : 'w-4 bg-white/5'}`}
                  style={{ backgroundColor: riskLevel === level ? color : undefined }}
              />
          ))}
        </div>
      </div>
    </TiltCard>
  );
};

export default ResultGauge;
