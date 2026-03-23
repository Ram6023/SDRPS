import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, GraduationCap, Users } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import { cn } from '@/lib/utils';

const AboutPage: React.FC = () => {
    const coreValues = [
        { label: 'INSTITUTIONAL_PURPOSE', val: '01', icon: Target, title: 'Mitigation Mastery', desc: 'Advancing academic conservation through neural risk diagnostics.' },
        { label: 'NEURAL_INTEGRITY', val: '02', icon: ShieldCheck, title: 'Precision Scanning', desc: 'Leveraging 99.4% precision metrics in student attrition projection.' },
        { label: 'STUDENT_CENTRIC', val: '03', icon: GraduationCap, title: 'Success Clusters', desc: 'Predicting individual trajectories to foster institutional success.' },
        { label: 'GLOBAL_SCALE', val: '04', icon: Users, title: 'Massive Audit', desc: 'Handling institutional data flows at massive scale with security.' }
    ];

    return (
        <main className="min-h-screen bg-academy-navy relative pt-40 px-16 pb-32">
             <div className="absolute inset-x-0 top-0 h-[600px] pointer-events-none opacity-20">
                <img src="/src/assets/campus_bg.png" className="w-full h-full object-cover grayscale opacity-40 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-academy-navy/50 to-academy-navy" />
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
                    <div className="inline-block px-8 py-3 rounded-full text-[10px] font-mono font-black text-sunset-amber tracking-[0.4em] uppercase border border-sunset-amber/30 bg-sunset-amber/5 mb-10">
                        ABOUT_INSTITUTIONAL_MODULE_V5
                    </div>
                    <h2 className="text-7xl font-black text-white tracking-tighter uppercase mb-10 leading-none">
                        STUDENT DROPOUT <br />
                        <span className="gradient-text">PROJECT GENESIS</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-xl text-slate-400 font-bold uppercase tracking-tight italic opacity-60 leading-relaxed">
                        Dedicated to the science of retention. Our neural infrastructure proactively audits student metadata to prevent attrition before it occurs.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {coreValues.map((val, idx) => (
                        <motion.div 
                            key={val.val}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <TiltCard glowColor="245, 158, 11">
                                <div className="panel-glass p-12 h-full flex flex-col items-center text-center">
                                     <div className="text-[10px] font-mono font-black text-slate-700 tracking-[0.3em] mb-10">{val.label}</div>
                                     <div className="w-20 h-20 bg-sunset-amber/10 rounded-3xl flex items-center justify-center text-sunset-amber mb-10 ring-1 ring-sunset-amber/30">
                                         <val.icon className="w-10 h-10" />
                                     </div>
                                     <h4 className="text-2xl font-black text-white uppercase italic mb-6">{val.title}</h4>
                                     <p className="text-sm text-slate-400 font-bold uppercase tracking-tight italic opacity-40 leading-relaxed">{" >> "} {val.desc}</p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>

                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 p-20 panel-glass rounded-[4rem] flex flex-col lg:flex-row items-center gap-20 border-white/[0.04]"
                >
                    <div className="flex-1 space-y-10">
                         <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none italic">MISSION_PROTOCOL</h3>
                         <p className="text-lg text-slate-500 font-medium leading-relaxed">Our system uses advanced Bayesian weighting and neural pattern recognition to identify high-risk student profiles from standard institutional metrics (Attendance, GPA, Fee status). By bridging the gap between raw data and predictive insights, we empower educators to take action 6-12 months before a dropout event occurs.</p>
                         <div className="flex gap-10">
                             <div className="px-6 py-2 rounded-lg bg-sunset-amber/10 text-[10px] font-mono font-black text-sunset-amber border border-sunset-amber/30 uppercase tracking-widest">REAL_TIME_SCANNING</div>
                             <div className="px-6 py-2 rounded-lg bg-sunset-rose/10 text-[10px] font-mono font-black text-sunset-rose border border-sunset-rose/30 uppercase tracking-widest">SCALABLE_AUDIT</div>
                         </div>
                    </div>
                    <div className="w-full lg:w-[500px] aspect-square panel-glass rounded-[3rem] p-10 flex items-center justify-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-grid-cyber opacity-20" />
                         <GraduationCap className="w-40 h-40 text-sunset-amber opacity-20 group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-0 bg-scanline animate-scan opacity-30" />
                    </div>
                </motion.section>
            </div>
        </main>
    );
};

export default AboutPage;
