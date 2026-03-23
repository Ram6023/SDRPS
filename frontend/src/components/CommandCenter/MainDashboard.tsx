import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, AlertCircle, Sparkles, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface MainDashboardProps {
  history?: any[];
}

const MainDashboard: React.FC<MainDashboardProps> = ({ history = [] }) => {
  const chartData = history.length > 5 ? history.slice(0, 10).reverse() : [
    { name: '08:00', risk: 45, confidence: 92 },
    { name: '10:00', risk: 52, confidence: 88 },
    { name: '12:00', risk: 48, confidence: 94 },
    { name: '14:00', risk: 61, confidence: 91 },
    { name: '16:00', risk: 55, confidence: 95 },
  ];

  const StatPanel = ({ title, val, icon: Icon, color, bg, border }: any) => (
    <div className={cn("p-6 rounded-2xl border backdrop-blur-3xl relative overflow-hidden group/stat transition-all duration-700 hover:bg-white/[0.02] shadow-2xl", bg, border)}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="flex items-center justify-between mb-6">
            <div className={cn("p-3 rounded-lg shadow-2xl", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
            </div>
            <div className="text-[8px] font-mono font-black text-slate-700 tracking-[0.2em] uppercase">{title}</div>
        </div>
        <div className="text-3xl font-black text-white tracking-tighter leading-none mb-2 group-hover/stat:scale-105 transition-transform origin-left duration-700">{val}</div>
        <div className="flex items-center gap-2 mt-3 opacity-40 group-hover/stat:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-sunset-amber animate-pulse" />
            <span className="text-[7px] font-black text-slate-800 tracking-widest uppercase">ENROLLMENT_NODE</span>
        </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Risk Trajectory Chart */}
      <div className="lg:col-span-8">
        <TiltCard glowColor="245, 158, 11">
          <div className="panel-glass rounded-[2rem] p-8 h-[450px] flex flex-col relative overflow-hidden border-white/[0.04] shadow-2xl" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunset-amber/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8" style={{ transform: 'translateZ(30px)' }}>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/40 shadow-2xl">
                        <TrendingUp className="w-5 h-5 text-sunset-amber" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight leading-none uppercase italic border-l-2 border-sunset-amber pl-4">RISK_TRAJECTORY</h3>
                        <span className="text-[8px] font-mono font-black text-slate-700 tracking-[0.3em] uppercase ml-4">NEURAL_TEMPORAL_FLOW</span>
                    </div>
                 </div>
                 <div className="flex gap-2">
                     {['YEARLY', 'MONTHLY', 'REAL_TIME'].map(t => (
                        <button key={t} className="px-3 py-1.5 rounded-lg text-[8px] font-black text-slate-700 border border-white/5 hover:bg-white/5 transition-all tracking-[0.1em]">{t}</button>
                     ))}
                 </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]" style={{ transform: 'translateZ(20px)' }}>
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#be123c" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#be123c" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                   <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} tick={{fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                   <YAxis hide domain={[0, 100]} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(5, 8, 16, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.8)', backdropFilter: 'blur(40px)', padding: '24px' }}
                     itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}
                   />
                   <Area type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorRisk)" />
                   <Area type="monotone" dataKey="confidence" stroke="#be123c" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorConf)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
            
            <div className="mt-12 flex justify-between items-center opacity-30 px-4" style={{ transform: 'translateZ(10px)' }}>
                 <div className="text-[10px] font-mono font-bold text-slate-800 flex items-center gap-4 tracking-widest"><Sparkles className="w-4 h-4" /> NO_ANOMALIES_DETECTED</div>
                 <div className="flex gap-2">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-6 bg-white/5 rounded-full" />)}
                 </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Side Stats */}
      <div className="lg:col-span-4 grid grid-rows-2 gap-8">
        <StatPanel title="ACTIVE_MONITORING" val="1.8K" icon={Users} color="text-sunset-amber" bg="bg-sunset-amber/10" border="border-sunset-amber/30" />
        <StatPanel title="DATA_INGEST_RATE" val="99.9%" icon={Database} color="text-sunset-rose" bg="bg-sunset-rose/10" border="border-sunset-rose/30" />
      </div>

      {/* Lower Dashboard */}
      <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
         <TiltCard glowColor="30, 27, 75">
            <div className="panel-glass rounded-[2rem] p-8 h-[350px] border-white/[0.04] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-academy-navy/10 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-academy-navy/10 rounded-xl ring-1 ring-academy-navy/40 shadow-2xl">
                        <Activity className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-xl font-black text-white tracking-tight uppercase italic">LIVE_FEED</div>
                </div>
                <div className="flex-1 w-full h-[200px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <BarChart data={chartData}>
                             <Bar dataKey="risk">
                                 {chartData.map((_, index: number) => (
                                     <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f59e0b' : '#be123c'} radius={5} />
                                 ))}
                             </Bar>
                             <XAxis hide />
                             <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{ display: 'none' }} />
                         </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
         </TiltCard>

         <div className="lg:col-span-2">
             <TiltCard glowColor="245, 158, 11">
                <div className="panel-glass rounded-[2rem] p-8 h-[350px] border-white/[0.04] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sunset-amber/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/40 shadow-2xl">
                            <Sparkles className="w-5 h-5 text-sunset-amber" />
                        </div>
                        <div className="text-xl font-black text-white tracking-tight uppercase italic">ALIGNMENT_INDEX</div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <div className="text-4xl font-black text-white tracking-tighter">94.2%</div>
                            <div className="text-[8px] font-mono font-black text-slate-700 tracking-[0.2em] uppercase">SYSTEM_SUCCESS</div>
                            <div className="h-1 w-full bg-white/5 rounded-full relative overflow-hidden mt-4">
                                <motion.div initial={{ width: 0 }} animate={{ width: '94.2%' }} transition={{ duration: 2 }} className="h-full bg-sunset-amber rounded-full" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <div className="text-4xl font-black text-white tracking-tighter">12.4%</div>
                            <div className="text-[8px] font-mono font-black text-slate-700 tracking-[0.2em] uppercase">DROPOUT_GAIN</div>
                            <div className="h-1 w-full bg-white/5 rounded-full relative overflow-hidden mt-4">
                                <motion.div initial={{ width: 0 }} animate={{ width: '12.4%' }} transition={{ duration: 2 }} className="h-full bg-sunset-rose rounded-full" />
                            </div>
                         </div>
                    </div>
                    <div className="mt-8 p-6 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-3xl">
                        <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-lg bg-sunset-amber/10 flex items-center justify-center text-sunset-amber ring-1 ring-sunset-amber/30"><AlertCircle className="w-4 h-4" /></div>
                             <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed italic">Neural pathways indicate a <span className="text-sunset-amber">4.2% increase</span> in student retention.</p>
                        </div>
                    </div>
                </div>
             </TiltCard>
         </div>
      </div>
    </div>
  );
};

export default MainDashboard;
