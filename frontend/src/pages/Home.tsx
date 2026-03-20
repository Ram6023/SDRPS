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
import { Bell, Search, User, ShieldCheck, LayoutDashboard, Database, BarChart3, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Cinematic Stagger Variants ──
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// ── Typing Effect Component ──
const TypeWriter = ({ text, className }: { text: string; className?: string }) => {
    const [displayed, setDisplayed] = useState('');
    const [idx, setIdx] = useState(0);
    
    useEffect(() => {
        if (idx < text.length) {
            const timeout = setTimeout(() => {
                setDisplayed(prev => prev + text[idx]);
                setIdx(prev => prev + 1);
            }, 40);
            return () => clearTimeout(timeout);
        }
    }, [idx, text]);
    
    return (
        <span className={className}>
            {displayed}
            <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ duration: 0.6, repeat: Infinity }}
                className="text-brand-400"
            >|</motion.span>
        </span>
    );
};

// ── Mouse Parallax Hook ──
const useMouseParallax = (sensitivity = 0.02) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 50, damping: 20 });
    const springY = useSpring(y, { stiffness: 50, damping: 20 });
    
    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            x.set((e.clientX - cx) * sensitivity);
            y.set((e.clientY - cy) * sensitivity);
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, [sensitivity, x, y]);
    
    return { x: springX, y: springY };
};

