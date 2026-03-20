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
    { id: 2, label: 'Attendance', icon: Activity },
    { id: 3, label: 'Academics', icon: GraduationCap },
    { id: 4, label: 'Finance', icon: CreditCard },
  ];

  const handleNext = () => step < 4 && setStep(s => s + 1);
  const handleBack = () => step > 1 && setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) { handleNext(); return; }
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
      {/* Progress Track */}
      <div className="flex justify-between mb-14 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 z-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <motion.div 
            className="absolute top-1/2 left-0 h-[1px] -translate-y-1/2 z-0 origin-left"
            style={{ width: '100%', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (step - 1) / 3 }}
            transition={{ duration: 0.5 }}
        />
        {steps.map((s) => (
          <div key={s.id} className="relative z-10">
            <motion.button
                type="button"
                onClick={() => setStep(s.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500",
                    step >= s.id 
                    ? 'text-white' 
                    : 'text-slate-600 border border-white/[0.06]'
                )}
                style={step >= s.id ? { 
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    boxShadow: '0 0 20px rgba(6,182,212,0.25)' 
                } : { background: 'rgba(12,18,30,0.8)' }}
            >
              {step > s.id ? <Check className="w-5 h-5 stroke-[2.5px]" /> : <s.icon className="w-4.5 h-4.5" />}
            </motion.button>
            <div className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-3 text-[9px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors",
                step >= s.id ? 'text-white' : 'text-slate-600'
            )}>
                {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="panel-glass rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)' }} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <Header title="Student Profile" desc="Enter the student's name for identification." />
                <InputGroup label="Full Name" type="text" name="name" autoFocus placeholder="e.g. Ravi Kumar"
                    value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Header title="Attendance Record" desc="Enter the student's attendance percentage." />
                <InputGroup label="Attendance (%)" type="number" max={100} min={0} name="attendance" autoFocus placeholder="0 — 100"
                    value={formData.attendance} onChange={(e: any) => setFormData({...formData, attendance: e.target.value})} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Header title="Academic Performance" desc="Enter CGPA for both semesters." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputGroup label="Semester 1 CGPA" type="number" max={10} min={0} step="0.01" name="sem1_cgpa" placeholder="0.00"
                        value={formData.sem1_cgpa} onChange={(e: any) => setFormData({...formData, sem1_cgpa: e.target.value})} />
                    <InputGroup label="Semester 2 CGPA" type="number" max={10} min={0} step="0.01" name="sem2_cgpa" placeholder="0.00"
                        value={formData.sem2_cgpa} onChange={(e: any) => setFormData({...formData, sem2_cgpa: e.target.value})} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <Header title="Fee Status" desc="Has the student paid all institutional fees?" />
                <div className="grid grid-cols-2 gap-4">
                  <SelectBox active={formData.fee_paid === 1} onClick={() => setFormData({...formData, fee_paid: 1})} label="Paid" desc="All Cleared" />
                  <SelectBox active={formData.fee_paid === 0} onClick={() => setFormData({...formData, fee_paid: 0})} label="Unpaid" desc="Dues Pending" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-12 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <button type="button" onClick={handleBack}
                className={cn("text-xs font-semibold text-slate-500 hover:text-white transition-opacity", step === 1 ? "opacity-0 pointer-events-none" : "opacity-100")}>
                Back
            </button>
            
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-premium px-8 shimmer-accent py-3.5 text-sm font-semibold gap-1">
                {step < 4 ? "Continue" : loading ? "Analyzing..." : "Run Prediction"}
                <ChevronRight className="w-4 h-4" />
            </motion.button>
        </div>
      </form>
    </div>
  );
};

const Header = ({ title, desc }: { title: string, desc: string }) => (
    <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
    </div>
);

const InputGroup = ({ label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 ml-1">{label}</label>
        <input {...props} required
            className="w-full text-white px-6 py-4 rounded-xl outline-none transition-all font-medium placeholder:text-slate-700 text-lg"
            style={{ 
                background: 'rgba(12,18,30,0.8)', 
                border: '1px solid rgba(255,255,255,0.06)',
            }}
            onFocus={(e: any) => { e.target.style.borderColor = 'rgba(6,182,212,0.4)'; e.target.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.05)'; }}
            onBlur={(e: any) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = 'none'; }}
        />
    </div>
);

const SelectBox = ({ active, onClick, label, desc }: any) => (
    <button type="button" onClick={onClick}
        className={cn("p-6 rounded-xl text-left transition-all group relative overflow-hidden",
            active ? 'text-white' : 'hover:border-white/10'
        )}
        style={active 
            ? { background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', boxShadow: '0 0 15px rgba(6,182,212,0.08)' }
            : { background: 'rgba(12,18,30,0.8)', border: '1px solid rgba(255,255,255,0.06)' }
        }
    >
        <div className={cn("text-sm font-bold mb-0.5 relative z-10", active ? 'text-white' : 'text-slate-500')}>{label}</div>
        <div className="text-[10px] text-slate-600 relative z-10">{desc}</div>
    </button>
);

export default PredictionHub;
