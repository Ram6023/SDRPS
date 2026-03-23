import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, BrainCircuit, Upload, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const links = [
        { name: 'HOME', path: '/', icon: HomeIcon },
        { name: 'PREDICTION', path: '/predict', icon: BrainCircuit },
        { name: 'DASHBOARD', path: '/dashboard', icon: LayoutDashboard },
        { name: 'UPLOAD', path: '/upload', icon: Upload },
        { name: 'ABOUT', path: '/about', icon: GraduationCap }
    ];

    return (
        <header className={cn(
            "fixed top-0 w-full z-[100] transition-all duration-500 flex items-center px-6 lg:px-12",
            scrolled 
                ? "backdrop-blur-3xl bg-academy-navy/90 border-b border-white/10 h-16 shadow-[0_10px_30px_rgba(0,0,0,0.4)]" 
                : "bg-gradient-to-b from-academy-navy/80 to-transparent h-16"
        )}>
            <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between gap-6">
                {/* Logo */}
                <Link to="/" className="shrink-0 group/logo">
                    <img src={logo} alt="Student Dropout Risk Prediction" className="h-14 w-auto group-hover/logo:scale-105 transition-transform" />
                </Link>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl backdrop-blur-3xl">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                className={cn(
                                    "px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all relative",
                                    isActive 
                                        ? "text-academy-navy bg-sunset-amber shadow-[0_4px_15px_rgba(245,158,11,0.3)] font-black" 
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <link.icon className={cn("w-3.5 h-3.5", isActive ? "text-academy-navy" : "text-sunset-amber/50")} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA */}
                <Link to="/predict" className="shrink-0">
                    <button className="btn-premium px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-transform">
                        SCAN
                    </button>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
