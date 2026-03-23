import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, GraduationCap, CreditCard, ChevronRight, Sparkles, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

interface PredictionHubProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const Header = ({ title, icon: Icon }: any) => (
    <div className="space-y-2" style={{ transform: 'translateZ(15px)' }}>
        <div className="flex items-center gap-4 text-sunset-amber mb-1">
          <div className="p-2 bg-sunset-amber/10 rounded-lg ring-1 ring-sunset-amber/30"><Icon className="w-5 h-5" /></div>
          <div className="text-[9px] font-mono font-black uppercase tracking-[0.2em] bg-sunset-amber/20 px-2 py-1 rounded-md flex items-center gap-2 border border-sunset-amber/30">
            <Sparkles className="w-2.5 h-2.5" /> PHASE_DATA_INPUT
          </div>
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight leading-none uppercase">{title}</h3>
        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-wider opacity-60 leading-relaxed font-mono">SYSTEM_DATA_INGESTION: [PROTOCOL_V2]</p>
    </div>
);

const InputGroup = ({ label, icon: Icon, ...props }: any) => (
    <div className="space-y-4" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex items-center gap-3">
             <label className="text-[8px] font-mono font-black uppercase tracking-[0.4em] text-slate-700 block px-4 border-l border-sunset-amber/40">{label}</label>
             <div className="flex-1 h-[1px] bg-white/[0.03]" />
        </div>
        <div className="relative group/input">
          <input {...props} required
              className="w-full text-white px-8 py-5 rounded-2xl outline-none transition-all font-black placeholder:text-slate-900 text-xl font-mono shadow-2xl"
              style={{ 
                  background: 'rgba(2,2,6,0.9)', 
                  border: '1px solid rgba(255,255,255,0.04)',
                  boxShadow: 'inset 0 10px 40px rgba(0,0,0,0.5)'
              }}
              onFocus={(e: any) => { 
                e.target.style.borderColor = 'rgba(245,158,11,0.4)'; 
                e.target.style.boxShadow = '0 0 50px rgba(245,158,11,0.1), inset 0 10px 40px rgba(0,0,0,0.5)'; 
              }}
              onBlur={(e: any) => { 
                e.target.style.borderColor = 'rgba(255,255,255,0.04)'; 
                e.target.style.boxShadow = 'inset 0 10px 40px rgba(0,0,0,0.5)'; 
              }}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none flex gap-2">
            <Icon className="w-5 h-5 text-sunset-amber/10" />
            <Cpu className="w-5 h-5 text-sunset-rose/10" />
          </div>
        </div>
    </div>
);

const PredictionHub: React.FC<PredictionHubProps> = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
      name: '',
      attendance: '85',
      sem1_cgpa: '7.5',
      sem2_cgpa: '7.8',
      fee_paid: '1'
  });

  const steps = [
      { id: 1, title: 'IDENTITY_PROFILE', icon: User, fields: [{ name: 'name', label: 'STUDENT_FULL_NAME', placeholder: 'ENTER STUDENT NAME', type: 'text' }] },
      { id: 2, title: 'ENGAGEMENT_METRICS', icon: Activity, fields: [{ name: 'attendance', label: 'ATTENDANCE_VECTOR (0-100)', placeholder: '85', type: 'number' }] },
      { id: 3, title: 'ACADEMIC_HISTORY', icon: GraduationCap, fields: [
          { name: 'sem1_cgpa', label: 'SEMESTER_1_CGPA (0-10)', placeholder: '7.5', type: 'number' },
          { name: 'sem2_cgpa', label: 'SEMESTER_2_CGPA (0-10)', placeholder: '7.8', type: 'number' }
      ] },
      { id: 4, title: 'FINANCIAL_PROTOCOL', icon: CreditCard, fields: [{ name: 'fee_paid', label: 'TUITION_STATUS (1=PAID, 0=UNPAID)', placeholder: '1', type: 'number' }] }
  ];

  const currentStep = steps.find(s => s.id === step);

  const next = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Map to backend expected format
      const backendData = {
        attendance: parseFloat(data.attendance),
        sem1_cgpa: parseFloat(data.sem1_cgpa),
        sem2_cgpa: parseFloat(data.sem2_cgpa),
        fee_paid: parseInt(data.fee_paid)
      };
      // Keep name for frontend UI
      onSubmit({ ...backendData, name: data.name });
    }
  };

  return (
    <TiltCard glowColor="245, 158, 11" className="w-full">
      <div className="panel-glass rounded-[2.5rem] p-10 min-h-[500px] flex flex-col relative overflow-hidden group border-white/[0.04] shadow-3xl" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunset-amber/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-16" style={{ transform: 'translateZ(30px)' }}>
            <Header title={currentStep?.title} icon={currentStep?.icon} />
            <div className="flex gap-2">
                {steps.map(s => (
                    <motion.div key={s.id} 
                        initial={false}
                        animate={{ 
                            width: step === s.id ? 40 : 8,
                            backgroundColor: step >= s.id ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                            opacity: step >= s.id ? 1 : 0.3
                        }}
                        className="h-2 rounded-full shadow-2xl border border-white/5"
                    />
                ))}
            </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full mb-12" style={{ transform: 'translateZ(40px)' }}>
            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    {currentStep?.fields.map(f => (
                        <div key={f.name} className="mb-8">
                             <InputGroup 
                                label={f.label}
                                type={f.type}
                                value={(data as any)[f.name]}
                                placeholder={f.placeholder}
                                icon={currentStep?.icon}
                                onChange={(e: any) => setData({ ...data, [f.name]: e.target.value })}
                            />
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="mt-auto flex justify-between items-center" style={{ transform: 'translateZ(50px)' }}>
            <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-mono font-black text-slate-800 tracking-[0.3em] uppercase">SYSTEM_STABLE</span>
                 <div className="flex gap-1.5 opacity-30">
                     {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i <= step * 2 ? 'bg-sunset-amber' : 'bg-white/10')} />)}
                 </div>
            </div>
            <motion.button 
                whileHover={{ scale: 1.02, y: -2 }} 
                whileTap={{ scale: 0.98 }}
                onClick={next}
                disabled={loading}
                className={cn("px-10 py-5 rounded-2xl flex items-center gap-4 font-black uppercase tracking-[0.3em] text-[11px] text-white shadow-3xl transition-all relative overflow-hidden group",
                    loading ? "opacity-50 cursor-not-allowed" : "shimmer-accent"
                )}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #be123c)' }}
            >
                <div className="relative z-10 flex items-center gap-2">
                    {loading ? 'PROCESSING...' : step === 4 ? 'INITIALIZE_PREDICTION' : 'NEXT_PHASE'}
                    <div className="p-1.5 bg-white/10 rounded-lg"><ChevronRight className="w-4 h-4" /></div>
                </div>
            </motion.button>
        </div>
      </div>
    </TiltCard>
  );
};

export default PredictionHub;
