import React from 'react';
import { motion } from 'framer-motion';
import { Database, GraduationCap, ShieldCheck } from 'lucide-react';
import BulkUpload from '@/components/BulkUpload';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

const UploadPage: React.FC = () => {
    return (
        <main className="min-h-screen pt-40 px-16 pb-32 bg-slate-navy relative overflow-hidden bg-grid-cyber">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-vibrant/5 blur-[200px] rounded-full pointer-events-none" />
            
            <div className="max-w-[1500px] mx-auto w-full relative z-10">
                <div className="flex flex-col items-center text-center mb-32">
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex flex-col items-center">
                        <div className="p-4 bg-indigo-vibrant/10 rounded-2xl ring-1 ring-indigo-vibrant/40 mb-6 shadow-3xl"><Database className="w-10 h-10 text-indigo-vibrant" /></div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">INSTITUTIONAL_DATA_INGESTION</h2>
                        <span className="text-[10px] font-mono font-black text-slate-700 tracking-[0.4em] uppercase mb-10 leading-relaxed font-mono italic">CSV_BATCH_PROCESSING_SYNC_V5_AUDIT_READY</span>
                     </motion.div>
                </div>

                <div className="mb-32">
                     <BulkUpload />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                     {[
                        { label: 'DATA_INTEGRITY', desc: 'Secure encryption of institutional student identity vectors throughout the ingestion lifecycle.', icon: ShieldCheck, color: 'text-emerald-vibrant' },
                        { label: 'MASSIVE_SCALE_SYNERGY', desc: 'Batch processing of up to 50,000 student dropout risk prognostications per cycle.', icon: Database, color: 'text-indigo-vibrant' },
                        { label: 'AUDIT_CERTIFIED', desc: 'Verified 99.9% ingestion success rate across institutional diagnostic cohorts.', icon: GraduationCap, color: 'text-rose-vibrant' }
                     ].map((f, i) => (
                        <TiltCard key={i} glowColor="99, 102, 241">
                            <div className="panel-glass rounded-[3rem] p-12 border-white/[0.04] shadow-3xl group hover:bg-white/[0.02] transition-all duration-1000">
                                 <div className={cn("p-4 rounded-xl bg-white/5 transition-colors group-hover:bg-white/10 mb-8 w-fit shadow-2xl", f.color)}>
                                     <f.icon className="w-6 h-6" />
                                 </div>
                                 <h4 className="text-xl font-black text-white tracking-tight uppercase italic mb-4">{f.label}</h4>
                                 <p className="text-sm text-slate-700 font-bold uppercase tracking-tight italic opacity-60 leading-relaxed font-mono">{" >> "} {f.desc}</p>
                            </div>
                        </TiltCard>
                     ))}
                </div>
            </div>
        </main>
    );
};

export default UploadPage;
