import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import StatGrid from '../components/CommandCenter/StatGrid';
import MainDashboard from '../components/CommandCenter/MainDashboard';
import PredictionHub from '../components/CommandCenter/PredictionHub';
import ResultGauge from '../components/CommandCenter/ResultGauge';
import AIExplanation from '../components/CommandCenter/AIExplanation';
import BulkUpload from '../components/BulkUpload';
import { predictDropoutRisk } from '../services/api';
import { Bell, Search, LayoutDashboard, Database, BarChart3, Activity, Shield, GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import campusBg from '../assets/campus_bg.png';
import holographicCore from '../assets/holographic_core.png';

// ── Cinematic Scroll Reveal ──
const CinematicReveal = ({ children, className = '', delay = 0, scale = true }: { children: React.ReactNode; className?: string; delay?: number; scale?: boolean }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, filter: 'blur(20px)', scale: scale ? 0.9 : 1 }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
            transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ── Neural Typing Effect ──
const NeuralTypeWriter = ({ text }: { text: string }) => {
    const [displayed, setDisplayed] = useState('');
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        if (idx < text.length) {
            const t = setTimeout(() => { setDisplayed(p => p + text[idx]); setIdx(p => p + 1); }, 20);
            return () => clearTimeout(t);
        }
    }, [idx, text]);
    return <span className="font-mono tracking-tight text-sunset-amber/80">{displayed}{idx < text.length && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-sunset-amber inline-block w-2 ml-1">_</motion.span>}</span>;
};

