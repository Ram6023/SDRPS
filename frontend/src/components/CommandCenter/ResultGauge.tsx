import React from 'react';
import { motion } from 'framer-motion';

interface ResultGaugeProps {
  probability: number;
  riskLevel: string;
}

const ResultGauge: React.FC<ResultGaugeProps> = ({ probability, riskLevel }) => {
  const percent = Math.round(probability * 100);
  
  const getColor = () => {
    if (riskLevel === 'Critical') return '#f43f5e'; // red-500
    if (riskLevel === 'High') return '#f59e0b'; // amber-500
    if (riskLevel === 'Moderate') return '#3b82f6'; // blue-500
    return '#10b981'; // emerald-500
  };

  const color = getColor();

  return (
    <div className="panel-glass rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl transition-all duration-700 hover:shadow-brand-500/5">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10">Neural Risk Analysis</h4>

      <div className="relative w-64 h-64 scale-110 lg:scale-125 mb-4">
        {/* ── Progress Circle ── */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="44" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="5" 
            strokeOpacity="0.5"
          />
          <motion.circle 
            initial={{ strokeDashoffset: 276 }}
            animate={{ strokeDashoffset: 276 - (276 * probability) }}
            transition={{ duration: 2, ease: "circOut" }}
            cx="50" cy="50" r="44" 
            fill="none" 
            stroke={color} 
            strokeWidth="6" 
            strokeDasharray="276.46" 
            strokeLinecap="round" 
            style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
          />
        </svg>

        {/* ── Value Display ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-7xl font-black text-white tracking-tighter"
            >
                {percent}<span className="text-2xl opacity-20">%</span>
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Confidence</span>
        </div>
      </div>

      <div className="mt-8 space-y-2 relative z-10 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
        <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-black uppercase tracking-widest leading-none"
            style={{ color: color }}
        >
            {riskLevel} Risk
        </motion.div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">Architectural Behavioral Prediction</p>
      </div>

      {/* ── Dynamic Stage Indicator ── */}
      <div className="mt-10 flex gap-1.5 p-2 rounded-2xl bg-black/20 border border-white/[0.02]">
        {['Low', 'Moderate', 'High', 'Critical'].map(level => (
            <div 
                key={level}
                className={`h-2 rounded-full transition-all duration-700 group-hover:duration-300 ${
                    riskLevel === level ? 'w-10 ring-4 ring-white/5' : 'w-4 bg-slate-900'
                }`}
                style={{ backgroundColor: riskLevel === level ? color : undefined }}
            />
        ))}
      </div>

      {/* ── Decorative Scanlines ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default ResultGauge;
