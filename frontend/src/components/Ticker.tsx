import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, ShieldCheck, Zap, GraduationCap } from 'lucide-react';

const Ticker: React.FC = () => {
    const phrases = [
        "MORE THAN 90% ACCURACY",
        "AI-POWERED PREDICTIONS",
        "REAL-TIME STUDENT RISK ANALYSIS",
        "SMART INTERVENTION SYSTEM",
        "DATA-DRIVEN DECISION MAKING",
        "EARLY WARNING DETECTION",
        "BOOST STUDENT SUCCESS RATES",
        "PREDICT",
        "ANALYZE",
        "PREVENT"
    ];

    const icons = [Sparkles, BrainCircuit, Activity, ShieldCheck, Zap, GraduationCap];

    return (
        <div className="w-full bg-academy-navy/80 border-y border-white/[0.05] overflow-hidden py-4 backdrop-blur-xl relative group">
            {/* Side gradients for smooth fade out */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-academy-navy to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-academy-navy to-transparent z-10" />
            
            <motion.div 
                className="flex whitespace-nowrap gap-12"
                animate={{ x: [0, -1000] }}
                transition={{ 
                    duration: 30, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
            >
                {/* Double the list to create seamless loop */}
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-12">
                        {phrases.map((phrase, idx) => {
                            const Icon = icons[idx % icons.length];
                            return (
                                <div 
                                    key={idx} 
                                    className="flex items-center gap-6 group/item cursor-default"
                                >
                                    <div className="p-2 rounded-lg bg-sunset-amber/10 border border-sunset-amber/20 group-hover/item:bg-sunset-amber/20 transition-all">
                                        <Icon className="w-4 h-4 text-sunset-amber" />
                                    </div>
                                    <span className="text-sm font-black tracking-[0.2em] uppercase italic bg-gradient-to-br from-white via-sunset-amber/80 to-sunset-amber bg-clip-text text-transparent group-hover/item:text-white transition-all drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                                        {phrase}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </motion.div>

            {/* Subtle motion blur container - cloned for effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 blur-[1px] mix-blend-screen scale-105">
                 <motion.div 
                    className="flex whitespace-nowrap gap-12 h-full items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12">
                            {phrases.map((phrase, idx) => (
                                <div key={idx} className="flex items-center gap-6">
                                    <div className="w-8 h-8 opacity-0" />
                                    <span className="text-sm font-black tracking-[0.2em] uppercase italic text-sunset-amber/30">
                                        {phrase}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-transparent" />
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Ticker;
