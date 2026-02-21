import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";
import ShinyText from "@/components/ShinyText";
import StarBorder from "@/components/StarBorder";
import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

interface TeamMember {
	id: number;
	name: string;
	role: string;
	designation: string;
	bio: string;
	image: string;
	socials: {
		github: string;
		linkedin: string;
		instagram: string;
	};
}

interface TeamCardProps {
	member: TeamMember;
	index: number;
}

const isValidLink = (link: string | undefined): boolean => {
	return !!link && link !== "#" && link.trim() !== "";
};

const createParticleElement = (x: number, y: number): HTMLDivElement => {
	const el = document.createElement('div');
	el.className = 'particle';
	el.style.cssText = `
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: rgba(0, 184, 113, 1);
		box-shadow: 0 0 8px rgba(0, 184, 113, 0.8);
		pointer-events: none;
		z-index: 50;
		left: ${x}px;
		top: ${y}px;
	`;
	return el;
};

export function TeamCard({ member, index }: TeamCardProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const particlesRef = useRef<HTMLDivElement[]>([]);
	const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const isHoveredRef = useRef(false);

	const clearAllParticles = useCallback(() => {
		timeoutsRef.current.forEach(clearTimeout);
		timeoutsRef.current = [];

		particlesRef.current.forEach(particle => {
			gsap.to(particle, {
				scale: 0,
				opacity: 0,
				duration: 0.3,
				ease: 'back.in(1.7)',
				onComplete: () => {
					particle.parentNode?.removeChild(particle);
				}
			});
		});
		particlesRef.current = [];
	}, []);

	const animateParticles = useCallback(() => {
		if (!cardRef.current || !isHoveredRef.current) return;

		const { width, height } = cardRef.current.getBoundingClientRect();
		const particleCount = 8;

		for (let i = 0; i < particleCount; i++) {
			const timeoutId = setTimeout(() => {
				if (!isHoveredRef.current || !cardRef.current) return;

				const particle = createParticleElement(
					Math.random() * width,
					Math.random() * height
				);
				cardRef.current.appendChild(particle);
				particlesRef.current.push(particle);

				gsap.fromTo(
					particle,
					{ scale: 0, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
				);

				gsap.to(particle, {
					x: (Math.random() - 0.5) * 80,
					y: (Math.random() - 0.5) * 80,
					rotation: Math.random() * 360,
					duration: 2 + Math.random() * 2,
					ease: 'none',
					repeat: -1,
					yoyo: true
				});

				gsap.to(particle, {
					opacity: 0.4,
					duration: 1.5,
					ease: 'power2.inOut',
					repeat: -1,
					yoyo: true
				});
			}, i * 80);

			timeoutsRef.current.push(timeoutId);
		}
	}, []);

	useEffect(() => {
		if (!cardRef.current) return;

		const element = cardRef.current;

		const handleMouseEnter = () => {
			isHoveredRef.current = true;
			animateParticles();

			gsap.to(element, {
				scale: 1.02,
				duration: 0.3,
				ease: 'power2.out'
			});
		};

		const handleMouseLeave = () => {
			isHoveredRef.current = false;
			clearAllParticles();

			gsap.to(element, {
				scale: 1,
				x: 0,
				y: 0,
				duration: 0.3,
				ease: 'power2.out'
			});
		};

		const handleMouseMove = (e: MouseEvent) => {
			const rect = element.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const deltaX = (x - centerX) / centerX;
			const deltaY = (y - centerY) / centerY;

			gsap.to(element, {
				x: deltaX * 8,
				y: deltaY * 8,
				duration: 0.3,
				ease: 'power2.out'
			});
		};

		element.addEventListener('mouseenter', handleMouseEnter);
		element.addEventListener('mouseleave', handleMouseLeave);
		element.addEventListener('mousemove', handleMouseMove);

		return () => {
			element.removeEventListener('mouseenter', handleMouseEnter);
			element.removeEventListener('mouseleave', handleMouseLeave);
			element.removeEventListener('mousemove', handleMouseMove);
			clearAllParticles();
		};
	}, [animateParticles, clearAllParticles]);

	const cardContent = (
		<div className="relative rounded-xl p-5 sm:p-6 hover-lift transition-all duration-300 overflow-hidden border border-primary/30 dark:border-border hover:border-primary/60 dark:hover:border-primary/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/15 dark:shadow-none">
			{/* Profile Info - Always visible on mobile, hover effect on desktop */}
			<div className="relative z-10 lg:group-hover:translate-y-full transition-transform duration-300">
				<div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-center">{member.image}</div>
				<h3 className="text-lg sm:text-xl font-poppins font-bold mb-1 text-center">
					<ShinyText
						text={member.name}
						speed={3}
						shineColor="#00B871"
						pauseOnHover={true}
					/>
				</h3>
				<p className="text-xs sm:text-sm text-primary font-semibold text-center mb-2">
					{member.designation}
				</p>
				<p className="text-xs text-muted-foreground text-center mb-3 sm:mb-4">
					{member.role}
				</p>
				<div className="h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent dark:via-primary mb-3 sm:mb-4" />

				{/* Show bio on mobile, hide on desktop (shown on hover) */}
				<p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4 line-clamp-3 lg:hidden">
					{member.bio}
				</p>
				<p className="text-xs sm:text-sm text-muted-foreground text-center hidden lg:block">
					Hover to learn more
				</p>

				{/* Social Links - Always visible on mobile */}
				<div className="flex gap-2 sm:gap-3 justify-center mt-3 sm:mt-4 lg:hidden">
					{isValidLink(member.socials.github) && (
						<a
							href={member.socials.github}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/25 dark:hover:bg-primary/35 active:scale-95 transition-all duration-300 border border-primary/30 dark:border-primary/25 hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/20"
							title="GitHub"
						>
							<Github className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform group-hover/social:scale-110" />
						</a>
					)}
					{isValidLink(member.socials.linkedin) && (
						<a
							href={member.socials.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/25 dark:hover:bg-primary/35 active:scale-95 transition-all duration-300 border border-primary/30 dark:border-primary/25 hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/20"
							title="LinkedIn"
						>
							<Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform group-hover/social:scale-110" />
						</a>
					)}
					{isValidLink(member.socials.instagram) && (
						<a
							href={member.socials.instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/25 dark:hover:bg-primary/35 active:scale-95 transition-all duration-300 border border-primary/30 dark:border-primary/25 hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/20"
							title="Instagram"
						>
							<Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform group-hover/social:scale-110" />
						</a>
					)}
				</div>
			</div>

			{/* Hover State Content - Desktop only */}
			<div className="hidden lg:flex absolute inset-0 p-5 sm:p-6 flex-col rounded-xl -translate-y-full group-hover:translate-y-0 transition-transform duration-300 border border-primary/40 dark:border-primary/30 shadow-lg dark:shadow-none z-10">
				<div className="text-3xl sm:text-4xl mb-2 text-center">
					{member.image}
				</div>
				<h3 className="text-base sm:text-lg font-poppins font-bold mb-1 text-center">
					{member.name}
				</h3>
				<p className="text-xs text-primary font-semibold text-center mb-3">
					{member.designation}
				</p>
				<div className="h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent dark:via-primary mb-3" />

				<div className="flex-1 overflow-y-auto custom-scrollbar">
					<p className="text-xs sm:text-sm text-muted-foreground text-center mb-4">
						{member.bio}
					</p>
				</div>

				<div className="flex gap-2 sm:gap-3 justify-center mt-3">
					{isValidLink(member.socials.github) && (
						<a
							href={member.socials.github}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/25 dark:hover:bg-primary/35 active:scale-95 transition-all duration-300 border border-primary/30 dark:border-primary/25 hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/20"
							title="GitHub"
						>
							<Github className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform group-hover/social:scale-110" />
						</a>
					)}
					{isValidLink(member.socials.linkedin) && (
						<a
							href={member.socials.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/25 dark:hover:bg-primary/35 active:scale-95 transition-all duration-300 border border-primary/30 dark:border-primary/25 hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/20"
							title="LinkedIn"
						>
							<Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform group-hover/social:scale-110" />
						</a>
					)}
					{isValidLink(member.socials.instagram) && (
						<a
							href={member.socials.instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/25 dark:hover:bg-primary/35 active:scale-95 transition-all duration-300 border border-primary/30 dark:border-primary/25 hover:border-primary/50 shadow-sm hover:shadow-md hover:shadow-primary/20"
							title="Instagram"
						>
							<Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform group-hover/social:scale-110" />
						</a>
					)}
				</div>
			</div>
		</div>
	);

	return (
		<div
			ref={cardRef}
			className="group relative"
			style={{
				animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
			}}
		>
			{/* Card Background Gradient - GPU Accelerated - Green in light mode */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/30 to-secondary/40 dark:from-primary/25 dark:to-secondary/25 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ filter: 'blur(24px)', transform: 'translateZ(0)', willChange: 'opacity, filter' }} />

			<StarBorder
				as="div"
				color="#00B871"
				speed="8s"
				thickness={2}
				className="w-full"
			>
				<div className="relative rounded-xl">
					{cardContent}
				</div>
			</StarBorder>
		</div>
	);
}
