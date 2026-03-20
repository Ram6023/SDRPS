import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, CheckCircle, FileText, AlertCircle, Download, Database, FileSpreadsheet } from 'lucide-react';
import { predictDropoutCSV } from '../services/api';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface BulkUploadProps {
  onResult: (results: any[]) => void;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onResult }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    } else {
      setError("Please provide a valid .csv file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const results = await predictDropoutCSV(file);
      
      const headers = Object.keys(results[0]).join(',');
      const rows = results.map((row: any) => Object.values(row).join(','));
      const csvContent = [headers, ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dropout_analysis_${new Date().getTime()}.csv`;
      a.click();
      
      setSuccess(true);
      onResult(results);
    } catch (err: any) {
      setError(err.message || 'Error processing file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <TiltCard glowColor="139, 92, 246" className="w-full">
        <div className="panel-glass rounded-[2rem] p-10 sm:p-14 relative overflow-hidden h-full" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="space-y-10" style={{ transform: 'translateZ(20px)' }}>
            <header className="text-center space-y-3">
              <div className="flex justify-center mb-2" style={{ transform: 'translateZ(10px)' }}>
                <div className="p-3 rounded-2xl bg-accent-500/10 text-accent-400 ring-1 ring-accent-400/20">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Mass Data Processing</h2>
              <p className="text-slate-500 text-sm font-medium">Ingest large-scale student datasets for parallel AI risk detection.</p>
            </header>

            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                  "relative group cursor-pointer transition-all duration-700 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-16",
                  dragActive 
                      ? 'border-accent-400 scale-[0.98]' 
                      : 'border-white/[0.04] bg-black/20 hover:border-white/10'
              )}
              style={dragActive ? { background: 'rgba(139,92,246,0.06)' } : { transform: 'translateZ(10px)' }}
            >
              <input type="file" accept=".csv" onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={file ? 'selected' : 'empty'}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  className={cn(
                      "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl transition-all duration-700",
                      file ? 'text-emerald-400' : 'text-slate-600 group-hover:text-accent-400'
                  )}
                  style={file 
                      ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)', transform: 'translateZ(20px)' }
                      : { background: 'rgba(4,4,9,0.8)', border: '1px solid rgba(255,255,255,0.06)', transform: 'translateZ(20px)' }
                  }
                >
                  {file ? <CheckCircle className="w-10 h-10" /> : <CloudUpload className="w-10 h-10" />}
                </motion.div>
              </AnimatePresence>

              <div className="text-center space-y-2" style={{ transform: 'translateZ(15px)' }}>
                <span className={cn("text-xl font-black block transition-colors", file ? 'text-white' : 'text-slate-500')}>
                  {file ? file.name : "Inject Source Dataset"}
                </span>
                <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em]">
                  {file ? `${(file.size / 1024).toFixed(2)} KB • System Ready` : "Drag and drop source CSV"}
                </span>
              </div>

              {!file && (
                 <div className="mt-12 flex flex-wrap justify-center gap-3 opacity-30 group-hover:opacity-80 transition-all duration-700" style={{ transform: 'translateZ(5px)' }}>
                    {['attendance', 'cgpa', 'fees'].map(t => (
                        <span key={t} className="px-4 py-2 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest"
                              style={{ background: 'rgba(4,4,9,0.8)', border: '1px solid rgba(255,255,255,0.04)' }}>{t}</span>
                    ))}
                 </div>
              )}
            </div>

            <AnimatePresence>
              {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs font-bold flex items-center gap-4">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                  </motion.div>
              )}
              {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-4">
                      <Download className="w-5 h-5 flex-shrink-0" /> Analysis complete. Results exported.
                  </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              disabled={!file || loading}
              onClick={handleUpload}
              whileHover={file && !loading ? { scale: 1.05, y: -2 } : {}}
              whileTap={file && !loading ? { scale: 0.95 } : {}}
              className="btn-premium w-full py-5 text-sm font-black uppercase tracking-[0.3em] shimmer-accent flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl"
              style={{ transform: 'translateZ(30px)' }}
            >
              {loading ? (
                  <><Database className="w-5 h-5 animate-spin" /> Neutralizing Data...</>
              ) : (
                  <><FileText className="w-5 h-5" /> Execute Batch Prediction</>
              )}
            </motion.button>
          </div>
        </div>
      </TiltCard>
    </div>
  );
};

export default BulkUpload;
