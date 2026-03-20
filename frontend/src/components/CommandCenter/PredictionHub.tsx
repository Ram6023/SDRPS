import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, GraduationCap, CreditCard, ChevronRight, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

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
      {/* Progress Track with 3D feel */}
      <div className="flex justify-between mb-16 relative px-4" style={{ transform: 'translateZ(10px)' }}>
        <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 z-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <motion.div 
            className="absolute top-1/2 left-0 h-[1.5px] -translate-y-1/2 z-0 origin-left"
            style={{ width: '100%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', boxShadow: '0 0 10px rgba(139,92,246,0.4)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (step - 1) / 3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        {steps.map((s) => (
          <div key={s.id} className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>
            <motion.button
                type="button"
                onClick={() => setStep(s.id)}
                whileHover={{ scale: 1.15, rotate: 5, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700",
                    step >= s.id 
                    ? 'text-white' 
                    : 'text-slate-600 border border-white/[0.04]'
                )}
                style={step >= s.id ? { 
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    boxShadow: '0 0 25px rgba(139,92,246,0.3)',
                    transform: 'translateZ(10px)'
                } : { background: 'rgba(12,12,22,0.8)' }}
            >
              {step > s.id ? <Check className="w-6 h-6 stroke-[3px]" /> : <s.icon className="w-5 h-5" />}
            </motion.button>
            <div className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-4 text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-500",
                step >= s.id ? 'text-white translate-y-0 opacity-100' : 'text-slate-600 translate-y-1 opacity-50'
            )}>
                {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Form with 3D Tilt */}
      <TiltCard glowColor="139, 92, 246" className="w-full">
        <form onSubmit={handleSubmit} className="panel-glass rounded-[2rem] p-10 sm:p-14 relative overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-500/5 blur-3xl rounded-full" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              {step === 1 && (
                <div className="space-y-8" style={{ transformStyle: 'preserve-3d' }}>
                  <Header title="Student Identity" desc="Primary identification of the subject student." icon={User} />
                  <InputGroup label="Subject Full Name" type="text" name="name" autoFocus placeholder="Enter name..."
                      value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <Header title="Engagement Metrics" desc="Percentage of academic sessions attended." icon={Activity} />
                  <InputGroup label="Cumulative Attendance (%)" type="number" max={100} min={0} name="attendance" autoFocus placeholder="0 - 100"
                      value={formData.attendance} onChange={(e: any) => setFormData({...formData, attendance: e.target.value})} />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <Header title="Academic History" desc="Performance metrics for previous semesters." icon={GraduationCap} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ transform: 'translateZ(10px)' }}>
                      <InputGroup label="Sem 1 GPA" type="number" max={10} min={0} step="0.01" name="sem1_cgpa" placeholder="0.00"
                          value={formData.sem1_cgpa} onChange={(e: any) => setFormData({...formData, sem1_cgpa: e.target.value})} />
                      <InputGroup label="Sem 2 GPA" type="number" max={10} min={0} step="0.01" name="sem2_cgpa" placeholder="0.00"
                          value={formData.sem2_cgpa} onChange={(e: any) => setFormData({...formData, sem2_cgpa: e.target.value})} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  <Header title="Financial Integrity" desc="Verified status of institutional fee payment." icon={CreditCard} />
                  <div className="grid grid-cols-2 gap-5" style={{ transform: 'translateZ(10px)' }}>
                    <SelectBox active={formData.fee_paid === 1} onClick={() => setFormData({...formData, fee_paid: 1})} label="Cleared" desc="Fees Fully Paid" />
                    <SelectBox active={formData.fee_paid === 0} onClick={() => setFormData({...formData, fee_paid: 0})} label="Pending" desc="Payment Dues" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <footer className="flex justify-between items-center mt-16 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', transform: 'translateZ(40px)' }}>
              <button type="button" onClick={handleBack}
                  className={cn("text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all disabled:opacity-0", step === 1 && "invisible")}>
                  Back
              </button>
              
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="btn-premium px-10 py-4 shimmer-accent text-sm font-black uppercase tracking-[0.2em] gap-3">
                  {step < 4 ? "Next Phase" : loading ? "Neural Scan..." : "Analyze Risk"}
                  {step < 4 && <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 duration-300" />}
              </motion.button>
          </footer>
        </form>
      </TiltCard>
    </div>
  );
};

const Header = ({ title, desc, icon: Icon }: any) => (
    <div className="space-y-2" style={{ transform: 'translateZ(10px)' }}>
        <div className="flex items-center gap-3 text-accent-400 mb-1">
          <Icon className="w-4.5 h-4.5" />
          <div className="text-[10px] font-black uppercase tracking-widest bg-accent-500/15 px-2 py-0.5 rounded flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5" /> Phase Data
          </div>
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 font-medium">{desc}</p>
    </div>
);

const InputGroup = ({ label, ...props }: any) => (
    <div className="space-y-3" style={{ transform: 'translateZ(15px)' }}>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block ml-2">{label}</label>
        <div className="relative group/input">
          <input {...props} required
              className="w-full text-white px-8 py-5 rounded-2xl outline-none transition-all font-black placeholder:text-slate-800 text-xl"
              style={{ 
                  background: 'rgba(12,12,22,0.85)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e: any) => { 
                e.target.style.borderColor = 'rgba(139,92,246,0.4)'; 
                e.target.style.boxShadow = '0 0 0 5px rgba(139,92,246,0.06), inset 0 2px 4px rgba(0,0,0,0.2)'; 
              }}
              onBlur={(e: any) => { 
                e.target.style.borderColor = 'rgba(255,255,255,0.08)'; 
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)'; 
              }}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none">
            <Sparkles className="w-5 h-5 text-accent-400/20" />
          </div>
        </div>
    </div>
);

const SelectBox = ({ active, onClick, label, desc }: any) => (
    <button type="button" onClick={onClick}
        className={cn("p-8 rounded-2xl text-left transition-all group relative overflow-hidden flex flex-col justify-end min-h-[140px]",
            active ? 'text-white' : 'hover:border-white/12'
        )}
        style={active 
            ? { background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 0 30px rgba(139,92,246,0.12)' }
            : { background: 'rgba(12,12,22,0.85)', border: '1px solid rgba(255,255,255,0.08)' }
        }
    >
        <div className={cn("absolute top-6 right-6 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-700",
            active ? 'bg-accent-400 border-accent-400 text-white scale-100' : 'bg-transparent border-white/10 text-transparent scale-75'
        )}>
            <Check className="w-5 h-5 stroke-[3px]" />
        </div>
        <div className={cn("text-base font-black mb-1.5 relative z-10 tracking-tight", active ? 'text-white translate-y-0' : 'text-slate-500 translate-y-2')}>{label}</div>
        <div className={cn("text-[10px] font-bold uppercase tracking-widest relative z-10 transition-all duration-500", active ? 'text-accent-400 opacity-100' : 'text-slate-700 opacity-60')}>{desc}</div>
    </button>
);

export default PredictionHub;
