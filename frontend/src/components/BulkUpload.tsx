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
      setError("Incompatible format. Please provide a standard .csv student record.");
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
      const rows = results.map(row => Object.values(row).join(','));
      const csvContent = [headers, ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DROPOUT_AI_ANALYSIS_${new Date().getTime()}.csv`;
      a.click();
      
      setSuccess(true);
      onResult(results);
    } catch (err: any) {
      setError(err.message || 'Error processing data stream.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="panel-glass rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="space-y-10">
          <header className="text-center space-y-3">
            <h2 className="text-3xl font-black text-white tracking-tighter">Mass Processing Interface</h2>
            <p className="text-slate-500 text-sm font-medium">Ingest large-scale student datasets for parallel neural risk detection.</p>
          </header>

          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
                "relative group cursor-pointer transition-all duration-700 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center p-16",
                dragActive 
                    ? 'border-brand-400 bg-brand-400/5 scale-[0.98]' 
                    : 'border-white/5 bg-black/20 hover:border-white/10'
            )}
          >
            <input 
              type="file" 
              accept=".csv"
              onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={file ? 'selected' : 'empty'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl transition-all duration-700",
                    file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-600 group-hover:text-brand-400'
                )}
              >
                {file ? <CheckCircle className="w-10 h-10" /> : <CloudUpload className="w-10 h-10" />}
              </motion.div>
            </AnimatePresence>

            <div className="text-center space-y-2">
              <span className={cn(
                "text-xl font-black block transition-colors",
                file ? 'text-white' : 'text-slate-500'
              )}>
                {file ? file.name : "Select Dataset"}
              </span>
              <span className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">
                {file ? `${(file.size / 1024).toFixed(2)} KB • System Ready` : "Drag and drop source CSV"}
              </span>
            </div>

            {!file && (
               <div className="mt-12 flex flex-wrap justify-center gap-3 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                  {['Attendance', 'CGPA', 'Fees'].map(t => (
                      <span key={t} className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">{t}</span>
                  ))}
               </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold flex items-center gap-3"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </motion.div>
            )}
            
            {success && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-3"
                >
                    <Download className="w-5 h-5 flex-shrink-0" />
                    Analysis complete. Results downloaded successfully.
                </motion.div>
            )}
          </AnimatePresence>

          <button 
            disabled={!file || loading}
            onClick={handleUpload}
            className="btn-premium w-full py-6 text-xs uppercase tracking-[0.3em] font-black shimmer-indigo shadow-2xl group flex items-center justify-center gap-3"
          >
            {loading ? (
                <>
                    <Database className="w-5 h-5 animate-spin" />
                    Neural Processing In Progress...
                </>
            ) : (
                <>
                    <FileText className="w-5 h-5 group-hover:scale-125 transition-transform" />
                    Run Batch Analysis
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
