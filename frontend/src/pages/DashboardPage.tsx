import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles, ChevronDown, Activity, AlertCircle } from 'lucide-react';
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
        <main className="min-h-screen pt-20 px-6 lg:px-12 pb-16 bg-academy-navy relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sunset-amber/5 blur-[150px] rounded-full opacity-30" />
                <div className="absolute inset-0 bg-grid-cyber opacity-[0.03]" />
                <div className="absolute inset-0 bg-gradient-to-b from-academy-navy via-transparent to-academy-navy" />
            </div>
            
            <div className="max-w-[1400px] mx-auto w-full relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                     <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5">
                       <div className="relative group">
                            <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/40 shadow-xl relative z-10 transition-transform group-hover:scale-110">
                                <LayoutDashboard className="w-6 h-6 text-sunset-amber" />
                            </div>
                            <div className="absolute -inset-2 bg-sunset-amber blur-2xl opacity-0 group-hover:opacity-30 transition-opacity" />
                       </div>
                       <div>
                         <h2 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none border-l-2 border-sunset-amber pl-4">ANALYTICS_COMMAND</h2>
                         <span className="text-[9px] font-mono font-black text-slate-700 tracking-[0.3em] uppercase ml-4 mt-1 block">DASHBOARD_PROTOCOL_V5.0</span>
                       </div>
                     </motion.div>
                     
                     <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5 backdrop-blur-2xl">
                            {['REAL_TIME', 'HISTORY', 'LOGS'].map(m => (
                                <button key={m} className="px-4 py-1.5 rounded-lg text-[8px] font-black tracking-[0.1em] text-slate-700 hover:text-white hover:bg-white/5 transition-all uppercase">{m}</button>
                            ))}
                        </div>
                        <button className="px-5 py-2 rounded-xl bg-sunset-amber/10 border border-sunset-amber/30 text-sunset-amber text-[9px] font-black uppercase tracking-[0.1em] hover:bg-sunset-amber hover:text-white transition-all flex items-center gap-2 shadow-xl">EXPORT_DATA <ChevronDown className="w-3.5 h-3.5" /></button>
                     </div>
                </div>

                <div className="mb-10">
                    <StatGrid history={history} />
                </div>

                <div className="mb-10">
                    <MainDashboard history={history} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-8">
                         <TiltCard glowColor="245, 158, 11">
                             <div className="panel-glass rounded-[2rem] p-8 min-h-[400px] flex flex-col relative overflow-hidden border-white/[0.04] shadow-xl">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-sunset-amber/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                <div className="flex items-center justify-between mb-8">
                                     <div className="flex items-center gap-4">
                                         <div className="p-2.5 bg-sunset-amber/10 rounded-lg ring-1 ring-sunset-amber/30 shadow-xl"><Sparkles className="w-4 h-4 text-sunset-amber" /></div>
                                         <div className="text-lg font-black text-white tracking-tight uppercase italic">DIAGNOSTIC_LOGS</div>
                                     </div>
                                     <button className="text-[8px] font-black text-slate-800 tracking-widest uppercase hover:text-sunset-amber transition-colors">VIEW_ALL {">>"} </button>
                                </div>
                                <div className="space-y-3 flex-1">
                                     {history.slice(0, 6).map((h, i) => (
                                         <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-4 rounded-[1.2rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all flex items-center justify-between group/item"
                                         >
                                             <div className="flex items-center gap-5">
                                                 <div className={cn("w-1 h-8 rounded-full shadow-md", h.risk_level === 'High' ? 'bg-sunset-rose' : 'bg-emerald-500')} />
                                                 <div>
                                                     <div className="text-xs font-black text-white tracking-tight uppercase group-hover/item:text-sunset-amber transition-colors">NODE_{i + 1024}</div>
                                                     <div className="text-[8px] font-mono font-black text-slate-800 uppercase tracking-widest mt-0.5">
                                                         {h.timestamp} [CONFIRMED]
                                                     </div>
                                                 </div>
                                             </div>
                                             <div className="flex flex-col items-end">
                                                  <div className={cn("text-xl font-black font-mono tracking-tighter", h.risk_level === 'High' ? 'text-sunset-rose' : 'text-emerald-500')}>{Math.round(h.probability * 100)}%</div>
                                                  <div className="text-[7px] font-black text-slate-900 uppercase tracking-widest">RISK</div>
                                             </div>
                                         </motion.div>
                                     ))}
                                </div>
                             </div>
                         </TiltCard>
                     </div>

                     <div className="lg:col-span-4 flex flex-col gap-8">
                          <TiltCard glowColor="190, 18, 60">
                             <div className="panel-glass rounded-[2rem] h-full p-8 border-white/[0.04] shadow-xl flex flex-col justify-center relative overflow-hidden group">
                                <AlertCircle className="absolute -bottom-6 -right-6 w-24 h-24 text-sunset-rose/10 pointer-events-none" />
                                <div className="relative z-10 flex items-center gap-4 mb-4">
                                     <div className="p-3 bg-sunset-rose/10 rounded-xl ring-1 ring-sunset-rose/30 shadow-xl"><AlertCircle className="w-5 h-5 text-sunset-rose" /></div>
                                     <h4 className="text-sm font-black text-white tracking-tight uppercase italic leading-none">ANOMALY_TRACKER</h4>
                                </div>
                                <p className="text-xs text-slate-600 font-bold uppercase tracking-tight italic leading-relaxed">3 clusters detected with high attrition probability.</p>
                             </div>
                          </TiltCard>
                          <TiltCard glowColor="16, 185, 129">
                             <div className="panel-glass rounded-[2rem] h-full p-8 border-white/[0.04] shadow-xl flex flex-col justify-center relative overflow-hidden group">
                                <Activity className="absolute -bottom-6 -right-6 w-24 h-24 text-emerald-500/10 pointer-events-none" />
                                <div className="relative z-10 flex items-center gap-4 mb-4">
                                     <div className="p-3 bg-emerald-500/10 rounded-xl ring-1 ring-emerald-500/30 shadow-xl"><Activity className="w-5 h-5 text-emerald-500" /></div>
                                     <h4 className="text-sm font-black text-white tracking-tight uppercase italic leading-none">OPTIMIZATION</h4>
                                </div>
                                <p className="text-xs text-slate-600 font-bold uppercase tracking-tight italic leading-relaxed">Institutional interventions boosted success index by 12.4%.</p>
                             </div>
                          </TiltCard>
                     </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
