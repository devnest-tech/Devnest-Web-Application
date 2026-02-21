import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/DAeJBINDPNI64g6zV0b2TF";
const CONTACT_EMAILS = [
	"devnest.techclub@gmail.com",
] as const;
const PAYMENT_QR_ENDPOINT = "/api/payment-qr";

const normalizeRoll = (roll?: string | null) => roll?.trim().toLowerCase() ?? "";

export type ByteBloomFormValues = {
	fullName: string;
	rollNumber: string;
	department: string;
	whatsappNumber: string;
	email: string;
	participationType: "individual" | "team";
	teamName: string;
	teamMember2: string;
	teamMember2Roll: string;
	transactionId: string;
	joinedWhatsapp: boolean;
	notes: string;
};

const bytebloomDefaultValues: ByteBloomFormValues = {
	fullName: "",
	rollNumber: "",
	department: "",
	whatsappNumber: "",
	email: "",
	participationType: "individual",
	teamName: "",
	teamMember2: "",
	teamMember2Roll: "",
	transactionId: "",
	joinedWhatsapp: false,
	notes: "",
};

export const ByteBloomRegistrationForm = () => {
	const { toast } = useToast();
	const [status, setStatus] = useState<"idle" | "loading">("idle");
	const [qrStatus, setQrStatus] = useState<"loading" | "loaded" | "error">("loading");
	const [qrSrc, setQrSrc] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const qrObjectUrlRef = useRef<string | null>(null);
	const isMountedRef = useRef(true);

	const form = useForm<ByteBloomFormValues>({
		defaultValues: bytebloomDefaultValues,
	});

	const participationType = useWatch({ control: form.control, name: "participationType" });

	const markRollConflicts = useCallback(
		(conflicts: string[]) => {
			const normalizedConflicts = conflicts
				.map((roll) => normalizeRoll(roll))
				.filter((roll) => roll.length > 0);

			if (!normalizedConflicts.length) {
				return;
			}

			const values = form.getValues();
			const rollFields: Array<{
				field: keyof ByteBloomFormValues;
				value: string;
			}> = [
					{ field: "rollNumber", value: values.rollNumber },
					{ field: "teamMember2Roll", value: values.teamMember2Roll },
				];

			rollFields.forEach(({ field, value }) => {
				if (value && normalizedConflicts.includes(normalizeRoll(value))) {
					form.setError(field, {
						type: "manual",
						message: "This roll number is already registered.",
					});
				}
			});
		},
		[form],
	);

	const loadPaymentQr = useCallback(async () => {
		try {
			setQrStatus("loading");
			setQrSrc(null);
			const response = await fetch(PAYMENT_QR_ENDPOINT);
			if (!response.ok) {
				throw new Error("Failed to fetch payment QR");
			}
			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);
			if (!isMountedRef.current) {
				URL.revokeObjectURL(objectUrl);
				return;
			}
			if (qrObjectUrlRef.current) {
				URL.revokeObjectURL(qrObjectUrlRef.current);
			}
			qrObjectUrlRef.current = objectUrl;
			setQrSrc(objectUrl);
			setQrStatus("loaded");
		} catch (error) {
			if (!isMountedRef.current) {
				return;
			}
			console.error("Payment QR load error", error);
			setQrStatus("error");
			setQrSrc(null);
		}
	}, []);

	useEffect(() => {
		isMountedRef.current = true;
		loadPaymentQr();

		return () => {
			isMountedRef.current = false;
			if (qrObjectUrlRef.current) {
				URL.revokeObjectURL(qrObjectUrlRef.current);
				qrObjectUrlRef.current = null;
			}
		};
	}, [loadPaymentQr]);

	useEffect(() => {
		if (participationType === "individual") {
			form.setValue("teamName", "");
			form.setValue("teamMember2", "");
			form.setValue("teamMember2Roll", "");
		}
	}, [participationType, form]);

	const onSubmit = async (values: ByteBloomFormValues) => {
		setStatus("loading");
		try {
			const response = await fetch("/api/promptathon", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...values,
					submittedAt: new Date().toISOString(),
				}),
			});

			if (!response.ok) {
				let errorMessage = "Unable to submit form";
				let handled = false;
				try {
					const errorData = await response.json();
					if (errorData?.message) {
						errorMessage = errorData.message;
					}
					if (Array.isArray(errorData?.conflicts) && errorData.conflicts.length > 0) {
						markRollConflicts(errorData.conflicts as string[]);
						handled = true;
						errorMessage = `${errorMessage} (Conflicts: ${errorData.conflicts.join(", ")})`;
					}
				} catch (parseError) {
					console.error("ByteBloom hackfest error payload parse", parseError);
				}

				if (handled) {
					toast({
						title: "Submission blocked",
						description: errorMessage,
						variant: "destructive",
					});
					return;
				}

				throw new Error(errorMessage);
			}

			toast({
				title: "Registration received!",
				description: "We will reach out with next steps soon.",
			});

			form.reset(bytebloomDefaultValues);
		} catch (error) {
			console.error("Promptathon submission error", error);
			const fallbackMessage = "Please try again or email us at devnest.techclub@gmail.com.";
			const description =
				error instanceof Error && error.message ? error.message : fallbackMessage;
			toast({
				title: "Submission failed",
				description,
				variant: "destructive",
			});
		} finally {
			setStatus("idle");
		}
	};

	return (
		<section
			id="promptathon-form"
			className="glass-effect rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl"
		>
			<div className="text-center max-w-3xl mx-auto mb-10">
				<span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-4">
					Promptathon | Registration
				</span>
				<h2 className="text-3xl font-poppins font-bold mb-3">
					Register for Promptathon
				</h2>
				<p className="text-muted-foreground">
					Fill in your details to participate. You can register as an individual or as a team (max 2 members).
					Fields marked with * are mandatory.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
					<div className="space-y-4">
						<div>
							<h3 className="text-xl font-semibold">Participant Details</h3>
							<p className="text-sm text-muted-foreground">
								We'll use this information to contact you about the event.
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="fullName"
								rules={{ required: "Name is required" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name *</FormLabel>
										<FormControl>
											<Input placeholder="Your full name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rollNumber"
								rules={{ required: "Roll number is required" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>University Roll No *</FormLabel>
										<FormControl>
											<Input placeholder="241000X00XX" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="department"
								rules={{ required: "Department & year is required" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department *</FormLabel>
										<FormControl>
											<Input placeholder="e.g., Computer Science" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="whatsappNumber"
								rules={{
									required: "WhatsApp number is required",
									pattern: {
										value: /^[6-9]\d{9}$/,
										message: "Enter a valid 10-digit mobile number",
									},
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>WhatsApp Number *</FormLabel>
										<FormControl>
											<Input placeholder="9876543210" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								rules={{
									required: "Email is required",
									pattern: {
										value:
											/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/,
										message: "Enter a valid email address",
									},
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address *</FormLabel>
										<FormControl>
											<Input type="email" placeholder="you@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<h3 className="text-xl font-semibold">Participation Type</h3>
							<p className="text-sm text-muted-foreground">
								Choose whether you want to participate individually or as a team (max 2 members).
							</p>
						</div>
						<FormField
							control={form.control}
							name="participationType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>I want to participate as *</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select participation type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="individual">Individual</SelectItem>
											<SelectItem value="team">Team (2 members)</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{participationType === "team" && (
						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold">Team Details</h3>
								<p className="text-sm text-muted-foreground">
									Provide your team name and second member details.
								</p>
							</div>
							<FormField
								control={form.control}
								name="teamName"
								rules={{
									required: participationType === "team" ? "Team name is required" : false,
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Team Name *</FormLabel>
										<FormControl>
											<Input placeholder="Choose a creative team name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="teamMember2"
									rules={{
										required: participationType === "team" ? "Team member name is required" : false,
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Team Member 2 Name *</FormLabel>
											<FormControl>
												<Input placeholder="Full name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="teamMember2Roll"
									rules={{
										required: participationType === "team" ? "Roll number is required" : false,
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Team Member 2 Roll No *</FormLabel>
											<FormControl>
												<Input placeholder="241000X00XX" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					)}

					<div className="space-y-4">
						<div>
							<h3 className="text-xl font-semibold">Payment Details</h3>
							<p className="text-sm text-muted-foreground">
								Scan the QR code below to complete payment and enter your transaction ID.
							</p>
						</div>
						<div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] items-start">
							<div className="space-y-6">
								<FormField
									control={form.control}
									name="transactionId"
									rules={{ required: "Transaction / UPI reference is required" }}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Transaction / UPI Reference ID *</FormLabel>
											<FormControl>
												<Input placeholder="UPI12345" {...field} />
											</FormControl>
											<FormDescription>
												You will find this in your payment success screen or SMS/email notification.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="notes"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Notes / Special Requests</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Anything we should know? Dietary needs, travel info, etc."
													className="min-h-[110px]"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="joinedWhatsapp"
									rules={{ validate: (value) => (value ? true : "Please join the WhatsApp group") }}
									render={({ field }) => (
										<FormItem className="flex flex-row items-start gap-3 rounded-2xl border border-border/60 p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={(checked) => field.onChange(checked === true)}
												/>
											</FormControl>
											<div className="space-y-1 text-sm leading-tight">
												<FormLabel className="font-semibold">Joined the official WhatsApp group *</FormLabel>
												<p className="text-muted-foreground">
													Tap the link to stay updated: <Link href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer" className="text-primary underline">ByteBloom hackfest WhatsApp Lobby</Link>
												</p>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="glass-effect rounded-3xl border border-border/40 p-6 text-center">
								<p className="text-sm text-muted-foreground mb-3">Scan & pay ₹100 / participant</p>
								<div className="mx-auto flex min-h-[320px] w-full max-w-xs items-center justify-center rounded-xl border border-primary/40 bg-muted/40 p-3">
									{qrStatus === "loading" && (
										<Loader2 className="h-6 w-6 animate-spin text-primary" />
									)}
									{qrStatus === "error" && (
										<div className="space-y-3 text-sm text-muted-foreground">
											<p>Unable to load the QR right now.</p>
											<Button size="sm" variant="outline" onClick={loadPaymentQr}>
												Try again
											</Button>
										</div>
									)}
									{qrStatus === "loaded" && qrSrc && (
										<Image
											src={qrSrc}
											alt="Promptathon payment QR"
											width={320}
											height={320}
											className="h-auto w-full rounded-xl"
											unoptimized
										/>
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-3">
									If prompted, confirm the receiver name shows DevNest Technical Club before completing the transfer.
								</p>
								<div className="mt-4 flex flex-col gap-3 text-sm">
									<Button asChild variant="outline" className="gap-2">
										<Link href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer">
											Join WhatsApp Lobby
										</Link>
									</Button>
									<Button asChild variant="ghost" className="gap-2">
										<Link href={`mailto:${CONTACT_EMAILS[0]}`}>
											Need help? Email us
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4 pt-8 border-t border-border/60">
						<div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
							Uploading the wrong payment or incomplete team details may delay verification. Double-check everything before you hit submit.
						</div>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-sm text-muted-foreground">
								By submitting, you agree to ByteBloom hackfest guidelines and consent to DevNest contacting you via email/WhatsApp.
							</p>
							<Button type="submit" className="gap-2" disabled={status === "loading"}>
								{status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
								Submit Registration
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</section>
	);
};
