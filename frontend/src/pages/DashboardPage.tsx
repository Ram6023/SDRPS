import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles, Filter, ChevronDown, Activity, AlertCircle } from 'lucide-react';
import StatGrid from '@/components/CommandCenter/StatGrid';
import MainDashboard from '@/components/CommandCenter/MainDashboard';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

const DashboardPage: React.FC = () => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const saved = sessionStorage.getItem('risk_history');
        if (saved) setHistory(JSON.parse(saved));
        else {
            const mock = Array.from({ length: 10 }).map((_, i) => ({
                probability: 0.1 + Math.random() * 0.8,
                risk_level: Math.random() > 0.7 ? 'High' : 'Low',
                attendance: 60 + Math.random() * 35,
                timestamp: `${8 + i}:00`
            }));
            setHistory(mock);
        }
    }, []);

    return (
        <main className="min-h-screen pt-24 px-6 lg:px-12 pb-16 bg-academy-navy relative overflow-hidden bg-grid-cyber">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sunset-amber/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-academy-navy via-transparent to-academy-navy pointer-events-none" />

            <div className="max-w-[1200px] mx-auto w-full relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 text-sunset-amber">
                       <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/30">
                           <LayoutDashboard className="w-6 h-6" />
                       </div>
                       <div>
                         <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">ANALYTICS COMMAND CENTER</h2>
                         <span className="text-[9px] font-mono font-bold text-slate-600 tracking-widest uppercase">DASHBOARD_PROTOCOL_V3.1</span>
                       </div>
                     </motion.div>
                     
                     <div className="flex flex-wrap gap-3 items-center">
                        <button className="px-5 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-slate-500 text-[10px] font-bold uppercase hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"><Filter className="w-3.5 h-3.5" /> FILTER</button>
                        <button className="px-5 py-2 rounded-lg bg-sunset-amber/10 border border-sunset-amber/30 text-sunset-amber text-[10px] font-bold uppercase hover:bg-sunset-amber hover:text-white transition-all flex items-center gap-2">EXPORT <ChevronDown className="w-3.5 h-3.5" /></button>
                     </div>
                </div>

                <div className="mb-10">
                    <StatGrid history={history} />
                </div>

                <div className="mb-10">
                    <MainDashboard history={history} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <TiltCard glowColor="245, 158, 11" className="h-[350px]">
                         <div className="panel-glass rounded-2xl h-full p-8 flex flex-col relative overflow-hidden border-white/[0.04]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/30"><Sparkles className="w-5 h-5 text-sunset-amber" /></div>
                                <div className="text-lg font-black text-white tracking-tight uppercase leading-none">INSIGHT LOGS</div>
                            </div>
                            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                                 {history.slice(0, 5).map((h, i) => (
                                     <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-center justify-between">
                                         <div className="flex items-center gap-3">
                                             <div className={cn("w-1 h-8 rounded-full", h.risk_level === 'High' ? 'bg-sunset-rose' : 'bg-emerald-500')} />
                                             <div>
                                                 <div className="text-xs font-bold text-white tracking-tight uppercase">NODE_{i + 124}</div>
                                                 <div className="text-[9px] font-mono text-slate-700 uppercase tracking-wider">{h.timestamp}</div>
                                             </div>
                                         </div>
                                         <div className={cn("text-sm font-black font-mono", h.risk_level === 'High' ? 'text-sunset-rose' : 'text-emerald-500')}>{Math.round(h.probability * 100)}%</div>
                                     </div>
                                 ))}
                            </div>
                         </div>
                     </TiltCard>

                     <div className="grid grid-rows-2 gap-8">
                         <TiltCard glowColor="190, 18, 60">
                            <div className="panel-glass rounded-2xl h-full p-6 border-white/[0.04] flex items-center gap-6">
                                <AlertCircle className="w-12 h-12 text-sunset-rose/30 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-black text-white tracking-tight uppercase mb-1">CRITICAL ANOMALY TRACKER</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">3 cognitive clusters detected with high attrition probability across the current cohort.</p>
                                </div>
                            </div>
                         </TiltCard>
                         <TiltCard glowColor="16, 185, 129">
                            <div className="panel-glass rounded-2xl h-full p-6 border-white/[0.04] flex items-center gap-6">
                                <Activity className="w-12 h-12 text-emerald-500/30 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-black text-white tracking-tight uppercase mb-1">SUCCESS OPTIMIZATION</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Institutional interventions boosted success index by 12.4% over 30 diagnostic cycles.</p>
                                </div>
                            </div>
                         </TiltCard>
                     </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
