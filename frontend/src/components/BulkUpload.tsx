import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, CheckCircle, FileText, AlertCircle, Download, Database } from 'lucide-react';
import { predictDropoutCSV } from '../services/api';
import { cn } from '@/lib/utils';

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
      <div className="panel-glass rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)' }} />
        
        <div className="space-y-8">
          <header className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Bulk Analysis</h2>
            <p className="text-slate-500 text-sm">Upload a CSV file with student data for batch risk prediction.</p>
          </header>

          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
                "relative group cursor-pointer transition-all duration-500 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-14",
                dragActive 
                    ? 'border-accent-400 scale-[0.98]' 
                    : 'border-white/[0.06] hover:border-white/[0.1]'
            )}
            style={dragActive ? { background: 'rgba(6,182,212,0.03)' } : { background: 'rgba(0,0,0,0.2)' }}
          >
            <input type="file" accept=".csv" onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={file ? 'selected' : 'empty'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
                    file ? 'text-emerald-400' : 'text-slate-600 group-hover:text-accent-400'
                )}
                style={file 
                    ? { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }
                    : { background: 'rgba(12,18,30,0.8)', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {file ? <CheckCircle className="w-8 h-8" /> : <CloudUpload className="w-8 h-8" />}
              </motion.div>
            </AnimatePresence>

            <div className="text-center space-y-1.5">
              <span className={cn("text-lg font-bold block", file ? 'text-white' : 'text-slate-500')}>
                {file ? file.name : "Drop CSV file here"}
              </span>
              <span className="text-[10px] text-slate-600 font-medium tracking-wider">
                {file ? `${(file.size / 1024).toFixed(2)} KB — Ready` : "or click to browse"}
              </span>
            </div>

            {!file && (
               <div className="mt-8 flex flex-wrap justify-center gap-2 opacity-40 group-hover:opacity-80 transition-all duration-500">
                  {['attendance', 'sem1_cgpa', 'sem2_cgpa', 'fee_paid'].map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-lg text-[9px] font-medium text-slate-500 tracking-wider"
                            style={{ background: 'rgba(12,18,30,0.8)', border: '1px solid rgba(255,255,255,0.04)' }}>{t}</span>
                  ))}
               </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs font-medium flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </motion.div>
            )}
            {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-3">
                    <Download className="w-4 h-4 flex-shrink-0" /> Analysis complete. Results downloaded.
                </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            disabled={!file || loading}
            onClick={handleUpload}
            whileHover={file && !loading ? { scale: 1.02 } : {}}
            whileTap={file && !loading ? { scale: 0.98 } : {}}
            className="btn-premium w-full py-4 text-sm font-semibold shimmer-accent flex items-center justify-center gap-2.5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? (
                <><Database className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
                <><FileText className="w-4 h-4" /> Run Batch Analysis</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
