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
			color: string;
		}> = [];

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener('resize', resize);

		const colors = ['6, 182, 212', '34, 211, 238', '251, 191, 36'];

		for (let i = 0; i < 70; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.25,
				vy: (Math.random() - 0.5) * 0.25,
				size: Math.random() * 2 + 0.5,
				opacity: Math.random() * 0.25 + 0.05,
				pulse: Math.random() * Math.PI * 2,
				speed: Math.random() * 0.008 + 0.003,
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Subtle grid
			const spacing = 60;
			for (let x = 0; x < canvas.width; x += spacing) {
				for (let y = 0; y < canvas.height; y += spacing) {
					ctx.beginPath();
					ctx.arc(x, y, 0.6, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
					ctx.fill();
				}
			}

			// Particles
			particles.forEach(p => {
				p.x += p.vx;
				p.y += p.vy;
				p.pulse += p.speed;
				if (p.x < 0) p.x = canvas.width;
				if (p.x > canvas.width) p.x = 0;
				if (p.y < 0) p.y = canvas.height;
				if (p.y > canvas.height) p.y = 0;

				const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.12;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, pulseOpacity)})`;
				ctx.fill();
			});

			// Connections
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 100) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(6, 182, 212, ${0.04 * (1 - dist / 100)})`;
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
		<div className={`absolute inset-0 overflow-hidden ${className}`} style={{ backgroundColor: '#060a13' }}>
			<canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

			{/* Cyan aurora */}
			<motion.div
				animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.15, 0.9, 1] }}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[10%] left-[20%] w-[450px] h-[450px] rounded-full pointer-events-none"
				style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
			/>
			{/* Warm amber aurora */}
			<motion.div
				animate={{ x: [0, -40, 25, 0], y: [0, 30, -20, 0], scale: [1.1, 0.85, 1.05, 1.1] }}
				transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
				style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)' }}
			/>
			{/* Deep teal */}
			<motion.div
				animate={{ x: [0, 20, -15, 0], y: [0, -30, 25, 0] }}
				transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[55%] left-[55%] w-[350px] h-[350px] rounded-full pointer-events-none"
				style={{ background: 'radial-gradient(circle, rgba(14,116,144,0.06) 0%, transparent 70%)' }}
			/>

			{/* Vignette */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,10,19,0.6)_60%,rgba(6,10,19,0.95)_100%)] pointer-events-none" />
		</div>
	);
}
