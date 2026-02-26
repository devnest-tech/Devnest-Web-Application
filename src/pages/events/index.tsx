import { useState } from "react";
import Link from "next/link";
import { Award, Calendar, Clock, MapPin, Users, Zap, CalendarDays } from "lucide-react";

import Head from "next/head";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ShinyText";

const upcomingEvents: Array<{
	id: number;
	title: string;
	date: string;
	time: string;
	location: string;
	description: string;
	domains: string[];
	capacity: string;
	highlights: string[];
	status: "open" | "closed";
	icon: string;
	registrationUrl: string;
	learnMoreUrl: string;
}> = [];

const pastEvents = [
	{
		id: 1,
		title: "Promptathon in Yuva Kaushal",
		date: "February 25, 2025",
		attendees: "68",
		highlight: "A grand success! Students showcased exceptional AI prompt engineering skills, pushing the boundaries of AI communication and critical thinking.",
		icon: "⚡",
		link: "/events/promptathon-2026",
	},
	{
		id: 2,
		title: "Guest Speaker Event",
		date: "February 5, 2026",
		attendees: "150+",
		highlight: "Inspiring session with Amit Kumar Jaiswal, IIM Bangalore graduate and founder of aptitude360online",
		icon: <span className="emoji-white">🎤</span>,
		link: "/events/guest-speaker-feb",
	},
];

