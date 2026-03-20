'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type GradientDotsProps = HTMLMotionProps<"div"> & {
	/** Dot size (default: 1.5) */
	dotSize?: number;
	/** Spacing between dots (default: 32) */
	spacing?: number;
	/** Background color (default: '#020617') */
	backgroundColor?: string;
};

export function GradientDots({
	dotSize = 1.5,
	spacing = 32,
	backgroundColor = '#020617',
	className,
	...props
}: GradientDotsProps) {
	return (
		<div
			className={`absolute inset-0 overflow-hidden ${className}`}
			style={{ backgroundColor } as React.CSSProperties}
			{...props as any}
		>
			{/* ── Subtle Dot Grid ── */}
			<div 
				className="absolute inset-0"
				style={{
					backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.05) ${dotSize}px, transparent ${dotSize}px)`,
					backgroundSize: `${spacing}px ${spacing}px`,
				}}
			/>

			{/* ── Cinematic Graphite Texture Layer ── */}
			<div className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

			{/* ── High-End Aurora Glows (Graphite/Indigo Tones) ── */}
			<motion.div 
				animate={{
					x: [-20, 20, -20],
					y: [-20, 20, -20],
					opacity: [0.1, 0.2, 0.1],
				}}
				transition={{
					duration: 15,
					repeat: Infinity,
					ease: "easeInOut"
				}}
				className="absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none"
			/>
			
			<motion.div 
				animate={{
					x: [20, -20, 20],
					y: [20, -20, 20],
					opacity: [0.08, 0.15, 0.08],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut"
				}}
				className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] bg-slate-400/5 blur-[160px] rounded-full pointer-events-none"
			/>

			{/* ── Vignette & Grain ── */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)] pointer-events-none" />
			<div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
		</div>
	);
}
