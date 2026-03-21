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
    <div className="max-w-[1400px] mx-auto">
      <TiltCard glowColor="245, 158, 11">
        <div className="panel-glass rounded-[4rem] p-24 text-center relative overflow-hidden border-white/[0.04] shadow-3xl min-h-[700px] flex flex-col justify-center" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sunset-amber/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex justify-center mb-16" style={{ transform: 'translateZ(50px)' }}>
                <div className="px-8 py-3 rounded-full text-[10px] font-mono font-black text-sunset-amber tracking-[0.5em] uppercase border border-sunset-amber/30 bg-sunset-amber/5 flex items-center gap-4 backdrop-blur-3xl shadow-3xl">
                    <Shield className="w-5 h-5 shadow-2xl" /> SECURE_DATA_INGESTION_READY
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {!isProcessing && !results ? (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                  style={{ transform: 'translateZ(100px)' }}
                  className={cn(
                    "relative group cursor-pointer border-2 border-dashed rounded-[4rem] p-32 transition-all duration-700 backdrop-blur-3xl",
                    isDragging ? "bg-sunset-amber/10 border-sunset-amber scale-105 shadow-[0_0_100px_rgba(245,158,11,0.2)]" : "bg-white/[0.01] border-white/10 hover:border-sunset-amber/30 hover:bg-white/[0.03]"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} className="hidden" accept=".csv" />
                  
                  <div className="flex flex-col items-center gap-10">
                    <div className="relative">
                        <motion.div 
                            animate={{ y: [0, -20, 0], scale: isDragging ? 1.2 : 1 }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-32 h-32 bg-sunset-amber/10 rounded-[2.5rem] flex items-center justify-center text-sunset-amber ring-2 ring-sunset-amber/30 shadow-3xl"
                        >
                            <Upload className="w-12 h-12" />
                        </motion.div>
                        <div className="absolute -inset-10 bg-sunset-amber blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity" />
                    </div>
                    <div>
                        <h3 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase italic">DROP_INSTITUTIONAL_CSV</h3>
                        <p className="text-sm text-slate-700 font-bold uppercase tracking-[0.3em] opacity-60">System supports bulk student metadata flows (Max: 50MB)</p>
                    </div>
                  </div>
                </motion.div>
              ) : isProcessing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-16"
                  style={{ transform: 'translateZ(150px)' }}
                >
                  <div className="relative w-72 h-72">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-t-4 border-sunset-amber rounded-full shadow-[0_0_80px_rgba(245,158,11,0.3)] filter blur-[1px]"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-10 border-b-4 border-sunset-rose rounded-full opacity-50 shadow-[0_0_80px_rgba(190,18,60,0.3)] filter blur-[1px]"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Database className="w-16 h-16 text-sunset-amber animate-pulse mb-4 shadow-3xl" />
                        <span className="text-[10px] font-mono font-black text-sunset-amber tracking-[0.4em] uppercase">INGESTION_FLOW</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter mb-6 uppercase italic">ANALYZING_DROPOUT_CONSIDERATIONS...</h3>
                    <div className="w-[800px] h-2 bg-white/5 rounded-full relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                        <motion.div 
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-sunset-amber to-transparent"
                        />
                    </div>
                    <div className="mt-6 flex justify-between text-[10px] font-mono font-black text-slate-800 tracking-widest uppercase italic">
                        <span>SYNCHRONIZING_NEURAL_PATHWAYS</span>
                        <span>NODE_84%_COMPLETE</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-16"
                  style={{ transform: 'translateZ(100px)' }}
                >
                  <div className="flex flex-col items-center gap-6 mb-20 text-matrix-green">
                      <div className="w-32 h-32 bg-matrix-green/10 rounded-[2.5rem] flex items-center justify-center text-matrix-green ring-2 ring-matrix-green/30 shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <h3 className="text-5xl font-black tracking-tighter uppercase italic">DATABASE_MIGRATION_COMPLETE</h3>
                      <p className="text-sm font-bold uppercase tracking-[0.4em] opacity-60 italic text-slate-700">All student records have been synchronized with the neural core.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {results?.map((res, i) => (
                      <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl text-left group hover:bg-white/[0.04] transition-all duration-700 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xs font-black text-white tracking-widest uppercase italic border-l-2 border-sunset-amber pl-4">{res.name}</span>
                            <div className={cn("px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border", 
                                res.risk_level === 'High' ? 'text-sunset-rose border-sunset-rose/30 bg-sunset-rose/5' : 'text-matrix-green border-matrix-green/30 bg-matrix-green/5'
                            )}>{res.risk_level}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-800 uppercase tracking-widest">Attendance</span>
                                <div className="text-2xl font-black text-white">{res.attendance}</div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-800 uppercase tracking-widest">GPA_Vector</span>
                                <div className="text-2xl font-black text-white">{res.gpa}</div>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setResults(null); }}
                    className="mt-16 px-16 py-8 rounded-[2.5rem] btn-premium shimmer-accent"
                  >
                    RETURN_TO_DIAGNOSTIC_HUB
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Artistic Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-scanline animate-scan" style={{ backgroundSize: '100% 4px' }} />
        </div>
      </TiltCard>
    </div>
  );
};

export default BulkUpload;