const Home = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentResult, setCurrentResult] = useState<any>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);
    const headerOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
    const headerBorder = useTransform(scrollY, [0, 100], [0, 1]);
    
    // Parallax for hero
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    
    const mouse = useMouseParallax(0.015);

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
                ...result,
                attendance: data.attendance,
                name: data.name || 'Anonymous Student',
                timestamp: new Date().toLocaleTimeString()
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'predict', label: 'Predict', icon: ShieldCheck },
        { id: 'bulk', label: 'Bulk Upload', icon: Database },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-400 selection:bg-brand-500/30 selection:text-brand-200 overflow-x-hidden">
            {/* ── Live Animated Background ── */}
            <GradientDots className="opacity-70" />

            {/* ── Progressive Blur Header ── */}
            <motion.header 
                style={{ 
                    backdropFilter: useTransform(headerBlur, b => `blur(${b}px)`),
                    backgroundColor: useTransform(headerOpacity, o => `rgba(2, 6, 23, ${o})`),
                    borderBottom: useTransform(headerBorder, b => `${b}px solid rgba(255, 255, 255, 0.05)`)
                }}
                className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50"
            >
                <div className="flex items-center gap-12">
                    <motion.div 
                        className="flex items-center gap-3 group cursor-pointer" 
                        onClick={() => setActiveTab('dashboard')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <motion.div 
                            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20"
                            animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.2)', '0 0 40px rgba(139,92,246,0.4)', '0 0 20px rgba(139,92,246,0.2)'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ShieldCheck className="w-6 h-6 stroke-[2.5px]" />
                        </motion.div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-black text-sm tracking-widest uppercase leading-none">DROPOUT<span className="text-brand-400">AI</span></h1>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">COE Program</span>
                        </div>
                    </motion.div>

                    <nav className="hidden lg:flex items-center gap-1">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2.5 relative",
                                    activeTab === tab.id 
                                        ? "text-white" 
                                        : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {activeTab === tab.id && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <tab.icon className={cn("w-4 h-4 relative z-10", activeTab === tab.id ? "text-brand-400" : "text-slate-600")} />
                                <span className="relative z-10">{tab.label}</span>
                            </motion.button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-4 text-slate-500 px-5 py-2.5 rounded-2xl bg-white/[0.03] group border border-white/[0.05] hover:border-brand-500/50 transition-all cursor-text overflow-hidden relative">
                        <Search className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Search System...</span>
                        <div className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] border border-white/10 ml-4 font-black">⌘K</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <motion.div 
                            className="relative cursor-pointer group p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                             <Bell className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                             <motion.span 
                                className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-slate-950"
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                             />
                        </motion.div>
                        <motion.div 
                            className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:border-brand-500 transition-all cursor-pointer group overflow-hidden"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <User className="w-5 h-5" />
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto px-6 pt-40 pb-24 relative z-10">
                {/* ── Cinematic Hero Section ── */}
                <motion.header 
                    ref={heroRef}
                    style={{ y: heroY, scale: heroScale, opacity: heroOpacity, x: mouse.x, }}
                    className="mb-24 text-center max-w-5xl mx-auto relative"
                >
                    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
                        {/* Status badge */}
                        <motion.div variants={fadeUp} className="flex justify-center">
                            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-[9px] font-black text-brand-400 uppercase tracking-[0.3em] backdrop-blur-md">
                                <motion.span 
                                    className="w-2 h-2 rounded-full bg-brand-400"
                                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <Zap className="w-3 h-3" />
                                COE Neural System Active
                            </div>
                        </motion.div>
                        
                        {/* Main headline with typing effect */}
                        <motion.div variants={fadeUp}>
                            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] overflow-hidden">
                                <motion.span 
                                    className="block"
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    PREDICTING
                                </motion.span>
                                <motion.span 
                                    className="block gradient-text"
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    STUDENT
                                </motion.span>
                                <motion.span 
                                    className="block gradient-text"
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    SUCCESS
                                </motion.span>
                            </h2>
                        </motion.div>
                        
                        {/* Subtitle with typing effect */}
                        <motion.div variants={fadeUp} className="max-w-2xl mx-auto">
                            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                                <TypeWriter text="AI-powered risk analytics identifying at-risk students before dropout occurs. Built for the Centre of Excellence program." />
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('predict')}
                                className="btn-premium px-10 py-4 text-xs tracking-[0.2em] font-black uppercase shimmer-indigo"
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Start Prediction
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab('bulk')}
                                className="px-10 py-4 rounded-2xl text-xs tracking-[0.2em] font-black uppercase border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all"
                            >
                                <Database className="w-4 h-4 mr-2 inline" />
                                Bulk Upload
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* ── Floating Decorative Elements ── */}
                    <motion.div 
                        className="absolute -left-20 top-20 w-2 h-20 rounded-full bg-gradient-to-b from-brand-500/40 to-transparent"
                        animate={{ height: [80, 120, 80], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                        className="absolute -right-16 top-40 w-1.5 h-16 rounded-full bg-gradient-to-b from-brand-400/30 to-transparent"
                        animate={{ height: [64, 100, 64], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </motion.header>

                {/* ── Content Switcher ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {activeTab === 'dashboard' && (
                            <motion.div className="space-y-16" variants={stagger} initial="hidden" animate="show">
                                <motion.div variants={scaleIn}>
                                    <StatGrid stats={{ 
                                        total: history.length, 
                                        critical: history.filter(h => h.risk_level === 'Critical').length, 
                                        avgAttendance: history.length > 0 
                                            ? `${Math.round(history.reduce((a: number, b: any) => a + b.attendance, 0) / history.length)}%` 
                                            : '0%' 
                                    }} />
                                </motion.div>
                                <motion.div variants={scaleIn} className="panel-glass rounded-[3.5rem] p-2 shadow-2xl relative">
                                    <div className="absolute inset-0 bg-brand-500/5 blur-[120px] rounded-full -z-10" />
                                    <MainDashboard history={history} />
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === 'predict' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                                <motion.div 
                                    className="lg:col-span-12 xl:col-span-7"
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <PredictionHub onSubmit={handlePredict} loading={loading} />
                                </motion.div>
                                <motion.div 
                                    className="lg:col-span-12 xl:col-span-5 space-y-10 lg:mt-4"
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {currentResult ? (
                                        <>
                                            <ResultGauge probability={currentResult.probability} riskLevel={currentResult.risk_level} />
                                            <AIExplanation result={currentResult} />
                                        </>
                                    ) : (
                                        <motion.div 
                                            className="panel-glass rounded-[3rem] p-16 text-center flex flex-col items-center justify-center min-h-[500px] border-dashed border-2 border-white/[0.05]"
                                            animate={{ borderColor: ['rgba(255,255,255,0.05)', 'rgba(139,92,246,0.15)', 'rgba(255,255,255,0.05)'] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <motion.div 
                                                className="w-24 h-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center mb-8 text-slate-600"
                                                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                <Search className="w-10 h-10" />
                                            </motion.div>
                                            <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-4">Awaiting Data</h3>
                                            <p className="text-slate-500 text-xs max-w-[280px] leading-relaxed font-medium">Complete the prediction form to generate a real-time risk analysis report.</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        )}

                        {activeTab === 'bulk' && (
                            <motion.div 
                                className="max-w-4xl mx-auto"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <BulkUpload onResult={() => setActiveTab('dashboard')} />
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && (
                            <motion.div 
                                className="space-y-12"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="panel-glass rounded-[3.5rem] p-8">
                                     <MainDashboard history={history} />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Cinematic Footer ── */}
            <motion.footer 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-10 py-16 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8 relative z-10"
            >
                <div className="flex items-center gap-4">
                    <motion.div 
                        className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-brand-400"
                        animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 20px rgba(139,92,246,0.15)', '0 0 0px rgba(139,92,246,0)'] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </motion.div>
                    <div className="space-y-0.5">
                        <div className="text-[10px] font-black text-white uppercase tracking-[0.2em]">DROPOUT AI &bull; COE PROGRAM</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Student Success Intelligence</div>
                    </div>
                </div>
                
                <div className="flex gap-10 uppercase tracking-[0.3em] text-[9px] font-black text-slate-500">
                    <a href="#" className="hover:text-brand-400 transition-colors duration-500">Docs</a>
                    <a href="#" className="hover:text-brand-400 transition-colors duration-500">API</a>
                    <a href="#" className="hover:text-brand-400 transition-colors duration-500">Team</a>
                </div>
                
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none text-center md:text-right">
                    © 2026 DropoutAI Systems<br/>
                    <span className="text-brand-500/30">Centre of Excellence</span>
                </div>
            </motion.footer>
        </div>
    );
};

export default Home;
