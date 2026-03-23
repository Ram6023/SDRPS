import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, Database, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface BulkUploadProps {
  onResult?: (results: any[]) => void;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onResult }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) return;
    setIsProcessing(true);
    setTimeout(() => {
      const mockResults = [
        { name: 'Student_A', risk_level: 'High', probability: 0.72, gpa: 2.1, attendance: '65%' },
        { name: 'Student_B', risk_level: 'Low', probability: 0.12, gpa: 3.8, attendance: '95%' },
        { name: 'Student_C', risk_level: 'Medium', probability: 0.45, gpa: 2.9, attendance: '82%' },
      ];
      setResults(mockResults);
      setIsProcessing(false);
      onResult?.(mockResults);
    }, 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <TiltCard glowColor="245, 158, 11">
        <div className="panel-glass rounded-[2rem] p-12 text-center relative overflow-hidden border-white/[0.04] shadow-xl min-h-[450px] flex flex-col justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunset-amber/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-8" style={{ transform: 'translateZ(50px)' }}>
                <div className="px-5 py-2 rounded-xl text-[8px] font-mono font-black text-sunset-amber tracking-[0.3em] uppercase border border-sunset-amber/30 bg-sunset-amber/5 flex items-center gap-3 backdrop-blur-3xl shadow-xl">
                    <Shield className="w-4 h-4 shadow-xl" /> SECURE_INGESTION_READY
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isProcessing && !results ? (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  style={{ transform: 'translateZ(100px)' }}
                  className={cn(
                    "relative group cursor-pointer border border-dashed rounded-[1.5rem] p-16 transition-all duration-700 backdrop-blur-3xl",
                    isDragging ? "bg-sunset-amber/10 border-sunset-amber scale-102 shadow-2xl" : "bg-white/[0.01] border-white/10 hover:border-sunset-amber/30 hover:bg-white/[0.03]"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} className="hidden" accept=".csv" />
                  
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <motion.div 
                            animate={{ y: [0, -10, 0], scale: isDragging ? 1.1 : 1 }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-16 h-16 bg-sunset-amber/10 rounded-2xl flex items-center justify-center text-sunset-amber ring-1 ring-sunset-amber/30 shadow-2xl"
                        >
                            <Upload className="w-7 h-7" />
                        </motion.div>
                        <div className="absolute -inset-6 bg-sunset-amber blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tighter mb-2 uppercase italic">DROP_DATA_FILE</h3>
                        <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em] opacity-60 font-mono italic">CSV_BATCH_PROTOCOL_MAX_50MB</p>
                    </div>
                  </div>
                </motion.div>
              ) : isProcessing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-12"
                  style={{ transform: 'translateZ(150px)' }}
                >
                  <div className="relative w-40 h-40">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-t-2 border-sunset-amber rounded-full shadow-2xl filter blur-[0.5px]"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Database className="w-8 h-8 text-sunset-amber animate-pulse mb-2 shadow-2xl" />
                        <span className="text-[8px] font-mono font-black text-sunset-amber tracking-[0.2em] uppercase">INGESTION</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tighter mb-4 uppercase italic leading-none">ANALYZING_DROPOUT_DATA...</h3>
                    <div className="w-[400px] h-1 bg-white/5 rounded-full relative overflow-hidden ring-1 ring-white/10 shadow-xl mx-auto">
                        <motion.div 
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-sunset-amber to-transparent"
                        />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-12"
                  style={{ transform: 'translateZ(100px)' }}
                >
                  <div className="flex flex-col items-center gap-4 mb-10 text-emerald-500">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 ring-1 ring-emerald-500/30 shadow-2xl">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">MIGRATION_COMPLETE</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 italic text-slate-700 font-mono">Sync confirmed with neural core.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {results?.map((res, i) => (
                      <div key={i} className="p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl text-left group hover:bg-white/[0.03] transition-all duration-700 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[11px] font-black text-white tracking-widest uppercase italic border-l border-sunset-amber pl-3 leading-none truncate">{res.name}</span>
                            <div className={cn("px-3 py-1 rounded-lg text-[7px] font-black tracking-widest uppercase border", 
                                res.risk_level === 'High' ? 'text-sunset-rose border-sunset-rose/30 bg-sunset-rose/5' : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                            )}>{res.risk_level}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[7px] font-mono text-slate-800 uppercase tracking-widest">Attendance</span>
                                <div className="text-xl font-black text-white">{res.attendance}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[7px] font-mono text-slate-800 uppercase tracking-widest">GPA</span>
                                <div className="text-xl font-black text-white">{res.gpa}</div>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setResults(null); }}
                    className="mt-12 px-10 py-4 rounded-xl btn-premium shimmer-accent text-[10px] font-black uppercase tracking-[0.2em] italic"
                  >
                    RETURN_TO_HUB
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 pointer-events-none opacity-10 bg-scanline animate-scan" style={{ backgroundSize: '100% 4px' }} />
        </div>
      </TiltCard>
    </div>
  );
};

export default BulkUpload;
