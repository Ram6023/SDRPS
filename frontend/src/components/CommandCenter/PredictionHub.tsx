import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, GraduationCap, CreditCard, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PredictionHubProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const PredictionHub: React.FC<PredictionHubProps> = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    attendance: '',
    sem1_cgpa: '',
    sem2_cgpa: '',
    fee_paid: 1
  });

  const steps = [
    { id: 1, label: 'Profile', icon: User },
    { id: 2, label: 'Engagement', icon: Activity },
    { id: 3, label: 'Academics', icon: GraduationCap },
    { id: 4, label: 'Finance', icon: CreditCard },
  ];

  const handleNext = () => step < 4 && setStep(s => s + 1);
  const handleBack = () => step > 1 && setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
        handleNext();
        return;
    }
    onSubmit({
      ...formData,
      attendance: parseFloat(formData.attendance),
      sem1_cgpa: parseFloat(formData.sem1_cgpa),
      sem2_cgpa: parseFloat(formData.sem2_cgpa),
      fee_paid: parseInt(formData.fee_paid.toString())
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      {/* ── Progress Track ── */}
      <div className="flex justify-between mb-16 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-900 -translate-y-1/2 z-0" />
        <motion.div 
            className="absolute top-1/2 left-0 h-[2px] bg-brand-500 -translate-y-1/2 z-0 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (step - 1) / 3 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
        />
        {steps.map((s) => (
          <div key={s.id} className="relative z-10">
            <motion.button
                type="button"
                onClick={() => setStep(s.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                    step >= s.id 
                    ? 'bg-brand-500 border-brand-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                )}
            >
              {step > s.id ? <Check className="w-6 h-6 stroke-[3px]" /> : <s.icon className="w-5 h-5" />}
            </motion.button>
            <div className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors",
                step >= s.id ? 'text-white' : 'text-slate-600'
            )}>
                {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Form Content ── */}
      <form onSubmit={handleSubmit} className="panel-glass rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="space-y-10"
          >
            {step === 1 && (
              <div className="space-y-8">
                <Header title="Identity Setup" desc="Enter the student's legal identification for data referencing." />
                <InputGroup 
                    label="Student Full Name"
                    type="text"
                    name="name"
                    autoFocus
                    placeholder="e.g. Jordan Vercel"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <Header title="Engagement Vector" desc="Define the percentage of physical presence in institutional sessions." />
                <InputGroup 
                    label="Attendance Rate (%)"
                    type="number"
                    max={100}
                    min={0}
                    name="attendance"
                    autoFocus
                    placeholder="0 to 100"
                    value={formData.attendance}
                    onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <Header title="Academic Trajectory" desc="Input historical CGPA benchmarks from the previous two semesters." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <InputGroup 
                        label="Semester 1 CGPA"
                        type="number"
                        max={10}
                        min={0}
                        step="0.01"
                        name="sem1_cgpa"
                        placeholder="0.00"
                        value={formData.sem1_cgpa}
                        onChange={(e) => setFormData({...formData, sem1_cgpa: e.target.value})}
                    />
                    <InputGroup 
                        label="Semester 2 CGPA"
                        type="number"
                        max={10}
                        min={0}
                        step="0.01"
                        name="sem2_cgpa"
                        placeholder="0.00"
                        value={formData.sem2_cgpa}
                        onChange={(e) => setFormData({...formData, sem2_cgpa: e.target.value})}
                    />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <Header title="Financial Status" desc="Determine if the student has any outstanding institutional dues." />
                <div className="grid grid-cols-2 gap-6">
                  <SelectBox 
                    active={formData.fee_paid === 1} 
                    onClick={() => setFormData({...formData, fee_paid: 1})}
                    label="Cleared"
                    desc="No Dues"
                  />
                  <SelectBox 
                    active={formData.fee_paid === 0} 
                    onClick={() => setFormData({...formData, fee_paid: 0})}
                    label="Outstanding"
                    desc="Flagged"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-16 pt-8 border-t border-white/5">
            <button 
                type="button"
                onClick={handleBack}
                className={cn(
                    "text-xs font-black uppercase text-slate-500 hover:text-white transition-opacity",
                    step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
            >
                Back
            </button>
            
            <motion.button 
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-premium px-10 shimmer-indigo py-4 text-xs tracking-[0.25em] font-black"
            >
                {step < 4 ? "Next Step" : loading ? "Calculating..." : "Run Prediction"}
                <ChevronRight className="w-5 h-5 ml-1" />
            </motion.button>
        </div>
      </form>
    </div>
  );
};

const Header = ({ title, desc }: { title: string, desc: string }) => (
    <div className="space-y-2">
        <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

const InputGroup = ({ label, ...props }: any) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">{label}</label>
        <input 
            {...props}
            required
            className="w-full bg-slate-900 border border-slate-800 text-white px-8 py-5 rounded-[1.5rem] outline-none focus:border-brand-500 focus:ring-8 focus:ring-brand-500/5 transition-all font-bold placeholder:text-slate-800 text-xl"
        />
    </div>
);

const SelectBox = ({ active, onClick, label, desc }: any) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "p-8 rounded-[2rem] border text-left transition-all group relative overflow-hidden",
            active 
                ? 'bg-brand-500/10 border-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.1)]' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        )}
    >
        {active && <motion.div layoutId="select-glow" className="absolute inset-0 bg-brand-500/5" />}
        <div className={cn(
            "text-sm font-black uppercase tracking-widest mb-1 relative z-10",
            active ? 'text-white' : 'text-slate-500'
        )}>{label}</div>
        <div className="text-[10px] text-slate-600 font-bold uppercase relative z-10">{desc}</div>
    </button>
);

export default PredictionHub;
