import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, LayoutDashboard, Database, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from '@/components/ui/TiltCard';
import { cn } from '@/lib/utils';
import logo from '../assets/logo.png';
import campusBg from '../assets/campus_bg.png';

import Ticker from '@/components/Ticker';

const FeatureBlock = ({ title, desc, icon: Icon, color, reverse = false, pattern = 'bg-grid-cyber', path }: any) => (
    <section className="w-full py-20 relative overflow-hidden flex items-center px-6 lg:px-12 group">
        <div className={cn("absolute inset-0 opacity-10", pattern)} />
        <div className={cn("absolute inset-0 bg-academy-navy/80 backdrop-blur-3xl")} />
        
        <div className={cn("max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10", reverse ? 'lg:flex-row-reverse' : '')}>
            <motion.div initial={{ opacity: 0, x: reverse ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className={cn("inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 border border-white/5 text-xs", color)}>
                     <div className="p-2 bg-white/10 rounded-lg"><Icon className="w-4 h-4" /></div>
                     <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">DROPOUT_CORE: {title.replace(/_/g, ' ')}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 leading-tight uppercase">{title.replace(/_/g, ' ')}</h3>
                <p className="text-sm text-slate-400 font-medium max-w-md leading-relaxed mb-8">{desc}</p>
                <Link to={path}>
                     <button className="btn-premium flex items-center gap-3 px-6 py-3 rounded-xl text-xs shadow-lg">EXPLORE <ChevronRight className="w-4 h-4" /></button>
                </Link>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                <TiltCard glowColor={color === 'text-sunset-amber' ? '245, 158, 11' : '190, 18, 60'}>
                    <div className="panel-glass rounded-2xl aspect-video flex items-center justify-center p-10 border-white/[0.04]">
                         <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl w-full h-full flex flex-col items-center justify-center gap-4">
                              <Icon className={cn("w-16 h-16 opacity-20", color)} />
                              <div className="flex flex-col items-center gap-2">
                                  <div className="w-24 h-0.5 bg-white/5 rounded-full relative overflow-hidden"><motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity }} className={cn("h-full w-1/2", color.replace('text', 'bg'))} /></div>
                                  <span className="text-[8px] font-mono text-slate-700 tracking-widest font-bold">{title}_ACTIVE</span>
                              </div>
                         </div>
                    </div>
                </TiltCard>
            </motion.div>
        </div>
    </section>
);

const LandingPage: React.FC = () => {
    return (
        <main className="relative bg-academy-navy overflow-hidden">
            {/* Hero Section */}
            <section className="min-h-[85vh] relative flex flex-col items-center justify-center px-6 lg:px-12 pt-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={campusBg} className="w-full h-full object-cover grayscale opacity-30 scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-b from-academy-navy via-academy-navy/30 to-academy-navy" />
                </div>
                
                {/* Logo watermark */}
                <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
                    <img src={logo} alt="" className="w-[500px] h-[500px] object-contain opacity-[0.06]" />
                </div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center text-center relative z-20">
                    
                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-6 uppercase italic">
                        STUDENT DROPOUT <br />
                        <span className="gradient-text">RISK PREDICTION</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-400 font-medium max-w-2xl leading-relaxed mb-10">
                        Predict. Analyze. Prevent. Real-time student attrition analytics & institutional success pathway diagnostics.
                    </p>

                    <div className="flex gap-4">
                        <Link to="/predict">
                            <motion.button whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} className="btn-premium px-8 py-4 rounded-xl text-xs tracking-widest flex items-center gap-3 shadow-lg">
                                INITIALIZE_SCAN <ChevronRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                        <Link to="/dashboard">
                            <motion.button whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-all text-white backdrop-blur-3xl">
                                VIEW_DASHBOARD
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
                
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-30">
                     <div className="w-0.5 h-8 rounded-full bg-gradient-to-b from-sunset-amber to-transparent" />
                     <span className="text-[8px] font-mono tracking-widest font-bold text-slate-600 uppercase">SCROLL</span>
                </motion.div>
            </section>

            {/* Live Data Ticker */}
            <Ticker />

            {/* Feature Blocks */}
            <FeatureBlock title="RISK_DASHBOARD" desc="Real-time data visualization of institutional attrition vectors and student success metrics." icon={LayoutDashboard} color="text-sunset-amber" pattern="bg-grid-cyber" path="/dashboard" />
            <FeatureBlock title="DROPOUT_PREDICTION" desc="Neural predictive scanning of individual student trajectories with high-confidence results." icon={BrainCircuit} color="text-sunset-rose" reverse={true} pattern="bg-neural-dots" path="/predict" />
            <FeatureBlock title="BATCH_UPLOAD" desc="Automated ingestion protocols for institutional metadata and massive-scale dropout audits." icon={Database} color="text-sunset-amber" reverse={true} pattern="bg-neural-dots" path="/upload" />
        </main>
    );
};

export default LandingPage;
