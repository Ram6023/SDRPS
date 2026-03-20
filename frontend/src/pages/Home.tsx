import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { GradientDots } from '@/components/ui/gradient-dots';
import StatGrid from '../components/CommandCenter/StatGrid';
import MainDashboard from '../components/CommandCenter/MainDashboard';
import PredictionHub from '../components/CommandCenter/PredictionHub';
import ResultGauge from '../components/CommandCenter/ResultGauge';
import AIExplanation from '../components/CommandCenter/AIExplanation';
import BulkUpload from '../components/BulkUpload';
import { predictDropoutRisk } from '../services/api';
import { Bell, Search, User, LayoutDashboard, Database, BarChart3, Sparkles, ArrowRight, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

// ── Cinematic Scroll Reveal ──
const CinematicReveal = ({ children, className = '', delay = 0, scale = true }: { children: React.ReactNode; className?: string; delay?: number; scale?: boolean }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, filter: 'blur(12px)', scale: scale ? 0.95 : 1 }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
            transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ── Typing Effect ──
const TypeWriter = ({ text }: { text: string }) => {
    const [displayed, setDisplayed] = useState('');
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        if (idx < text.length) {
            const t = setTimeout(() => { setDisplayed(p => p + text[idx]); setIdx(p => p + 1); }, 25);
            return () => clearTimeout(t);
        }
    }, [idx, text]);
    return <>{displayed}{idx < text.length && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-accent-400">|</motion.span>}</>;
};

