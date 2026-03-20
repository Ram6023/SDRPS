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

		// Aurora Mesh: Violet, Indigo, Fuchsia, Rose, Deep Blue
		const colors = ['139, 92, 246', '99, 102, 241', '217, 70, 239', '244, 63, 94', '59, 130, 246'];
		for (let i = 0; i < 75; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				z: Math.random() * 3.5 + 0.5,
				vx: (Math.random() - 0.5) * 0.1,
				vy: (Math.random() - 0.5) * 0.1,
				size: Math.random() * 2.2 + 0.6,
				opacity: Math.random() * 0.2 + 0.05,
				pulse: Math.random() * Math.PI * 2,
				speed: Math.random() * 0.004 + 0.002,
				color: colors[Math.floor(Math.random() * colors.length)],
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const mx = smoothX.get();
			const my = smoothY.get();

			// ── Cinematic Mesh Pattern ──
			const spacing = 80;
			for (let x = 0; x < canvas.width; x += spacing) {
				for (let y = 0; y < canvas.height; y += spacing) {
					const dx = (x / canvas.width - mx) * 12;
					const dy = (y / canvas.height - my) * 12;
					ctx.beginPath();
					ctx.arc(x + dx, y + dy, 0.45, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
					ctx.fill();
				}
			}

			// ── Particles with Depth ──
			particles.forEach(p => {
				const parallaxFactor = p.z * 0.45;
				const offsetX = (mx - 0.5) * 45 * parallaxFactor;
				const offsetY = (my - 0.5) * 45 * parallaxFactor;
				p.x += p.vx; p.y += p.vy; p.pulse += p.speed;
				
				if (p.x < -20) p.x = canvas.width + 20;
				if (p.x > canvas.width + 20) p.x = -20;
				if (p.y < -20) p.y = canvas.height + 20;
				if (p.y > canvas.height + 20) p.y = -20;

				const drawX = p.x + offsetX;
				const drawY = p.y + offsetY;
				const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.07;
				const drawSize = p.size * (0.8 + p.z * 0.35);

				ctx.beginPath();
				ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, pulseOpacity)})`;
				ctx.fill();

				// Ambient bloom per particle
				ctx.beginPath();
				ctx.arc(drawX, drawY, drawSize * 4, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, pulseOpacity * 0.1)})`;
				ctx.fill();
			});

			// ── Connections ──
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const ddx = particles[i].x - particles[j].x;
					const ddy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(ddx * ddx + ddy * ddy);
					if (dist < 110 && Math.abs(particles[i].z - particles[j].z) < 0.6) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(139, 92, 246, ${0.05 * (1 - dist / 110)})`;
						ctx.lineWidth = 0.4;
						ctx.stroke();
					}
				}
			}
			animationId = requestAnimationFrame(draw);
		};
		draw();
		return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
	}, [smoothX, smoothY]);

	const orb1X = useTransform(smoothX, [0, 1], [-50, 50]);
	const orb1Y = useTransform(smoothY, [0, 1], [-40, 40]);
	const orb2X = useTransform(smoothX, [0, 1], [40, -40]);
	const orb3X = useTransform(smoothX, [0, 1], [-30, 30]);

	return (
		<div className={`absolute inset-0 overflow-hidden ${className}`} style={{ backgroundColor: '#040409', perspective: '1200px' }}>
			{/* Mesh Aurora Bloom Background */}
			<div className="absolute inset-0 w-full h-full opacity-40">
				<div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-[100px] animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.12)_0%,transparent_70%)] blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
				<div className="absolute top-[30%] left-[20%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] blur-[100px] animate-pulse" style={{ animationDelay: '2.5s' }} />
			</div>

			<canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

			{/* Floating Glass Orbs */}
			<motion.div
				style={{ x: orb1X, y: orb1Y, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)' }}
				animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
				transition={{ duration: 15, repeat: Infinity }}
				className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl"
			/>
			<motion.div
				style={{ x: orb2X, y: orb1Y, background: 'radial-gradient(circle, rgba(217,70,239,0.08) 0%, transparent 60%)' }}
				animate={{ scale: [1.2, 0.9, 1.2], rotate: [0, -20, 0] }}
				transition={{ duration: 20, repeat: Infinity }}
				className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl"
			/>

			{/* Grain & Noise Overlay for Premium look */}
			<div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none bg-[url('https://res.cloudinary.com/dqr68f51j/image/upload/v1714400000/noise_ntn2m4.png')]" />

			{/* Cinematic vignette */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,4,9,0.5)_50%,rgba(4,4,9,0.98)_100%)] pointer-events-none" />
			
			{/* Scanlines (Dynamic) */}
			<div className="absolute inset-0 opacity-[0.015] pointer-events-none">
				<div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]" />
			</div>
		</div>
	);
}