const Home = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentResult, setCurrentResult] = useState<any>(null);

    const { scrollY } = useScroll();
    const headerBg = useTransform(scrollY, [0, 80], ['rgba(4,4,9,0)', 'rgba(4,4,9,0.96)']);
    const headerBlur = useTransform(scrollY, [0, 80], [0, 40]);
    const headerBorder = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(245,158,11,0.1)']);

    // Hero Effects
    const heroY = useTransform(scrollY, [0, 600], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 600], [1, 0.85]);

    // Mouse 3D Depth
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const springX = useSpring(mx, { stiffness: 40, damping: 20 });
    const springY = useSpring(my, { stiffness: 40, damping: 20 });
    const rotateX = useTransform(springY, [-400, 400], [8, -8]);
    const rotateY = useTransform(springX, [-400, 400], [-8, 8]);

    useEffect(() => {
        const h = (e: MouseEvent) => { mx.set(e.clientX - window.innerWidth / 2); my.set(e.clientY - window.innerHeight / 2); };
        window.addEventListener('mousemove', h);
        return () => window.removeEventListener('mousemove', h);
    }, [mx, my]);

    useEffect(() => {
        const saved = sessionStorage.getItem('risk_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const handlePredict = async (data: any) => {
        setLoading(true);
        // Separate display data from backend payload
        const { name, ...predictionPayload } = data;
        try {
            const result = await predictDropoutRisk(predictionPayload);
            if (!result) throw new Error("UNABLE_TO_RETRIEVE_PROJECTION");
            
            setCurrentResult(result);
            const entry = { 
                ...result, 
                attendance: data.attendance, 
                name: name || 'STUDENT_ANONYMOUS', 
                timestamp: new Date().toLocaleTimeString() 
            };
            const u = [entry, ...history].slice(0, 50);
            setHistory(u);
            sessionStorage.setItem('risk_history', JSON.stringify(u));
            setActiveTab('result');
        } catch (err: any) { 
            console.error('DIAGNOSTIC_FAILURE:', err);
            alert(`SYSTEM_ERROR: ${err.message || 'NEURAL_LINK_INTERRUPTED'}`); 
        } finally { setLoading(false); }
    };

    const tabs = [
        { id: 'dashboard', label: 'OVERVIEW', icon: LayoutDashboard },
        { id: 'predict', label: 'PREDICTION_HUB', icon: Activity },
        { id: 'bulk', label: 'BATCH_INGEST', icon: Database },
        { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
    ];

    return (
        <div className="relative min-h-screen bg-obsidian text-slate-300 overflow-x-hidden" style={{ perspective: '1500px' }}>
            {/* ── Artistic Background Layers ── */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div 
                    style={{ scale: 1.05, backgroundImage: `url(${campusBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    className="absolute inset-0 opacity-40 mix-blend-screen grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/80 to-obsidian" />
                <div className="absolute inset-0 bg-grid-cyber opacity-[0.05]" />
                <div className="absolute inset-0 bg-neural-dots opacity-[0.08]" />
                
                {/* Advanced Depth Glows */}
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-sunset-amber/5 blur-[180px] rounded-full animate-pulse-slow" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-sunset-rose/5 blur-[180px] rounded-full animate-pulse-slow-reverse" />
            </div>

            {/* ── Spatial Floating Header ── */}
            <motion.header
                style={{
                    backdropFilter: useTransform(headerBlur, b => `blur(${b}px) saturate(2)`),
                    backgroundColor: headerBg,
                    borderBottom: useTransform(headerBorder, c => `1px solid ${c}`),
                }}
                className="fixed top-0 left-0 right-0 h-20 lg:h-24 px-8 lg:px-16 flex items-center justify-between z-50 transition-all duration-300"
            >
                <div className="flex items-center gap-16">
                    <motion.div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveTab('dashboard')} whileHover={{ scale: 1.05 }}>
                        <div className="relative">
                            <motion.div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white relative z-10 overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-1 ring-white/20"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #be123c)' }}
                            >
                                <GraduationCap className="w-6 h-6" />
                                <motion.div className="absolute inset-0 bg-white/20" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
                            </motion.div>
                            <div className="absolute -inset-4 bg-sunset-amber blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-black text-lg tracking-tighter leading-none uppercase italic border-l-2 border-sunset-amber pl-3">STUDENT_<span className="text-sunset-amber ml-1">DROPOUT</span></h1>
                            <span className="text-[9px] text-sunset-rose/80 font-mono font-bold tracking-[0.4em] uppercase ml-3">RISK_PREDICTION_SYSTEM</span>
                        </div>
                    </motion.div>

                    <nav className="hidden lg:flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                        {tabs.map((t) => (
                            <button key={t.id} onClick={() => setActiveTab(t.id)}
                                className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all flex items-center gap-3",
                                    activeTab === t.id ? "bg-white/[0.07] text-white shadow-xl ring-1 ring-white/10" : "text-slate-500 hover:text-slate-300"
                                )}>
                                <t.icon className={cn("w-4 h-4", activeTab === t.id ? "text-sunset-amber" : "text-slate-600")} />
                                {t.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden xl:flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5 group transition-all hover:border-sunset-amber/30">
                        <Search className="w-4 h-4 text-slate-700 group-hover:text-sunset-amber" />
                        <span className="text-[10px] font-mono font-bold text-slate-800 uppercase tracking-widest">SCAN_DRIVE...</span>
                         <div className="flex gap-1 ml-8">
                             {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-900" />)}
                        </div>
                    </div>
                    <div className="relative cursor-pointer group">
                        <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 group-hover:text-white transition-all">
                            <Bell className="w-5 h-5" />
                        </motion.div>
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-sunset-amber rounded-full shadow-[0_0_15px_#f59e0b] border-2 border-obsidian" />
                    </div>
                </div>
            </motion.header>

            <main className="relative z-10 max-w-[1700px] mx-auto pt-44 pb-32 px-8 lg:px-16">
                {/* ── Hero Dynamic Section ── */}
                <motion.div 
                    style={{ y: heroY, opacity: heroOpacity, scale: heroScale, rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    className="mb-48 text-center relative"
                >
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex justify-center mb-12">
                        <div className="px-6 py-2 rounded-full text-[9px] font-mono font-black text-sunset-amber tracking-[0.5em] uppercase border border-sunset-amber/30 bg-sunset-amber/5 flex items-center gap-3 backdrop-blur-xl">
                            <Shield className="w-4 h-4" /> INSTITUTIONAL_INTEGRITY_CERTIFIED
                        </div>
                    </motion.div>

                    <div className="space-y-4 mb-20 relative" style={{ transform: 'translateZ(100px)' }}>
                         <div className="overflow-hidden">
                            <motion.h2 initial={{ y: 200, skewY: 10 }} animate={{ y: 0, skewY: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="text-6xl sm:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.8] text-white uppercase drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]">
                                STUDENT DROPOUT
                            </motion.h2>
                         </div>
                         <div className="overflow-hidden flex items-center justify-center gap-10">
                            <motion.div initial={{ width: 0 }} animate={{ width: 120 }} transition={{ duration: 1, delay: 0.8 }} className="h-0.5 bg-white/10" />
                            <motion.h2 initial={{ y: 200, skewY: -10 }} animate={{ y: 0, skewY: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="text-6xl sm:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.8] gradient-text uppercase drop-shadow-[0_40px_60px_rgba(245,158,11,0.3)]">
                                RISK PREDICTION
                            </motion.h2>
                            <motion.div initial={{ width: 0 }} animate={{ width: 120 }} transition={{ duration: 1, delay: 0.8 }} className="h-0.5 bg-white/10" />
                         </div>
                    </div>

                    <motion.div style={{ transform: 'translateZ(150px)' }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] opacity-20 pointer-events-none">
                         <motion.img src={holographicCore} animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ rotate: { duration: 40, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity } }} className="w-full h-full object-contain filter hue-rotate-180 brightness-150" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }} className="max-w-3xl mx-auto mb-20 p-8 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl" style={{ transform: 'translateZ(50px)' }}>
                        <div className="flex items-center gap-3 mb-6 text-[10px] font-mono text-slate-700 border-b border-white/5 pb-4 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-sunset-amber animate-pulse shadow-[0_0_10px_#f59e0b]" />
                            PROTOCOL_STATUS: [SYSTEM_NOMINAL_SYNC]
                        </div>
                        <p className="text-xl sm:text-2xl text-slate-300 font-bold leading-relaxed tracking-tight">
                            <NeuralTypeWriter text="Advanced Neural Analytics Engine for Real-time Student Dropout Risk Prediction and Institutional Success Mitigation." />
                        </p>
                    </motion.div>

                    <div className="flex items-center justify-center gap-8" style={{ transform: 'translateZ(80px)' }}>
                        <motion.button whileHover={{ scale: 1.05, y: -10 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab('predict')}
                            className="btn-premium px-16 py-6 text-xs font-black tracking-[0.4em] shimmer-accent shadow-3xl">
                            INITIALIZE_SCAN_FLOW <Activity className="w-5 h-5" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05, y: -10 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab('bulk')}
                                className="px-16 py-6 rounded-[2rem] text-xs font-black tracking-[0.4em] text-white border border-white/10 flex items-center gap-4 hover:bg-white/[0.05] transition-all bg-black/40 backdrop-blur-3xl shadow-2xl">
                            <Database className="w-5 h-5 text-sunset-amber" /> BATCH_DATA_INGEST
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Dashboard Grid ── */}
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div key="dashboard" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                            <CinematicReveal className="mb-24"><StatGrid history={history} /></CinematicReveal>
                            <CinematicReveal><MainDashboard history={history} /></CinematicReveal>
                        </motion.div>
                    )}

                    {activeTab === 'predict' && (
                        <motion.div key="predict" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }}>
                             <CinematicReveal><PredictionHub onSubmit={handlePredict} loading={loading} /></CinematicReveal>
                        </motion.div>
                    )}

                    {activeTab === 'result' && currentResult && (
                        <motion.div key="result" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="space-y-12">
                           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-12">
                                     <button onClick={() => setActiveTab('predict')} className="mb-8 flex items-center gap-3 text-[10px] font-mono font-black text-slate-600 hover:text-sunset-amber transition-colors uppercase tracking-[0.4em]">
                                        <Activity className="w-4 h-4 rotate-180" /> RETREAT_TO_NEURAL_HUB
                                     </button>
                                </div>
                                <div className="lg:col-span-5"><CinematicReveal><ResultGauge result={currentResult} /></CinematicReveal></div>
                                <div className="lg:col-span-7"><CinematicReveal><AIExplanation result={currentResult} /></CinematicReveal></div>
                                <div className="lg:col-span-12"><CinematicReveal><MainDashboard history={history} /></CinematicReveal></div>
                           </div>
                        </motion.div>
                    )}

                    {activeTab === 'bulk' && (
                        <motion.div key="bulk" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.6 }}>
                             <CinematicReveal><BulkUpload onResult={(results) => { setHistory([...results, ...history].slice(0, 50)); setHistory(results); setActiveTab('dashboard'); }} /></CinematicReveal>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, rotateX: -20 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0, rotateX: 20 }} transition={{ duration: 0.8 }}>
                             <CinematicReveal><MainDashboard history={history} /></CinematicReveal>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* ── Global HUD Scanline ── */}
            <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.02] overflow-hidden">
                <div className="absolute inset-0 bg-scanline animate-scan" style={{ backgroundSize: '100% 4px' }} />
            </div>

            {/* ── Modern Footer ── */}
            <footer className="relative z-10 border-t border-white/[0.03] py-24 px-16 bg-black/40 backdrop-blur-3xl">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                             <div className="w-10 h-10 rounded-xl bg-sunset-amber/10 flex items-center justify-center text-sunset-amber ring-1 ring-sunset-amber/30"><Shield className="w-5 h-5" /></div>
                             <h4 className="text-xl font-black text-white tracking-tighter uppercase">STUDENT_DROPOUT_<span className="text-sunset-amber">RISK_PREDICTION</span></h4>
                        </div>
                        <p className="text-sm text-slate-700 font-bold max-w-md uppercase tracking-tight">Institutional neural infrastructure for advanced student dropout risk prediction and academic integrity conservation.</p>
                    </div>
                    <div className="flex gap-10">
                         {[Users, Shield, Database, GraduationCap].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -8, color: '#f59e0b' }} className="text-slate-700 cursor-pointer transition-colors"><Icon className="w-7 h-7" /></motion.div>
                         ))}
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-16 border-t border-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-8">
                     <span className="text-[10px] font-mono font-black text-slate-800 tracking-[0.5em] uppercase">© 2026 DROPOUT_MITIGATION_LABS // ALL_PROTOCOLS_RESERVED</span>
                     <div className="flex gap-12 text-[10px] font-black text-slate-800 tracking-widest uppercase cursor-pointer">
                        <span className="hover:text-sunset-amber transition-colors">SECURITY_MANIFESTO</span>
                        <span className="hover:text-sunset-amber transition-colors">PRIVACY_POLICY</span>
                     </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
