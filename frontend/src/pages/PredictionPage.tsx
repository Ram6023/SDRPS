import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, RefreshCw, Layers } from 'lucide-react';
import PredictionHub from '@/components/CommandCenter/PredictionHub';
import ResultGauge from '@/components/CommandCenter/ResultGauge';
import { predictDropoutRisk } from '@/services/api';

const PredictionPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handlePredict = async (data: any) => {
        setLoading(true);
        const { name, ...payload } = data;
        try {
            const res = await predictDropoutRisk(payload);
            setResult({ ...res, name: name || 'STUDENT_ANONYMOUS' });
            const saved = sessionStorage.getItem('risk_history');
            const history = saved ? JSON.parse(saved) : [];
            const entry = { ...res, attendance: data.attendance, name: name || 'STUDENT_ANONYMOUS', timestamp: new Date().toLocaleTimeString() };
            sessionStorage.setItem('risk_history', JSON.stringify([entry, ...history].slice(0, 50)));
        } catch (err: any) { 
            console.error('DIAGNOSTIC_FAILURE:', err);
            alert(`SYSTEM_ERROR: ${err.message || 'NEURAL_LINK_INTERRUPTED'}`); 
        } finally { setLoading(false); }
    };

    return (
        <main className="min-h-screen pt-24 px-6 lg:px-12 pb-16 bg-academy-navy relative overflow-hidden bg-neural-dots">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunset-amber/5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-[1200px] mx-auto w-full">
                <div className="flex items-center justify-between mb-10">
                     <div className="flex items-center gap-4 text-sunset-amber">
                       <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/30">
                           <BrainCircuit className="w-6 h-6" />
                       </div>
                       <div>
                         <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">RISK PREDICTION NODE</h2>
                         <span className="text-[9px] font-mono font-bold text-slate-600 tracking-widest uppercase">DIAGNOSTIC_MODULE_V2.4</span>
                       </div>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={() => setResult(null)} className="px-5 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-slate-500 text-[10px] font-bold uppercase hover:bg-white/5 hover:text-white transition-all flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" /> RESET</button>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sunset-amber/10 border border-sunset-amber/30">
                           <div className="w-1.5 h-1.5 rounded-full bg-sunset-amber animate-pulse" />
                           <span className="text-[9px] font-mono font-bold text-sunset-amber uppercase tracking-widest">ACTIVE</span>
                        </div>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                         <PredictionHub onSubmit={handlePredict} loading={loading} />
                    </div>
                    <div className="lg:col-span-5 h-[500px]">
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                                    <div className="panel-glass rounded-2xl h-full p-10 flex flex-col items-center justify-center text-center relative overflow-hidden opacity-30 hover:opacity-100 transition-all duration-700 border-white/[0.04]">
                                        <Layers className="w-20 h-20 text-slate-800 mb-6" />
                                        <h3 className="text-xl font-black text-slate-700 tracking-tight uppercase mb-2">AWAITING INPUT</h3>
                                        <p className="text-xs text-slate-700 uppercase tracking-wider">Complete the form to initialize risk projection.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
                                    <ResultGauge probability={result.probability} riskLevel={result.risk_level} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default PredictionPage;
