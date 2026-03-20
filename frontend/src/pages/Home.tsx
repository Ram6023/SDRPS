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
import { Bell, Search, User, LayoutDashboard, Database, BarChart3, Sparkles, ArrowRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

// ── Cinematic Scroll Reveal ──
const CinematicReveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60, filter: 'blur(12px)', scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 } : {}}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
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
    const headerBlur = useTransform(scrollY, [0, 60], [0, 16]);
    const headerBorder = useTransform(scrollY, [0, 60], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.04)']);

    // Hero 3D parallax
    const heroY = useTransform(scrollY, [0, 600], [0, 200]);
    const heroScale = useTransform(scrollY, [0, 600], [1, 0.92]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    // Mouse-driven 3D tilt for hero
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const heroTiltX = useSpring(useTransform(my, v => v * 0.008), { stiffness: 50, damping: 20 });
    const heroTiltY = useSpring(useTransform(mx, v => v * -0.008), { stiffness: 50, damping: 20 });
    const heroShiftX = useSpring(useTransform(mx, v => v * 0.015), { stiffness: 30, damping: 15 });

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
        <div className="relative min-h-screen bg-[#040409] text-slate-400 overflow-x-hidden" style={{ perspective: '1200px' }}>
            <GradientDots className="opacity-80" />

            {/* ── Sticky Glass Header ── */}
            <motion.header
                style={{
                    backdropFilter: useTransform(headerBlur, b => `blur(${b}px) saturate(1.4)`),
                    backgroundColor: headerBg,
                    borderBottom: useTransform(headerBorder, c => `1px solid ${c}`),
                }}
                className="fixed top-0 left-0 right-0 h-16 px-6 lg:px-10 flex items-center justify-between z-50"
            >
                <div className="flex items-center gap-10">
                    <motion.div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <motion.div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                            style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                            animate={{ boxShadow: ['0 0 15px rgba(139,92,246,0.15)', '0 0 30px rgba(139,92,246,0.3)', '0 0 15px rgba(139,92,246,0.15)'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-bold text-sm tracking-wide leading-none">Dropout<span className="text-accent-400">AI</span></h1>
                            <span className="text-[9px] text-slate-600 font-medium tracking-wider">COE Program</span>
                        </div>
                    </motion.div>

                    <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        {tabs.map(tab => (
                            <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.95 }}
                                className={cn("px-4 py-2 rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center gap-2 relative", activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300")}>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="pill" className="absolute inset-0 rounded-lg" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                )}
                                <tab.icon className={cn("w-3.5 h-3.5 relative z-10", activeTab === tab.id && "text-accent-400")} />
                                <span className="relative z-10">{tab.label}</span>
                            </motion.button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-3 text-slate-500 px-4 py-2 rounded-xl cursor-text" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <Search className="w-3.5 h-3.5" />
                        <span className="text-[11px] text-slate-600">Search...</span>
                        <kbd className="px-1.5 py-0.5 rounded text-[8px] font-mono ml-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>⌘K</kbd>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <Bell className="w-4 h-4 text-slate-500" />
                        <motion.span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-500 rounded-full" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <User className="w-4 h-4" />
                    </motion.div>
                </div>
            </motion.header>

            <main className="max-w-6xl mx-auto px-6 pt-36 pb-24 relative z-10">
                {/* ── 3D Cinematic Hero ── */}
                <motion.div
                    style={{
                        y: heroY, scale: heroScale, opacity: heroOpacity,
                        rotateX: heroTiltX,
                        rotateY: heroTiltY,
                        x: heroShiftX,
                        transformStyle: 'preserve-3d',
                    }}
                    className="mb-32 text-center max-w-4xl mx-auto relative"
                >
                    {/* Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold text-accent-400 tracking-wider backdrop-blur-md"
                             style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                            <motion.span className="w-1.5 h-1.5 rounded-full bg-accent-400" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                            CENTRE OF EXCELLENCE — LIVE
                        </div>
                    </motion.div>

                    {/* 3D Title with staggered word reveal */}
                    <div className="space-y-2 mb-8" style={{ transform: 'translateZ(40px)' }}>
                        {['Student Dropout', 'Risk Prediction'].map((line, i) => (
                            <div key={i} className="overflow-hidden">
                                <motion.h2
                                    initial={{ y: 120, rotateX: -40, opacity: 0 }}
                                    animate={{ y: 0, rotateX: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                                    className={cn("text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95]", i === 0 ? "text-white" : "gradient-text")}
                                    style={{ transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
                                >
                                    {line}
                                </motion.h2>
                            </div>
                        ))}
                    </div>

                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="max-w-xl mx-auto mb-10"
                        style={{ transform: 'translateZ(20px)' }}
                    >
                        <p className="text-base sm:text-lg text-slate-400/80 leading-relaxed">
                            <TypeWriter text="AI-powered analytics to identify at-risk students before dropout occurs. Built for the Centre of Excellence." />
                        </p>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                        style={{ transform: 'translateZ(30px)' }}
                    >
                        <motion.button whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveTab('predict')}
                            className="btn-premium px-8 py-3.5 text-sm font-semibold shimmer-accent gap-2">
                            Start Prediction <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveTab('bulk')}
                            className="px-8 py-3.5 rounded-2xl text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-all"
                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Database className="w-4 h-4" /> Bulk Upload
                        </motion.button>
                    </motion.div>

                    {/* Floating stats pills with 3D depth */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="flex items-center justify-center gap-5 mt-12"
                        style={{ transform: 'translateZ(10px)' }}
                    >
                        {[{ v: '98.2%', l: 'Accuracy' }, { v: '4 Tiers', l: 'Risk Levels' }, { v: '<50ms', l: 'Response' }].map((item, i) => (
                            <motion.div key={i}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <span className="text-[11px] font-bold text-white">{item.v}</span>
                                <span className="text-[10px] text-slate-600">{item.l}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Decorative floating lines */}
                    <motion.div className="absolute -left-16 top-24 w-[2px] rounded-full bg-gradient-to-b from-accent-500/30 to-transparent pointer-events-none"
                        animate={{ height: [60, 100, 60], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.div className="absolute -right-12 top-40 w-[1.5px] rounded-full bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none"
                        animate={{ height: [50, 80, 50], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
                </motion.div>

                {/* ── Content with Cinematic Reveals ── */}
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab}
                        initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -30, filter: 'blur(12px)' }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {activeTab === 'dashboard' && (
                            <div className="space-y-12">
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
                                <CinematicReveal delay={0.15}>
                                    <div className="panel-glass rounded-3xl p-1.5 relative">
                                        <MainDashboard history={history} />
                                    </div>
                                </CinematicReveal>
                            </div>
                        )}

                        {activeTab === 'predict' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                <motion.div className="lg:col-span-12 xl:col-span-7" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                                    <PredictionHub onSubmit={handlePredict} loading={loading} />
                                </motion.div>
                                <motion.div className="lg:col-span-12 xl:col-span-5 space-y-8" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
                                    {currentResult ? (
                                        <><ResultGauge probability={currentResult.probability} riskLevel={currentResult.risk_level} /><AIExplanation result={currentResult} /></>
                                    ) : (
                                        <motion.div className="panel-glass rounded-3xl p-14 text-center flex flex-col items-center justify-center min-h-[480px]" style={{ border: '1px dashed rgba(255,255,255,0.06)' }}
                                            animate={{ borderColor: ['rgba(255,255,255,0.06)', 'rgba(139,92,246,0.12)', 'rgba(255,255,255,0.06)'] }} transition={{ duration: 4, repeat: Infinity }}>
                                            <motion.div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-slate-600"
                                                style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}
                                                animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                                                <Search className="w-8 h-8" />
                                            </motion.div>
                                            <h3 className="text-white font-bold text-base mb-2">Ready for Analysis</h3>
                                            <p className="text-slate-500 text-sm max-w-[260px] leading-relaxed">Complete the form to generate a real-time risk assessment.</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'bulk' && <div className="max-w-4xl mx-auto"><BulkUpload onResult={() => setActiveTab('dashboard')} /></div>}
                        {activeTab === 'analytics' && <CinematicReveal><div className="panel-glass rounded-3xl p-6"><MainDashboard history={history} /></div></CinematicReveal>}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <CinematicReveal>
                <footer className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-accent-400" style={{ background: 'rgba(139,92,246,0.1)' }}><Sparkles className="w-4 h-4" /></div>
                        <div>
                            <div className="text-[11px] font-bold text-white tracking-wide">DropoutAI &bull; COE Program</div>
                            <div className="text-[10px] text-slate-600">Student Success Intelligence</div>
                        </div>
                    </div>
                    <div className="flex gap-8 text-[10px] font-medium text-slate-600">
                        <a href="#" className="hover:text-accent-400 transition-colors">Docs</a>
                        <a href="#" className="hover:text-accent-400 transition-colors">API</a>
                        <a href="#" className="hover:text-accent-400 transition-colors">Team</a>
                    </div>
                    <div className="text-[10px] text-slate-700 text-center md:text-right">© 2026 DropoutAI<br/><span className="text-accent-500/30">Centre of Excellence</span></div>
                </footer>
            </CinematicReveal>
        </div>
    );
};

export default Home;
