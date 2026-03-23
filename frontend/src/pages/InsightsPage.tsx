import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles, BrainCircuit, Activity, ShieldCheck, Zap } from 'lucide-react';
import AIExplanation from '@/components/CommandCenter/AIExplanation';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';
import { Link } from 'react-router-dom';

const InsightsPage: React.FC = () => {
    const [lastResult, setLastResult] = useState<any>(null);

    useEffect(() => {
        const saved = sessionStorage.getItem('risk_history');
        if (saved) {
            const h = JSON.parse(saved);
            if (h.length > 0) setLastResult(h[0]);
        }
    }, []);

    const genericInsights = [
        { label: 'COGNITIVE_ATTRITION', desc: 'Student attendance is the #1 precursor for institutional dropout risk among the current demographic.', icon: BrainCircuit, color: 'text-sunset-amber' },
        { label: 'FINANCIAL_STRESS', desc: 'Financial misalignment results in a 42% increase in immediate student attrition probability.', icon: ShieldCheck, color: 'text-emerald-500' },
        { label: 'ACADEMIC_DYNAMISM', desc: 'Declining academic performance across consecutive semesters is a high-priority indicator.', icon: Activity, color: 'text-sunset-rose' }
    ];

    return (
        <main className="min-h-screen pt-24 px-6 lg:px-12 pb-16 bg-academy-navy relative overflow-hidden bg-neural-dots">
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-sunset-rose/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-[1200px] mx-auto w-full relative z-10">
                <div className="flex flex-col items-center text-center mb-10">
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                        <div className="p-3 bg-emerald-500/10 rounded-xl ring-1 ring-emerald-500/30 mb-4"><Sparkles className="w-6 h-6 text-emerald-500" /></div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none mb-2">NEURAL PROGNOSTIC INSIGHTS</h2>
                        <span className="text-[9px] font-mono font-bold text-slate-600 tracking-widest uppercase">AI_EXPLANATIONS_CORE_V5</span>
                     </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8">
                         {lastResult ? (
                            <AIExplanation result={lastResult} />
                         ) : (
                            <div className="panel-glass rounded-2xl p-12 text-center border-white/[0.04] opacity-30 hover:opacity-100 transition-all duration-700">
                                <Info className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">AWAITING STUDENT METADATA</h3>
                                <p className="text-xs text-slate-600 uppercase tracking-wider">Run a prediction first to generate specific neural insights.</p>
                            </div>
                         )}
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                         <h4 className="text-sm font-black text-white tracking-tight uppercase px-4 border-l-2 border-sunset-amber">GLOBAL DIAGNOSTIC VECTORS</h4>
                         {genericInsights.map((insight, i) => (
                            <TiltCard key={i} glowColor="245, 158, 11">
                                <div className="panel-glass rounded-xl p-6 flex flex-col items-start gap-4 border-white/[0.04] hover:bg-white/[0.02] transition-all">
                                     <div className={cn("p-2 rounded-lg bg-white/5", insight.color)}>
                                         <insight.icon className="w-4 h-4" />
                                     </div>
                                     <div>
                                         <div className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-700 mb-1">{insight.label}</div>
                                         <p className="text-xs text-slate-400 leading-relaxed">{insight.desc}</p>
                                     </div>
                                </div>
                            </TiltCard>
                         ))}
                    </div>
                </div>
                
                <div className="mt-12 p-8 rounded-2xl bg-sunset-amber/5 border border-sunset-amber/20 backdrop-blur-3xl flex items-center justify-between text-sunset-amber relative overflow-hidden">
                     <div className="flex items-center gap-6">
                         <Zap className="w-8 h-8" />
                         <div>
                             <h4 className="text-lg font-black text-white tracking-tight uppercase leading-none">ACTION PROTOCOL READY</h4>
                             <p className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-40">1.2M predictive audits completed.</p>
                         </div>
                     </div>
                     <Link to="/predict">
                        <button className="px-6 py-3 rounded-xl bg-sunset-amber/10 border border-sunset-amber/30 hover:bg-sunset-amber hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider">START_SCAN</button>
                     </Link>
                </div>
            </div>
        </main>
    );
};

export default InsightsPage;
