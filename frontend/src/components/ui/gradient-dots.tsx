'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type GradientDotsProps = {
	className?: string;
};

export function GradientDots({ className }: GradientDotsProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationId: number;
		let particles: Array<{
			x: number; y: number; vx: number; vy: number;
			size: number; opacity: number; pulse: number; speed: number;
		}> = [];

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener('resize', resize);

		// Create floating particles
		for (let i = 0; i < 80; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: Math.random() * 2 + 0.5,
				opacity: Math.random() * 0.3 + 0.05,
				pulse: Math.random() * Math.PI * 2,
				speed: Math.random() * 0.01 + 0.005,
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw dot grid
			const spacing = 50;
			for (let x = 0; x < canvas.width; x += spacing) {
				for (let y = 0; y < canvas.height; y += spacing) {
					ctx.beginPath();
					ctx.arc(x, y, 0.8, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
					ctx.fill();
				}
			}

			// Draw and update particles
			particles.forEach(p => {
				p.x += p.vx;
				p.y += p.vy;
				p.pulse += p.speed;

				// Wrap around
				if (p.x < 0) p.x = canvas.width;
				if (p.x > canvas.width) p.x = 0;
				if (p.y < 0) p.y = canvas.height;
				if (p.y > canvas.height) p.y = 0;

				const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(139, 92, 246, ${Math.max(0, pulseOpacity)})`;
				ctx.fill();
			});

			// Draw connections between nearby particles
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 120) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 120)})`;
						ctx.lineWidth = 0.5;
						ctx.stroke();
					}
				}
			}

			animationId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', resize);
		};
	}, []);

	return (
		<div className={`absolute inset-0 overflow-hidden ${className}`} style={{ backgroundColor: '#020617' }}>
			{/* ── Live Particle Canvas ── */}
			<canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

			{/* ── Cinematic Floating Orbs ── */}
			<motion.div
				animate={{
					x: [0, 40, -30, 0],
					y: [0, -30, 20, 0],
					scale: [1, 1.3, 0.9, 1],
				}}
				transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[15%] left-[25%] w-[400px] h-[400px] bg-indigo-500/8 blur-[160px] rounded-full pointer-events-none"
			/>
			<motion.div
				animate={{
					x: [0, -50, 30, 0],
					y: [0, 40, -20, 0],
					scale: [1.2, 0.8, 1.1, 1.2],
				}}
				transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-violet-500/5 blur-[180px] rounded-full pointer-events-none"
			/>
			<motion.div
				animate={{
					x: [0, 30, -20, 0],
					y: [0, -40, 30, 0],
				}}
				transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-cyan-500/3 blur-[140px] rounded-full pointer-events-none"
			/>

			{/* ── Heavier Vignette ── */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.7)_70%,rgba(2,6,23,0.95)_100%)] pointer-events-none" />
		</div>
	);
}
