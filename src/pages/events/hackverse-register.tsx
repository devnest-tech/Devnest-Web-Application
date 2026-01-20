import { Layout } from "@/components/Layout";
import { HackverseRegistrationForm } from "@/components/HackverseRegistrationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HackverseRegistrationPage() {
	return (
		<Layout>
			<div className="min-h-screen bg-gradient-to-b from-background to-muted/40 py-16">
				<div className="mx-auto max-w-6xl px-4 sm:px-6">
					<div className="mb-8">
						<Button asChild variant="ghost" className="gap-2">
							<Link href="/events/hackverse">
								<ArrowLeft className="h-4 w-4" />
								Back to Event Details
							</Link>
						</Button>
					</div>
					<HackverseRegistrationForm />
				</div>
			</div>
		</Layout>
	);
}
