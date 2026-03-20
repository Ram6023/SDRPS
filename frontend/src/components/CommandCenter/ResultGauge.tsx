import React from 'react';
import { motion } from 'framer-motion';

interface ResultGaugeProps {
  probability: number;
  riskLevel: string;
}

const ResultGauge: React.FC<ResultGaugeProps> = ({ probability, riskLevel }) => {
  const percent = Math.round(probability * 100);
  
  const getColor = () => {
    if (riskLevel === 'Critical') return '#f43f5e';
    if (riskLevel === 'High') return '#f59e0b';
    if (riskLevel === 'Moderate') return '#06b6d4';
    return '#10b981';
  };

  const color = getColor();

  return (
    <div className="panel-glass rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-8">Risk Analysis</h4>

      <div className="relative w-56 h-56 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
          <motion.circle 
            initial={{ strokeDashoffset: 276 }}
            animate={{ strokeDashoffset: 276 - (276 * probability) }}
            transition={{ duration: 2, ease: "circOut" }}
            cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="5" strokeDasharray="276.46" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl font-black text-white tracking-tighter">
                {percent}<span className="text-xl opacity-20">%</span>
            </motion.div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1">Dropout Probability</span>
        </div>
      </div>

      <div className="mt-6 space-y-2 relative z-10">
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-bold uppercase tracking-widest" style={{ color }}>
            {riskLevel} Risk
        </motion.div>
      </div>

      <div className="mt-8 flex gap-1.5 p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        {['Low', 'Moderate', 'High', 'Critical'].map(level => (
            <motion.div 
                key={level}
                animate={riskLevel === level ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`h-1.5 rounded-full transition-all duration-500 ${riskLevel === level ? 'w-8' : 'w-3 bg-white/5'}`}
                style={{ backgroundColor: riskLevel === level ? color : undefined }}
            />
        ))}
      </div>
    </div>
  );
};

export default ResultGauge;
