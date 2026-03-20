import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
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

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const TypeWriter = ({ text, className }: { text: string; className?: string }) => {
    const [displayed, setDisplayed] = useState('');
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        if (idx < text.length) {
            const timeout = setTimeout(() => {
                setDisplayed(prev => prev + text[idx]);
                setIdx(prev => prev + 1);
            }, 30);
            return () => clearTimeout(timeout);
        }
    }, [idx, text]);
    return (
        <span className={className}>
            {displayed}
            {idx < text.length && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-accent-400">|</motion.span>
            )}
        </span>
    );
};

const Home = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentResult, setCurrentResult] = useState<any>(null);

    const { scrollY } = useScroll();
    const headerBlur = useTransform(scrollY, [0, 80], [0, 16]);
    const headerBg = useTransform(scrollY, [0, 80], ['rgba(6,10,19,0)', 'rgba(6,10,19,0.9)']);
    const headerBorder = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.04)']);
    const heroY = useTransform(scrollY, [0, 500], [0, 120]);
    const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);

    // Mouse parallax
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 40, damping: 15 });
    const sy = useSpring(my, { stiffness: 40, damping: 15 });
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            mx.set((e.clientX - window.innerWidth / 2) * 0.012);
            my.set((e.clientY - window.innerHeight / 2) * 0.012);
        };
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, [mx, my]);

    useEffect(() => {
        const saved = sessionStorage.getItem('risk_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const updateHistory = (newResult: any) => {
        const updated = [newResult, ...history].slice(0, 50);
        setHistory(updated);
        sessionStorage.setItem('risk_history', JSON.stringify(updated));
    };

    const handlePredict = async (data: any) => {
        setLoading(true);
        try {
            const result = await predictDropoutRisk(data);
            setCurrentResult(result);
            updateHistory({
                ...result, attendance: data.attendance,
                name: data.name || 'Anonymous Student',
                timestamp: new Date().toLocaleTimeString()
            });
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
        <div className="relative min-h-screen bg-[#060a13] text-slate-400 overflow-x-hidden">
            <GradientDots className="opacity-80" />

            {/* ── Header ── */}
            <motion.header
                style={{
                    backdropFilter: useTransform(headerBlur, b => `blur(${b}px) saturate(1.3)`),
                    backgroundColor: headerBg,
                    borderBottom: useTransform(headerBorder, c => `1px solid ${c}`),
                }}
                className="fixed top-0 left-0 right-0 h-16 px-6 lg:px-10 flex items-center justify-between z-50"
            >
                <div className="flex items-center gap-10">
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setActiveTab('dashboard')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
                            animate={{ boxShadow: ['0 0 15px rgba(6,182,212,0.2)', '0 0 30px rgba(6,182,212,0.35)', '0 0 15px rgba(6,182,212,0.2)'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-bold text-sm tracking-wide leading-none">
                                Dropout<span className="text-accent-400">AI</span>
                            </h1>
                            <span className="text-[9px] text-slate-600 font-medium tracking-wider">COE Program</span>
                        </div>
                    </motion.div>

                    <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center gap-2 relative",
                                    activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="pill"
                                        className="absolute inset-0 rounded-lg"
                                        style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.15)' }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <tab.icon className={cn("w-3.5 h-3.5 relative z-10", activeTab === tab.id && "text-accent-400")} />
                                <span className="relative z-10">{tab.label}</span>
                            </motion.button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-3 text-slate-500 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-accent-500/30 transition-all cursor-text">
                        <Search className="w-3.5 h-3.5" />
                        <span className="text-[11px] text-slate-600">Search...</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] border border-white/10 font-mono ml-6">⌘K</kbd>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <Bell className="w-4.5 h-4.5 text-slate-500" />
                        <motion.span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-400 rounded-full" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white hover:border-accent-500/30 transition-all cursor-pointer">
                        <User className="w-4 h-4" />
                    </motion.div>
                </div>
            </motion.header>

            <main className="max-w-6xl mx-auto px-6 pt-36 pb-24 relative z-10">
                {/* ── Hero ── */}
                <motion.div style={{ y: heroY, opacity: heroOpacity, x: sx }} className="mb-28 text-center max-w-4xl mx-auto relative">
                    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">

                        <motion.div variants={fadeUp} className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold text-accent-400 tracking-wider backdrop-blur-md"
                                 style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                                <motion.span className="w-1.5 h-1.5 rounded-full bg-accent-400" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                                CENTRE OF EXCELLENCE — LIVE SYSTEM
                            </div>
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                                <motion.span className="block text-white" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                                    Student Dropout
                                </motion.span>
                                <motion.span className="block gradient-text" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                                    Risk Prediction
                                </motion.span>
                            </h2>
                        </motion.div>

                        <motion.div variants={fadeUp} className="max-w-xl mx-auto">
                            <p className="text-base sm:text-lg text-slate-400/80 leading-relaxed font-normal">
                                <TypeWriter text="Predict at-risk students using AI-powered analytics. Identify, intervene, and improve retention outcomes." />
                            </p>
                        </motion.div>

                        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setActiveTab('predict')}
                                className="btn-premium px-8 py-3.5 text-sm font-semibold shimmer-accent gap-2"
                            >
                                Start Prediction
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setActiveTab('bulk')}
                                className="px-8 py-3.5 rounded-2xl text-sm font-semibold border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-all gap-2 flex items-center"
                            >
                                <Database className="w-4 h-4" />
                                Bulk Upload
                            </motion.button>
                        </motion.div>

                        {/* Floating stats pills */}
                        <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 pt-6">
                            {[
                                { label: 'Accuracy', value: '98.2%' },
                                { label: 'Risk Levels', value: '4 Tiers' },
                                { label: 'Response', value: '<50ms' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.04]"
                                >
                                    <span className="text-[11px] font-bold text-white">{item.value}</span>
                                    <span className="text-[10px] text-slate-600">{item.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* ── Content ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {activeTab === 'dashboard' && (
                            <div className="space-y-10">
                                <StatGrid stats={{
                                    total: history.length,
                                    critical: history.filter(h => h.risk_level === 'Critical').length,
                                    avgAttendance: history.length > 0
                                        ? `${Math.round(history.reduce((a: number, b: any) => a + b.attendance, 0) / history.length)}%`
                                        : '0%'
                                }} />
                                <div className="panel-glass rounded-3xl p-1.5 relative">
                                    <MainDashboard history={history} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'predict' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                <motion.div className="lg:col-span-12 xl:col-span-7" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                                    <PredictionHub onSubmit={handlePredict} loading={loading} />
                                </motion.div>
                                <motion.div className="lg:col-span-12 xl:col-span-5 space-y-8" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                                    {currentResult ? (
                                        <>
                                            <ResultGauge probability={currentResult.probability} riskLevel={currentResult.risk_level} />
                                            <AIExplanation result={currentResult} />
                                        </>
                                    ) : (
                                        <motion.div
                                            className="panel-glass rounded-3xl p-14 text-center flex flex-col items-center justify-center min-h-[480px]"
                                            style={{ border: '1px dashed rgba(255,255,255,0.06)' }}
                                            animate={{ borderColor: ['rgba(255,255,255,0.06)', 'rgba(6,182,212,0.15)', 'rgba(255,255,255,0.06)'] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <motion.div
                                                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-slate-600"
                                                style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)' }}
                                                animate={{ rotate: [0, 3, -3, 0] }}
                                                transition={{ duration: 6, repeat: Infinity }}
                                            >
                                                <Search className="w-8 h-8" />
                                            </motion.div>
                                            <h3 className="text-white font-bold text-base mb-2">Ready for Analysis</h3>
                                            <p className="text-slate-500 text-sm max-w-[260px] leading-relaxed">Complete the prediction form to generate a real-time risk assessment.</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'bulk' && (
                            <div className="max-w-4xl mx-auto">
                                <BulkUpload onResult={() => setActiveTab('dashboard')} />
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="panel-glass rounded-3xl p-6">
                                <MainDashboard history={history} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto px-6 py-12 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-6 relative z-10"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-accent-400" style={{ background: 'rgba(6,182,212,0.1)' }}>
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-white tracking-wide">DropoutAI &bull; COE Program</div>
                        <div className="text-[10px] text-slate-600">Student Success Intelligence</div>
                    </div>
                </div>

                <div className="flex gap-8 text-[10px] font-medium text-slate-600">
                    <a href="#" className="hover:text-accent-400 transition-colors">Documentation</a>
                    <a href="#" className="hover:text-accent-400 transition-colors">API Status</a>
                    <a href="#" className="hover:text-accent-400 transition-colors">Team</a>
                </div>

                <div className="text-[10px] text-slate-700 text-center md:text-right">
                    © 2026 DropoutAI Systems<br/>
                    <span className="text-accent-500/30">Centre of Excellence</span>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;