export default function EventsPage() {
	const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

	return (
		<Layout>
			<Head><title>DevNest | Events</title></Head>
			<div className="relative min-h-screen py-20">
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<header className="text-center mb-16">
						<div className="mb-6 inline-block">
							<span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
								<span className="emoji-white">🎉</span> DevNest Events Calendar
							</span>
						</div>
						<h1 className="text-5xl sm:text-6xl font-poppins font-bold mb-4">
							<ShinyText text="Events & Hackathons" className="glow-text" speed={2} />
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Join our community events, hackathons, workshops, and tech talks throughout the year. Build, collaborate, and innovate with us!
						</p>

						{/* Schedule Banner */}
						<div className="mt-8 mx-auto max-w-3xl">
							<Link href="/events/schedule">
								<div className="glass-effect rounded-xl p-6 hover-lift transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/40">
									<div className="flex items-center justify-center gap-3 mb-2">
										<CalendarDays className="w-6 h-6 text-primary" />
										<h2 className="text-xl font-bold text-primary">
											View Complete 2026 Event Schedule
										</h2>
									</div>
									<p className="text-sm text-muted-foreground">
										February - June 2026 • 5 Major Events • Guest Lectures, Hackathons, Datathons & More
									</p>
								</div>
							</Link>
						</div>
					</header>

					<div className="flex justify-center gap-4 mb-12 flex-wrap">
						<Button
							onClick={() => setActiveTab("upcoming")}
							variant={activeTab === "upcoming" ? "default" : "outline"}
							className="gap-2"
						>
							<Calendar className="w-4 h-4" />
							Upcoming Events
						</Button>
						<Button
							onClick={() => setActiveTab("past")}
							variant={activeTab === "past" ? "default" : "outline"}
							className="gap-2"
						>
							<Award className="w-4 h-4" />
							Past Events
						</Button>
					</div>

					{activeTab === "upcoming" && (
						<div className="space-y-12">
							{upcomingEvents.length === 0 ? (
								<div className="glass-effect rounded-xl p-12 text-center">
									<CalendarDays className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
									<h3 className="text-2xl font-poppins font-bold mb-2">
										No Upcoming Events
									</h3>
									<p className="text-muted-foreground max-w-md mx-auto">
										We're planning some exciting events! Check back soon for updates, or view our past events to see what we've been up to.
									</p>
									<Button
										onClick={() => setActiveTab("past")}
										className="mt-6 gap-2"
									>
										<Award className="w-4 h-4" />
										View Past Events
									</Button>
								</div>
							) : (
								upcomingEvents.map((event) => (
									<article
										key={event.id}
										className="glass-effect rounded-xl overflow-hidden hover-lift transition-all hover:bg-primary/5"
									>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
											<div className="md:col-span-2">
												<div className="flex items-start gap-4 mb-4">
													<div className="text-5xl" aria-hidden>
														{event.icon}
													</div>
													<div className="flex-1">
														<h2 className="text-3xl font-poppins font-bold mb-2">
															{event.title}
														</h2>
														<div className="flex flex-wrap gap-2 mb-4">
															{event.domains.map((domain, idx) => (
																<span
																	key={`${domain}-${idx}`}
																	className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
																>
																	{domain}
																</span>
															))}
														</div>
													</div>
												</div>

												<p className="text-muted-foreground mb-6 leading-relaxed">
													{event.description}
												</p>

												<dl className="grid grid-cols-2 gap-4 mb-6 text-sm text-muted-foreground">
													<div className="flex items-center gap-2">
														<Clock className="w-5 h-5 text-primary" />
														<span>
															{event.date} • {event.time}
														</span>
													</div>
													<div className="flex items-center gap-2">
														<MapPin className="w-5 h-5 text-primary" />
														<span>{event.location}</span>
													</div>
													<div className="flex items-center gap-2">
														<Users className="w-5 h-5 text-secondary" />
														<span>{event.capacity}</span>
													</div>
													<div className="flex items-center gap-2">
														<Zap className="w-5 h-5 text-secondary" />
														<span>{event.highlights.length} highlight perks</span>
													</div>
												</dl>

												<div>
													<h3 className="font-poppins font-bold mb-3 text-base">
														What to expect:
													</h3>
													<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
														{event.highlights.map((highlight, idx) => (
															<li key={`${highlight}-${idx}`} className="flex items-center gap-2">
																<span className="text-primary">✓</span>
																{highlight}
															</li>
														))}
													</ul>
												</div>
											</div>

											<div className="md:col-span-1 flex flex-col items-center justify-center gap-4 p-6 bg-primary/10 rounded-lg text-center">
												<div>
													<div className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-bold mb-4">
														{event.status === "open"
															? <><span className="emoji-white">🎯</span> Registrations Open</>
															: <><span className="emoji-white">🔔</span> Coming Soon</>}
													</div>
													<p className="text-sm text-muted-foreground">
														{event.status === "open"
															? "Limited seats, secure your slot now!"
															: "Stay tuned for registration details."}
													</p>
												</div>
												{event.status === "open" ? (
													<>
														<Button
															asChild
															className="w-full bg-primary hover:bg-primary/90 gap-2"
														>
															<Link href={event.registrationUrl}>
																<Zap className="w-4 h-4" />
																Register on DevNest
															</Link>
														</Button>
														<Link
															href={event.learnMoreUrl}
															className="text-sm text-primary hover:underline"
														>
															Explore the Promptathon hub →
														</Link>
													</>
												) : (
													<Button className="w-full" disabled>
														Registration Closed
													</Button>
												)}
											</div>
										</div>
									</article>
								))
							)}
						</div>
					)}

					{activeTab === "past" && (
						<div className="space-y-6">
							<div className="text-center mb-8">
								<p className="text-lg text-muted-foreground">
									Check out the amazing events we've hosted!
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{pastEvents.map((event) => (
									<Link key={event.id} href={event.link}>
										<article className="glass-effect rounded-lg p-6 hover-lift transition-all cursor-pointer hover:border-primary/50 border border-transparent h-full">
											<div className="flex items-start gap-4 mb-4">
												<div className="text-4xl" aria-hidden>
													{event.icon}
												</div>
												<div className="flex-1">
													<h3 className="font-poppins font-bold mb-1">
														{event.title}
													</h3>
													<p className="text-sm text-muted-foreground">
														{event.date}
													</p>
												</div>
											</div>
											<p className="text-muted-foreground text-sm mb-4">
												{event.highlight}
											</p>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2 text-sm text-primary font-semibold">
													<Users className="w-4 h-4" />
													{event.attendees} attended
												</div>
												<span className="text-sm text-primary">View →</span>
											</div>
										</article>
									</Link>
								))}
							</div>
						</div>
					)}

					<section className="mt-16 text-center">
						<div className="glass-effect rounded-xl p-8 max-w-2xl mx-auto">
							<h2 className="text-2xl font-poppins font-bold mb-4">
								Don't miss out on innovation!
							</h2>
							<p className="text-muted-foreground mb-6">
								Subscribe to our newsletter and join our community to get updates on upcoming events, workshops, and hackathons.
							</p>
							<div className="flex gap-4 justify-center flex-wrap">
								<Button className="bg-primary hover:bg-primary/90 gap-2">
									Subscribe to Updates
								</Button>
								<a
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button variant="outline" className="gap-2">
										Follow on Instagram
									</Button>
								</a>
							</div>
						</div>
					</section>
				</div>
			</div>
		</Layout>
	);
}
