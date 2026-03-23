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
        <main className="min-h-screen pt-24 px-8 lg:px-16 pb-24 bg-academy-navy relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sunset-amber/5 blur-[200px] rounded-full opacity-40" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sunset-rose/5 blur-[180px] rounded-full opacity-30" />
                <div className="absolute inset-0 bg-grid-cyber opacity-[0.05]" />
                <div className="absolute inset-0 bg-gradient-to-b from-academy-navy via-transparent to-academy-navy" />
            </div>
            
            <div className="max-w-[1700px] mx-auto w-full relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
                     <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                       <div className="relative group">
                            <div className="p-4 bg-sunset-amber/10 rounded-2xl ring-1 ring-sunset-amber/40 shadow-3xl relative z-10 transition-transform group-hover:scale-110">
                                <LayoutDashboard className="w-8 h-8 text-sunset-amber" />
                            </div>
                            <div className="absolute -inset-4 bg-sunset-amber blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
                       </div>
                       <div>
                         <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none border-l-4 border-sunset-amber pl-6">ANALYTICS_COMMAND_CENTER</h2>
                         <span className="text-[10px] font-mono font-black text-slate-700 tracking-[0.4em] uppercase ml-6 mt-2 block">DASHBOARD_PROTOCOL_V5.0 [SYNC_SUCCESS]</span>
                       </div>
                     </motion.div>
                     
                     <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-3xl shadow-2xl">
                            {['REAL_TIME', 'HISTORY', 'LOGS'].map(m => (
                                <button key={m} className="px-6 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] text-slate-700 hover:text-white hover:bg-white/5 transition-all">{m}</button>
                            ))}
                        </div>
                        <button className="px-6 py-3 rounded-xl bg-sunset-amber/10 border border-sunset-amber/30 text-sunset-amber text-[10px] font-black uppercase tracking-[0.2em] hover:bg-sunset-amber hover:text-white transition-all flex items-center gap-3 shadow-2xl">EXPORT_DATA <ChevronDown className="w-4 h-4" /></button>
                     </div>
                </div>

                <div className="mb-12">
                    <StatGrid history={history} />
                </div>

                <div className="mb-12">
                    <MainDashboard history={history} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                     <div className="lg:col-span-8">
                         <TiltCard glowColor="245, 158, 11">
                             <div className="panel-glass rounded-[3rem] p-12 min-h-[500px] flex flex-col relative overflow-hidden border-white/[0.04] shadow-3xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-sunset-amber/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                <div className="flex items-center justify-between mb-12">
                                     <div className="flex items-center gap-5">
                                         <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/30 shadow-2xl"><Sparkles className="w-5 h-5 text-sunset-amber" /></div>
                                         <div className="text-2xl font-black text-white tracking-tight uppercase italic">DIAGNOSTIC_INSIGHT_LOGS</div>
                                     </div>
                                     <button className="text-[9px] font-black text-slate-700 tracking-widest uppercase hover:text-sunset-amber transition-colors">VIEW_ALL_NODES {'>>'} </button>
                                </div>
                                <div className="space-y-4 flex-1">
                                     {history.slice(0, 6).map((h, i) => (
                                         <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all flex items-center justify-between group/item"
                                         >
                                             <div className="flex items-center gap-6">
                                                 <div className={cn("w-1.5 h-10 rounded-full shadow-lg", h.risk_level === 'High' ? 'bg-sunset-rose animate-pulse' : 'bg-emerald-500')} />
                                                 <div>
                                                     <div className="text-sm font-black text-white tracking-tight uppercase group-hover/item:text-sunset-amber transition-colors">STUDENT_IDENT_NODE_{i + 1024}</div>
                                                     <div className="text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest mt-1 flex items-center gap-3">
                                                         {h.timestamp} <span className="w-1 h-1 rounded-full bg-white/10" /> ID: [CONFIRMED]
                                                     </div>
                                                 </div>
                                             </div>
                                             <div className="flex flex-col items-end">
                                                  <div className={cn("text-2xl font-black font-mono tracking-tighter", h.risk_level === 'High' ? 'text-sunset-rose' : 'text-emerald-500')}>{Math.round(h.probability * 100)}%</div>
                                                  <div className="text-[8px] font-black text-slate-800 uppercase tracking-widest">RISK_PROJECTION</div>
                                             </div>
                                         </motion.div>
                                     ))}
                                </div>
                             </div>
                         </TiltCard>
                     </div>

                     <div className="lg:col-span-4 flex flex-col gap-12">
                          <TiltCard glowColor="190, 18, 60">
                             <div className="panel-glass rounded-[3rem] h-full p-10 border-white/[0.04] shadow-3xl flex flex-col justify-center relative overflow-hidden group">
                                <AlertCircle className="absolute -bottom-10 -right-10 w-40 h-40 text-sunset-rose/10 transition-transform group-hover:scale-110 pointer-events-none" />
                                <div className="relative z-10 flex items-center gap-6 mb-6">
                                     <div className="p-4 bg-sunset-rose/10 rounded-2xl ring-1 ring-sunset-rose/30 shadow-2xl"><AlertCircle className="w-7 h-7 text-sunset-rose" /></div>
                                     <h4 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">CRITICAL_ANOMALY_TRACKER</h4>
                                </div>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-tight italic opacity-60 leading-relaxed mt-4">3 cognitive clusters detected with high attrition probability across the current diagnostic cohort.</p>
                             </div>
                          </TiltCard>
                          <TiltCard glowColor="16, 185, 129">
                             <div className="panel-glass rounded-[3rem] h-full p-10 border-white/[0.04] shadow-3xl flex flex-col justify-center relative overflow-hidden group">
                                <Activity className="absolute -bottom-10 -right-10 w-40 h-40 text-emerald-500/10 transition-transform group-hover:scale-110 pointer-events-none" />
                                <div className="relative z-10 flex items-center gap-6 mb-6">
                                     <div className="p-4 bg-emerald-500/10 rounded-2xl ring-1 ring-emerald-500/30 shadow-2xl"><Activity className="w-7 h-7 text-emerald-500" /></div>
                                     <h4 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">SUCCESS_OPTIMIZATION</h4>
                                </div>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-tight italic opacity-60 leading-relaxed mt-4">Institutional interventions boosted success index by 12.4% over 30 diagnostic cycles.</p>
                             </div>
                          </TiltCard>
                     </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
