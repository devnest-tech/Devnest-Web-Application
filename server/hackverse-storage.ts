import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIR = path.join(process.cwd(), "server", "data");
const UPLOAD_DIR = path.join(process.cwd(), "server", "uploads", "hackverse");
const CSV_PATH = path.join(DATA_DIR, "hackverse-submissions.csv");

const CSV_HEADERS = [
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
	"participant3",
	"participant3Roll",
	"participant4",
	"participant4Roll",
	"transactionId",
	"notes",
	"paymentProofFile",
	"paymentProofType",
];

const HEADER_INDEX = CSV_HEADERS.reduce<Record<string, number>>((acc, header, index) => {
	acc[header] = index;
	return acc;
}, {});

export type HackverseSubmissionRecord = {
	submittedAt: string;
	fullName: string;
	rollNumber: string;
	department: string;
	whatsappNumber: string;
	email: string;
	teamName: string;
	teamSize: "2" | "3" | "4";
	participant2: string;
	participant2Roll: string;
	participant3: string;
	participant3Roll: string;
	participant4: string;
	participant4Roll: string;
	transactionId: string;
	notes: string;
	paymentProofFile: string | null;
	paymentProofType: string | null;
};

const ensureDirectories = () => {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}
	if (!fs.existsSync(UPLOAD_DIR)) {
		fs.mkdirSync(UPLOAD_DIR, { recursive: true });
	}
};

const ensureCsvExists = () => {
	ensureDirectories();
	if (!fs.existsSync(CSV_PATH)) {
		fs.writeFileSync(`${CSV_PATH}`, `${CSV_HEADERS.join(",")}\n`, "utf8");
	}
};

const sanitizeForCsv = (value: string | null | undefined) => {
	if (!value) {
		return "";
	}
	return value.replace(/"/g, '""');
};

const toCsvRow = (record: HackverseSubmissionRecord) => {
	const cells = CSV_HEADERS.map((header) => {
		const value = record[header as keyof HackverseSubmissionRecord];
		return `"${sanitizeForCsv(value as string | null | undefined)}"`;
	});
	return cells.join(",");
};

const parseCsvLine = (line: string) => {
	const values: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i += 1) {
		const char = line[i];
		if (char === '"') {
			const nextChar = line[i + 1];
			if (inQuotes && nextChar === '"') {
				current += '"';
				i += 1;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === "," && !inQuotes) {
			values.push(current);
			current = "";
		} else {
			current += char;
		}
	}
	values.push(current);
	return values;
};

const normalizeRoll = (roll?: string | null) => roll?.trim().toLowerCase() ?? "";

export const getExistingRollConflicts = (rolls: string[]) => {
	ensureCsvExists();
	if (!fs.existsSync(CSV_PATH)) {
		return [];
	}

	const normalizedIncoming = new Set(
		rolls.map(normalizeRoll).filter((roll) => roll.length > 0),
	);

	if (normalizedIncoming.size === 0) {
		return [];
	}

	const csvContent = fs.readFileSync(CSV_PATH, "utf8");
	const lines = csvContent.split(/\r?\n/).filter(Boolean);
	const conflicts = new Set<string>();

	for (let i = 1; i < lines.length; i += 1) {
		const columns = parseCsvLine(lines[i]);
		const existingRolls = [
			columns[HEADER_INDEX.rollNumber],
			columns[HEADER_INDEX.participant2Roll],
			columns[HEADER_INDEX.participant3Roll],
			columns[HEADER_INDEX.participant4Roll],
		]
			.map((value) => (value ? value.replace(/^"|"$/g, "") : ""))
			.map(normalizeRoll)
			.filter((roll) => roll.length > 0);

		existingRolls.forEach((roll) => {
			if (normalizedIncoming.has(roll)) {
				conflicts.add(roll);
			}
		});
	}

	return Array.from(conflicts);
};

const guessExtension = (mimeType?: string | null, originalName?: string | null) => {
	if (mimeType) {
		const [, subtype] = mimeType.split("/");
		if (subtype) {
			if (subtype === "jpeg") return ".jpg";
			if (subtype === "svg+xml") return ".svg";
			return `.${subtype}`;
		}
	}
	if (originalName) {
		const ext = path.extname(originalName);
		if (ext) return ext;
	}
	return ".bin";
};

export const persistPaymentProofFile = (
	base64: string | null,
	originalName: string | null,
	mimeType: string | null,
) => {
	if (!base64) {
		return { storedPath: null, mimeType: null };
	}

	ensureDirectories();

	let data = base64;
	const base64Index = base64.indexOf("base64,");
	if (base64Index !== -1) {
		data = base64.slice(base64Index + 7);
	}

	if (!data) {
		throw new Error("Invalid payment proof encoding");
	}

	const buffer = Buffer.from(data, "base64");
	const extension = guessExtension(mimeType, originalName);
	const fileName = `${Date.now()}-${randomUUID()}${extension}`;
	const absolutePath = path.join(UPLOAD_DIR, fileName);
	fs.writeFileSync(absolutePath, buffer);

	return {
		storedPath: path.relative(process.cwd(), absolutePath),
		mimeType: mimeType ?? "application/octet-stream",
	};
};

export const appendHackverseSubmission = (record: HackverseSubmissionRecord) => {
	ensureCsvExists();
	const row = toCsvRow(record);
	fs.appendFileSync(CSV_PATH, `${row}\n`, "utf8");
};
