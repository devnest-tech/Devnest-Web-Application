import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock3, MapPin, Sparkles, Trophy, Users } from "lucide-react";

import { Layout } from "@/components/Layout";
import Particles from "@/components/Particles";
import { Button } from "@/components/ui/button";

const EVENT_META = {
	title: "DataDash",
	tagline: "Where Data Meets Innovation",
	venue: "IBM Lab",
	date: "10 April 2026",
	time: "10:00 AM onwards",
	prize: "Big Cash Prize Pool",
	participants: "153",
	teams: "46",
};

const DATADASH_PALETTE = {
	sapphire: "#2a44ff",
	neonBlue: "#6a7dff",
	neonPurple: "#8f4fff",
	neonMagenta: "#f44eff",
	lavender: "#d8b4fe",
	orchid: "#c084fc",
	amber: "#ffca45",
};

const infoCards = [
	{ label: "Venue", value: EVENT_META.venue, icon: MapPin },
	{ label: "Date", value: EVENT_META.date, icon: Calendar },
	{ label: "Time", value: EVENT_META.time, icon: Clock3 },
];

const eventMilestones = [
	"153 participants registered across 46 teams",
	"Data-first challenge tracks focused on impact and clarity",
	"Winners pending official announcement",
];

export default function DataDashEventPage() {
	const pageRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: pageRef,
		offset: ["start start", "end end"],
	});

	const orbOneY = useTransform(scrollYProgress, [0, 1], [0, -360]);
	const orbTwoY = useTransform(scrollYProgress, [0, 1], [0, -260]);
	const heroY = useTransform(scrollYProgress, [0, 1], [0, -180]);
	const infoY = useTransform(scrollYProgress, [0, 1], [0, -100]);
	const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

	return (
		<Layout pauseTerminal customTheme="violet">
			<Head>
				<title>DevNest | DataDash</title>
				<style>{`
					.datadash-neo {
						background: rgba(255, 255, 255, 0.85);
						border: 1px solid rgba(143, 79, 255, 0.2);
						box-shadow: 10px 10px 24px rgba(12, 22, 56, 0.12), -8px -8px 22px rgba(255, 255, 255, 0.75);
					}
					.dark .datadash-neo {
						background: rgba(8, 10, 20, 0.72);
						border: 1px solid rgba(168, 85, 247, 0.35);
						box-shadow: 10px 10px 24px rgba(0, 0, 0, 0.45), -8px -8px 20px rgba(36, 49, 88, 0.28);
					}
				`}</style>
			</Head>

			<div ref={pageRef} className="relative min-h-screen overflow-hidden py-16">
				<div className="pointer-events-none absolute inset-0 z-0">
					<Particles
						particleColors={[
							DATADASH_PALETTE.lavender,
							DATADASH_PALETTE.orchid,
							DATADASH_PALETTE.neonPurple,
						]}
						particleCount={200}
						particleSpread={10}
						speed={0.1}
						particleBaseSize={100}
						moveParticlesOnHover
						alphaParticles={false}
						disableRotation={false}
						pixelRatio={1}
						className="h-full w-full"
					/>
				</div>
				<div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-background/20 to-background/70" />
				<motion.div
					className="pointer-events-none absolute -left-24 top-20 z-[2] h-72 w-72 rounded-full opacity-50 blur-3xl"
					style={{
						y: orbOneY,
						background: `radial-gradient(circle, ${DATADASH_PALETTE.neonBlue}66 0%, transparent 70%)`,
					}}
				/>
				<motion.div
					className="pointer-events-none absolute -right-24 top-36 z-[2] h-80 w-80 rounded-full opacity-45 blur-3xl"
					style={{
						y: orbTwoY,
						background: `radial-gradient(circle, ${DATADASH_PALETTE.neonPurple}77 0%, transparent 72%)`,
					}}
				/>

				<section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
					<motion.div style={{ y: heroY }}>
						<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
							<Sparkles className="h-4 w-4" />
							DataDash 2026 Event Hub
						</div>
						<h1 className="text-4xl sm:text-5xl font-poppins font-bold mb-3">
							{EVENT_META.title}
						</h1>
						<p className="text-muted-foreground text-lg mb-6">
							{EVENT_META.tagline}
						</p>

						<div className="mb-8 rounded-2xl border border-amber-300/40 bg-amber-500/10 px-5 py-4 text-foreground datadash-neo">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Event Update</p>
							<p className="mt-2 text-base font-semibold">
								DataDash 2026 has concluded. Winner announcement will be shared soon.
							</p>
						</div>

						<div className="relative mb-10 h-[460px] overflow-hidden rounded-3xl datadash-neo">
							<div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-background/35 to-background/95" />
							<div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
								<p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">DevNest Presents</p>
								<h2 className="text-5xl font-poppins font-extrabold tracking-tight text-transparent sm:text-7xl"
									style={{
										backgroundImage: `linear-gradient(90deg, ${DATADASH_PALETTE.neonBlue} 0%, ${DATADASH_PALETTE.neonPurple} 55%, ${DATADASH_PALETTE.neonMagenta} 100%)`,
										WebkitBackgroundClip: "text",
									}}
								>
									{EVENT_META.title}
								</h2>
								<p className="mt-4 max-w-2xl text-lg text-foreground/90">{EVENT_META.tagline}</p>
							</div>
						</div>

						<motion.div className="grid gap-4 sm:grid-cols-3" style={{ y: infoY }}>
							{infoCards.map((card) => (
								<div
									key={card.label}
									className="rounded-2xl p-5 datadash-neo"
								>
									<div className="mb-2 flex items-center gap-2 text-violet-300">
										<card.icon className="h-5 w-5" />
										<span className="text-xs font-semibold uppercase tracking-[0.2em]">{card.label}</span>
									</div>
									<p className="text-xl font-poppins font-semibold">{card.value}</p>
								</div>
							))}
						</motion.div>

						<motion.div className="mt-4 grid gap-4 sm:grid-cols-2" style={{ y: infoY }}>
							<div className="rounded-2xl p-5 text-center datadash-neo">
								<div className="flex items-center justify-center gap-2 text-violet-300">
									<Users className="h-4 w-4" />
									<p className="text-xs font-semibold uppercase tracking-[0.18em]">Participants</p>
								</div>
								<p className="mt-2 text-4xl font-poppins font-black">{EVENT_META.participants}</p>
							</div>
							<div className="rounded-2xl p-5 text-center datadash-neo">
								<div className="flex items-center justify-center gap-2 text-violet-300">
									<Trophy className="h-4 w-4" />
									<p className="text-xs font-semibold uppercase tracking-[0.18em]">Teams</p>
								</div>
								<p className="mt-2 text-4xl font-poppins font-black">{EVENT_META.teams}</p>
							</div>
						</motion.div>
					</motion.div>

					<motion.div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" style={{ y: contentY }}>
						<div className="rounded-3xl p-7 datadash-neo">
							<p className="text-sm uppercase tracking-[0.25em] text-violet-300">Theme</p>
							<h3 className="mt-3 text-3xl font-poppins font-bold sm:text-4xl">
								Where Data, Tech, and Innovation Collide
							</h3>
							<p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
								DataDash brought builders, analysts, and curious problem-solvers into one arena.
								From data storytelling to practical insights, participants explored how meaningful
								thinking transforms raw information into impact.
							</p>
							<div className="mt-6 flex flex-wrap gap-3">
								<Button asChild className="bg-violet-600 text-white hover:bg-violet-500">
									<Link href="/events">Explore All Events</Link>
								</Button>
								<Button asChild variant="outline" className="border-violet-300/60 text-violet-200 hover:bg-violet-500/10">
									<Link href="mailto:devnest.techclub@gmail.com">Connect with DevNest</Link>
								</Button>
							</div>
						</div>

						<div className="rounded-3xl p-7 datadash-neo">
							<div className="flex items-center gap-3 text-violet-300">
								<Trophy className="h-6 w-6" />
								<p className="text-xs font-semibold uppercase tracking-[0.2em]">Recognition</p>
							</div>
							<p className="mt-4 text-3xl font-poppins font-black sm:text-4xl"
								style={{ color: DATADASH_PALETTE.amber }}
							>
								{EVENT_META.prize}
							</p>
							<p className="mt-4 text-muted-foreground">
								The event is complete and results are under final review.
								Winners have not been announced yet and will be published officially soon.
							</p>
						</div>
					</motion.div>

					<motion.div className="mt-12 rounded-3xl p-6 sm:p-8 datadash-neo" style={{ y: contentY }}>
						<p className="text-sm uppercase tracking-[0.25em] text-violet-300">Milestones</p>
						<div className="mt-5 grid gap-4 md:grid-cols-3">
							{eventMilestones.map((milestone) => (
								<div key={milestone} className="rounded-2xl border border-violet-300/30 bg-violet-500/5 p-4">
									<p className="text-sm leading-relaxed text-foreground/90">{milestone}</p>
								</div>
							))}
						</div>
					</motion.div>
				</section>
			</div>
		</Layout>
	);
}