import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PredictionPage from './pages/PredictionPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import AboutPage from './pages/AboutPage';

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, filter: 'blur(15px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -40, filter: 'blur(15px)' }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                <Route path="/predict" element={<PageTransition><PredictionPage /></PageTransition>} />
                <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
                <Route path="/upload" element={<PageTransition><UploadPage /></PageTransition>} />
                <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-academy-navy font-sans text-slate-100 overflow-x-hidden selection:bg-sunset-amber/30">
        <Navbar />
        <AnimatedRoutes />
        
        {/* Standardized Footer */}
        <footer className="py-20 bg-black/40 border-t border-white/5 text-center px-16 relative z-10">
            <div className="max-w-[1400px] mx-auto opacity-30 flex flex-col items-center gap-6">
                <div className="text-[10px] font-mono font-black tracking-[0.5em] uppercase">STUDENT_DROPOUT_RISK_PREDICTION_SYSTEM_V5</div>
                <div className="flex gap-10">
                    {['SECURE', 'NEURAL_AUDIT', 'MITIGATION_READY'].map(t => <span key={t} className="text-[9px] font-mono uppercase tracking-widest">{t}</span>)}
                </div>
            </div>
        </footer>
      </div>
    </Router>
  );
}
