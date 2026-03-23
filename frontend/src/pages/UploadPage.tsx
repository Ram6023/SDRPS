import React from 'react';
import { motion } from 'framer-motion';
import { Database, GraduationCap, ShieldCheck } from 'lucide-react';
import BulkUpload from '@/components/BulkUpload';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

const UploadPage: React.FC = () => {
    return (
        <main className="min-h-screen pt-20 px-6 lg:px-12 pb-16 bg-academy-navy relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sunset-amber/5 blur-[120px] rounded-full pointer-events-none opacity-30" />
            <div className="absolute inset-0 bg-grid-cyber opacity-[0.03] pointer-events-none" />
            
            <div className="max-w-[1200px] mx-auto w-full relative z-10">
                <div className="flex flex-col items-center text-center mb-12">
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                        <div className="p-3 bg-sunset-amber/10 rounded-xl ring-1 ring-sunset-amber/40 mb-4 shadow-xl"><Database className="w-7 h-7 text-sunset-amber" /></div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">DATA_INGESTION</h2>
                        <span className="text-[9px] font-mono font-black text-slate-700 tracking-[0.3em] uppercase mb-8 leading-relaxed font-mono italic">CSV_BATCH_PROCESSING_V5</span>
                     </motion.div>
                </div>

                <div className="mb-16">
                     <BulkUpload />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {[
                        { label: 'DATA_INTEGRITY', desc: 'Secure encryption of student identity vectors.', icon: ShieldCheck, color: 'text-emerald-500' },
                        { label: 'MASSIVE_SCALE', desc: 'Batch processing of up to 50k prognostications per cycle.', icon: Database, color: 'text-sunset-amber' },
                        { label: 'AUDIT_CERTIFIED', desc: 'Verified 99.9% ingestion success rate.', icon: GraduationCap, color: 'text-sunset-rose' }
                     ].map((f, i) => (
                        <TiltCard key={i} glowColor="245, 158, 11">
                            <div className="panel-glass rounded-[2rem] p-8 border-white/[0.04] shadow-xl group hover:bg-white/[0.02] transition-all">
                                 <div className={cn("p-3 rounded-lg bg-white/5 transition-colors group-hover:bg-white/10 mb-6 w-fit shadow-lg", f.color)}>
                                     <f.icon className="w-5 h-5" />
                                 </div>
                                 <h4 className="text-lg font-black text-white tracking-tight uppercase italic mb-3">{f.label}</h4>
                                 <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tight italic opacity-60 leading-relaxed font-mono">{" >> "} {f.desc}</p>
                            </div>
                        </TiltCard>
                     ))}
                </div>
            </div>
        </main>
    );
};

export default UploadPage;
