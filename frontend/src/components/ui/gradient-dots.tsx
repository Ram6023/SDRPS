'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type CinematicBackgroundProps = {
	className?: string;
};

export function GradientDots({ className }: CinematicBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseX = useMotionValue(0.5);
	const mouseY = useMotionValue(0.5);
	const smoothX = useSpring(mouseX, { stiffness: 20, damping: 15 });
	const smoothY = useSpring(mouseY, { stiffness: 20, damping: 15 });

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			mouseX.set(e.clientX / window.innerWidth);
			mouseY.set(e.clientY / window.innerHeight);
		};
		window.addEventListener('mousemove', handler);
		return () => window.removeEventListener('mousemove', handler);
	}, [mouseX, mouseY]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		let animationId: number;

		const particles: Array<{
			x: number; y: number; z: number;
			vx: number; vy: number;
			size: number; opacity: number;
			pulse: number; speed: number;
			color: string;
		}> = [];

		const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
		resize();
		window.addEventListener('resize', resize);

		// Updated colors: Violet, Indigo, Fuchsia, Rose
		const colors = ['139, 92, 246', '99, 102, 241', '217, 70, 239', '244, 63, 94'];
		for (let i = 0; i < 65; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				z: Math.random() * 3 + 0.5,
				vx: (Math.random() - 0.5) * 0.12,
				vy: (Math.random() - 0.5) * 0.12,
				size: Math.random() * 2 + 0.5,
				opacity: Math.random() * 0.18 + 0.04,
				pulse: Math.random() * Math.PI * 2,
				speed: Math.random() * 0.005 + 0.002,
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const mx = smoothX.get();
			const my = smoothY.get();

			// Mouse-reactive grid (subtle violet)
			const spacing = 75;
			for (let x = 0; x < canvas.width; x += spacing) {
				for (let y = 0; y < canvas.height; y += spacing) {
					const dx = (x / canvas.width - mx) * 10;
					const dy = (y / canvas.height - my) * 10;
					ctx.beginPath();
					ctx.arc(x + dx, y + dy, 0.4, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(139, 92, 246, 0.035)';
					ctx.fill();
				}
			}

			// Particles with depth-based parallax
			particles.forEach(p => {
				const parallaxFactor = p.z * 0.4;
				const offsetX = (mx - 0.5) * 35 * parallaxFactor;
				const offsetY = (my - 0.5) * 35 * parallaxFactor;
				p.x += p.vx;
				p.y += p.vy;
				p.pulse += p.speed;
				if (p.x < -10) p.x = canvas.width + 10;
				if (p.x > canvas.width + 10) p.x = -10;
				if (p.y < -10) p.y = canvas.height + 10;
				if (p.y > canvas.height + 10) p.y = -10;

				const drawX = p.x + offsetX;
				const drawY = p.y + offsetY;
				const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.07;
				const drawSize = p.size * (0.85 + p.z * 0.3);

				ctx.beginPath();
				ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, pulseOpacity)})`;
				ctx.fill();
			});

			// Connections between close particles at same depth
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const ddx = particles[i].x - particles[j].x;
					const ddy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(ddx * ddx + ddy * ddy);
					if (dist < 100 && Math.abs(particles[i].z - particles[j].z) < 0.8) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(139, 92, 246, ${0.03 * (1 - dist / 100)})`;
						ctx.lineWidth = 0.35;
						ctx.stroke();
					}
				}
			}
			animationId = requestAnimationFrame(draw);
		};
		draw();
		return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
	}, [smoothX, smoothY]);

	const orb1X = useTransform(smoothX, [0, 1], [-40, 40]);
	const orb1Y = useTransform(smoothY, [0, 1], [-30, 30]);
	const orb2X = useTransform(smoothX, [0, 1], [30, -30]);
	const orb2Y = useTransform(smoothY, [0, 1], [20, -20]);
	const orb3X = useTransform(smoothX, [0, 1], [-20, 20]);
	const orb3Y = useTransform(smoothY, [0, 1], [-30, 30]);
	const orb1RotX = useTransform(smoothY, [0, 1], [6, -6]);
	const orb1RotY = useTransform(smoothX, [0, 1], [-6, 6]);

	return (
		<div className={`absolute inset-0 overflow-hidden ${className}`} style={{ backgroundColor: '#040409', perspective: '1200px' }}>
			<canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

			{/* 3D Floating Orbs - Deep Amethyst & Fuchsia */}
			<motion.div
				style={{ x: orb1X, y: orb1Y, rotateX: orb1RotX, rotateY: orb1RotY, background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', willChange: 'transform' }}
				animate={{ scale: [1, 1.25, 1], rotate: [0, 5, 0] }}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
			/>
			<motion.div
				style={{ x: orb2X, y: orb2Y, background: 'radial-gradient(circle, rgba(217,70,239,0.05) 0%, transparent 65%)', willChange: 'transform' }}
				animate={{ scale: [1.2, 0.95, 1.2], rotate: [0, -5, 0] }}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
				className="absolute bottom-[5%] right-[5%] w-[550px] h-[550px] rounded-full pointer-events-none"
			/>
			<motion.div
				style={{ x: orb3X, y: orb3Y, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)', willChange: 'transform' }}
				animate={{ scale: [0.85, 1.15, 0.85] }}
				transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
				className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full pointer-events-none"
			/>

			{/* Cinematic vignette */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,4,9,0.4)_50%,rgba(4,4,9,0.95)_100%)] pointer-events-none" />
			
			{/* Scanline */}
			<div className="absolute inset-0 opacity-[0.012] pointer-events-none"
				 style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)' }} />
		</div>
	);
}