const Home = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentResult, setCurrentResult] = useState<any>(null);

    const { scrollY } = useScroll();
    const headerBg = useTransform(scrollY, [0, 60], ['rgba(4,4,9,0)', 'rgba(4,4,9,0.92)']);
    const headerBlur = useTransform(scrollY, [0, 60], [0, 20]);
    const headerBorder = useTransform(scrollY, [0, 60], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)']);

    // Hero Scroll Effects
    const heroY = useTransform(scrollY, [0, 600], [0, 220]);
    const heroScale = useTransform(scrollY, [0, 600], [1, 0.9]);
    const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
    const heroBlurV = useTransform(scrollY, [0, 400], [0, 15]);

    // Mouse-driven 3D tilt
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const heroTiltX = useSpring(useTransform(my, v => v * 0.012), { stiffness: 60, damping: 25 });
    const heroTiltY = useSpring(useTransform(mx, v => v * -0.012), { stiffness: 60, damping: 25 });
    const heroShiftX = useSpring(useTransform(mx, v => v * 0.02), { stiffness: 40, damping: 20 });

    useEffect(() => {
        const h = (e: MouseEvent) => { mx.set(e.clientX - window.innerWidth / 2); my.set(e.clientY - window.innerHeight / 2); };
        window.addEventListener('mousemove', h);
        return () => window.removeEventListener('mousemove', h);
    }, [mx, my]);

    useEffect(() => {
        const saved = sessionStorage.getItem('risk_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const updateHistory = (r: any) => {
        const u = [r, ...history].slice(0, 50);
        setHistory(u);
        sessionStorage.setItem('risk_history', JSON.stringify(u));
    };

    const handlePredict = async (data: any) => {
        setLoading(true);
        try {
            const result = await predictDropoutRisk(data);
            setCurrentResult(result);
            updateHistory({ ...result, attendance: data.attendance, name: data.name || 'Anonymous', timestamp: new Date().toLocaleTimeString() });
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const tabs = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'predict', label: 'Predict', icon: Activity },
        { id: 'bulk', label: 'Upload', icon: Database },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <div className="relative min-h-screen bg-[#040409] text-slate-300 overflow-x-hidden selection:bg-accent-500/30" style={{ perspective: '1200px' }}>
            <GradientDots className="opacity-90" />

            {/* ── Ultra-Premium Glass Header ── */}
            <motion.header
                style={{
                    backdropFilter: useTransform(headerBlur, b => `blur(${b}px) saturate(1.8)`),
                    backgroundColor: headerBg,
                    borderBottom: useTransform(headerBorder, c => `1px solid ${c}`),
                }}
                className="fixed top-0 left-0 right-0 h-16 lg:h-20 px-6 lg:px-12 flex items-center justify-between z-50 border-white/[0.04]"
            >
                <div className="flex items-center gap-12">
                    <motion.div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('dashboard')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                        <div className="relative group">
                            <motion.div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white relative z-10 overflow-hidden shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)' }}
                                animate={{ boxShadow: ['0 0 15px rgba(139,92,246,0.3)', '0 0 35px rgba(217,70,239,0.5)', '0 0 15px rgba(139,92,246,0.3)'] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Zap className="w-5 h-5 fill-white" />
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                            <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-black text-sm tracking-widest leading-none uppercase">Dropout<span className="text-accent-400">AI</span></h1>
                            <span className="text-[10px] text-fuchsia-500/60 font-black tracking-[0.2em] uppercase">V2 Neural Core</span>
                        </div>
                    </motion.div>

                    <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                        {tabs.map(tab => (
                            <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.92 }}
                                className={cn("px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2.5 relative overflow-hidden", 
                                    activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-200")}>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="navPill" className="absolute inset-0 rounded-xl shadow-inner" 
                                        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(217,70,239,0.2))', border: '1px solid rgba(255,255,255,0.1)' }} 
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                                )}
                                <tab.icon className={cn("w-4 h-4 relative z-10 transition-transform duration-500", activeTab === tab.id ? "text-accent-400 scale-110" : "scale-100")} />
                                <span className="relative z-10">{tab.label}</span>
                            </motion.button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4 text-slate-500 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] cursor-text hover:border-white/20 transition-all">
                        <Search className="w-4 h-4" />
                        <span className="text-[11px] font-bold text-slate-600 tracking-widest">DRIVE_SCAN...</span>
                        <kbd className="px-2 py-1 rounded-md text-[9px] font-black ml-10 bg-white/[0.05] border border-white/[0.08]">⌘K</kbd>
                    </div>
                    <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className="relative cursor-pointer p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/[0.08] transition-all">
                        <Bell className="w-4.5 h-4.5 text-slate-400" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-fuchsia-500 rounded-full shadow-[0_0_10px_#d946ef]" />
                    </motion.div>
                </div>
            </motion.header>

            <main className="max-w-6xl mx-auto px-6 pt-44 pb-32 relative z-10">
                {/* ── Super-Enhanced Hero ── */}
                <motion.div
                    style={{
                        y: heroY, scale: heroScale, opacity: heroOpacity, filter: useTransform(heroBlurV, b => `blur(${b}px)`),
                        rotateX: heroTiltX, rotateY: heroTiltY, x: heroShiftX, transformStyle: 'preserve-3d',
                    }}
                    className="mb-40 text-center max-w-5xl mx-auto relative px-4"
                >
                    {/* Status Chip */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="flex justify-center mb-10">
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black text-accent-400 tracking-[0.4em] uppercase backdrop-blur-2xl bg-accent-500/5 ring-1 ring-accent-400/30 overflow-hidden relative shadow-2xl">
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity }} />
                            <motion.span className="w-2 h-2 rounded-full bg-accent-400 shadow-[0_0_12px_#8b5cf6]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            CENTRE OF EXCELLENCE INFRASTRUCTURE
                        </div>
                    </motion.div>

                    {/* Massive 3D Title */}
                    <div className="space-y-4 mb-10 relative" style={{ transform: 'translateZ(60px)' }}>
                        {['REVOLUTIONIZING', 'STUDENT SUCCESS'].map((line, i) => (
                            <div key={i} className="overflow-hidden py-2 px-4">
                                <motion.h2
                                    initial={{ y: 150, rotateX: -60, opacity: 0, scale: 0.8 }}
                                    animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.4, delay: 0.4 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className={cn("text-6xl sm:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.85] uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]", i === 1 ? "gradient-text" : "text-white")}
                                    style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d' }}
                                >
                                    {line}
                                </motion.h2>
                            </div>
                        ))}
                        {/* Title Underline Pattern */}
                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2, delay: 1 }} className="h-2 w-48 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full mt-6 shadow-[0_0_30px_rgba(139,92,246,0.6)]" />
                    </div>

                    {/* Subtitle with High Visibility */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.8 }} className="max-w-2xl mx-auto mb-14" style={{ transform: 'translateZ(30px)' }}>
                        <p className="text-lg sm:text-xl text-slate-400 font-bold leading-relaxed bg-white/5 py-4 px-8 rounded-3xl border border-white/5 backdrop-blur-md">
                            <TypeWriter text="Industrial-grade dropout risk intelligence for higher education institutions." />
                        </p>
                    </motion.div>

                    {/* Enhanced CTAs */}
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 1 }} className="flex flex-wrap items-center justify-center gap-6" style={{ transform: 'translateZ(40px)' }}>
                        <motion.button whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.94 }} onClick={() => setActiveTab('predict')}
                            className="btn-premium px-12 py-5 text-sm font-black tracking-[0.3em] shimmer-accent gap-3 shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                            Launch Analysis <Activity className="w-5 h-5" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.08, y: -5 }} whileTap={{ scale: 0.94 }} onClick={() => setActiveTab('bulk')}
                            className="px-12 py-5 rounded-[1.25rem] text-sm font-black tracking-[0.3em] text-white hover:text-white uppercase flex items-center gap-3 backdrop-blur-xl transition-all shadow-2xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <Database className="w-5 h-5 text-fuchsia-500" /> Bulk Feed
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* ── Dynamic Content Layout ── */}
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab}
                        initial={{ opacity: 0, scale: 0.96, rotateX: 10, filter: 'blur(15px)' }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.96, rotateX: -10, filter: 'blur(15px)' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {activeTab === 'dashboard' && (
                            <div className="space-y-16 lg:space-y-24">
                                <CinematicReveal>
                                    <StatGrid stats={{
                                        total: history.length,
                                        critical: history.filter(h => h.risk_level === 'Critical').length,
                                        avgAttendance: (() => {
                                            const ve = history.filter(h => h.attendance != null && !isNaN(h.attendance));
                                            if (ve.length === 0) return '0%';
                                            const avg = ve.reduce((a: number, b: any) => a + Number(b.attendance), 0) / ve.length;
                                            return isNaN(avg) ? '0%' : `${Math.round(avg)}%`;
                                        })()
                                    }} />
                                </CinematicReveal>
                                
                                <CinematicReveal delay={0.2}>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-1000" />
                                        <div className="panel-glass rounded-[2.5rem] p-2 relative overflow-hidden ring-1 ring-white/10">
                                            <MainDashboard history={history} />
                                        </div>
                                    </div>
                                </CinematicReveal>
                            </div>
                        )}

                        {activeTab === 'predict' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                                <motion.div className="lg:col-span-12 xl:col-span-7" initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
                                    <PredictionHub onSubmit={handlePredict} loading={loading} />
                                </motion.div>
                                <motion.div className="lg:col-span-12 xl:col-span-5 space-y-10" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}>
                                    {currentResult ? (
                                        <><ResultGauge probability={currentResult.probability} riskLevel={currentResult.risk_level} /><AIExplanation result={currentResult} /></>
                                    ) : (
                                        <motion.div className="panel-glass rounded-[2.5rem] py-24 px-12 text-center flex flex-col items-center justify-center min-h-[560px] relative overflow-hidden" 
                                            style={{ border: '2px dashed rgba(255,255,255,0.06)' }}
                                            animate={{ borderColor: ['rgba(255,255,255,0.06)', 'rgba(139,92,246,0.3)', 'rgba(255,255,255,0.06)'] }} transition={{ duration: 5, repeat: Infinity }}>
                                            <div className="absolute inset-0 bg-grid-white opacity-20" />
                                            <motion.div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 text-fuchsia-500 shadow-2xl relative z-10"
                                                style={{ background: 'rgba(217,70,239,0.08)', border: '1px solid rgba(217,70,239,0.15)' }}
                                                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 8, repeat: Infinity }}>
                                                <Search className="w-10 h-10" />
                                            </motion.div>
                                            <h3 className="text-white font-black text-xl mb-4 relative z-10 uppercase tracking-widest">Neural Watch Active</h3>
                                            <p className="text-slate-500 text-sm max-w-[300px] leading-relaxed relative z-10 font-bold">Input subject data for real-time deep learning risk profiling.</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'bulk' && <div className="max-w-4xl mx-auto"><BulkUpload onResult={() => setActiveTab('dashboard')} /></div>}
                        {activeTab === 'analytics' && <CinematicReveal><div className="panel-glass rounded-[2.5rem] p-8 ring-1 ring-white/10 shadow-3xl"><MainDashboard history={history} /></div></CinematicReveal>}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Ultra-Modern Footer ── */}
            <CinematicReveal scale={false}>
                <footer className="max-w-7xl mx-auto px-8 pb-16 pt-24 border-t border-white/[0.06] relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
                        <div className="col-span-1 md:col-span-2 space-y-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 ring-1 ring-accent-400/20"><Zap className="w-5 h-5 fill-accent-400" /></div>
                               <h4 className="text-lg font-black text-white tracking-widest uppercase">DropoutAI</h4>
                            </div>
                            <p className="text-[13px] text-slate-500 font-bold max-w-sm leading-loose">
                                Engineering the future of student success through high-precision neural risk detection and behavioral pattern recognition. Built for the Centre of Excellence.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black tracking-[0.3em] text-fuchsia-500 uppercase">Architecture</h5>
                            <div className="flex flex-col gap-4 text-[12px] font-bold text-slate-500">
                                <a href="#" className="hover:text-white transition-colors">Neural Core</a>
                                <a href="#" className="hover:text-white transition-colors">API Endpoint</a>
                                <a href="#" className="hover:text-white transition-colors">Strategic Docs</a>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[10px] font-black tracking-[0.3em] text-violet-500 uppercase">Infrastructure</h5>
                            <div className="flex flex-col gap-4 text-[12px] font-bold text-slate-500">
                                <a href="#" className="hover:text-white transition-colors">COE Programs</a>
                                <a href="#" className="hover:text-white transition-colors">Support Hub</a>
                                <a href="#" className="hover:text-white transition-colors">Privacy Protocals</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/[0.03] gap-8">
                        <div className="text-[11px] font-black text-slate-700 tracking-[0.2em] uppercase">© 2026 DropoutAI Neural Systems &bull; All Rights Reserved</div>
                        <div className="flex items-center gap-4">
                            <div className="px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-black text-fuchsia-400/50 uppercase tracking-[0.2em]">Deployment: Active</div>
                            <div className="px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-black text-violet-400/50 uppercase tracking-[0.2em]">Node: Mainstream-COE</div>
                        </div>
                    </div>
                </footer>
            </CinematicReveal>
        </div>
    );
};

export default Home;
