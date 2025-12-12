import type { NextApiRequest, NextApiResponse } from "next";

import {
	appendHackverseSubmission,
	getExistingRollConflicts,
	persistPaymentProofFile,
	type HackverseSubmissionRecord,
} from "../../../server/hackverse-storage";

const requiredFields: Array<keyof HackverseSubmissionRecord | "paymentProofBase64"> = [
	"submittedAt",
	"fullName",
	"rollNumber",
	"department",
	"whatsappNumber",
	"email",
	"teamName",
	"teamSize",
	"participant2",
	"participant2Roll",
	"transactionId",
	"paymentProofBase64",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ message: "Method not allowed" });
	}

	const payload = req.body as Partial<HackverseSubmissionRecord> & {
		paymentProofBase64?: string | null;
		paymentProofName?: string | null;
		paymentProofType?: string | null;
	};

	const missing = requiredFields.filter((field) => {
		if (field === "paymentProofBase64") {
			return !payload.paymentProofBase64;
		}
		const value = payload[field];
		return typeof value === "undefined" || value === null || value === "";
	});

	if (missing.length > 0) {
		return res.status(400).json({
			message: `Missing required fields: ${missing.join(", ")}`,
		});
	}

	const incomingRolls = [
		payload.rollNumber,
		payload.participant2Roll,
		payload.participant3Roll,
		payload.participant4Roll,
	].filter((roll) => !!roll);

	const conflicts = getExistingRollConflicts(incomingRolls as string[]);
	if (conflicts.length > 0) {
		return res.status(409).json({
			message: "One or more roll numbers are already registered.",
			conflicts,
		});
	}

	try {
		const { storedPath, mimeType } = persistPaymentProofFile(
			payload.paymentProofBase64 ?? null,
			payload.paymentProofName ?? null,
			payload.paymentProofType ?? null,
		);

		const record: HackverseSubmissionRecord = {
			submittedAt: payload.submittedAt!,
			fullName: payload.fullName!,
			rollNumber: payload.rollNumber!,
			department: payload.department!,
			whatsappNumber: payload.whatsappNumber!,
			email: payload.email!,
			teamName: payload.teamName!,
			teamSize: payload.teamSize as "2" | "3" | "4",
			participant2: payload.participant2!,
			participant2Roll: payload.participant2Roll!,
			participant3: payload.participant3 ?? "",
			participant3Roll: payload.participant3Roll ?? "",
			participant4: payload.participant4 ?? "",
			participant4Roll: payload.participant4Roll ?? "",
			transactionId: payload.transactionId!,
			notes: payload.notes ?? "",
			paymentProofFile: storedPath,
			paymentProofType: mimeType,
		};

		appendHackverseSubmission(record);

		return res.status(200).json({ message: "Submission stored" });
	} catch (error) {
		console.error("HackVerse API error", error);
		return res.status(500).json({ message: "Failed to save submission" });
	}
}
