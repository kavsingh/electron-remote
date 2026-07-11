import { fs } from "memfs";
import { vi } from "vitest";

vi.mock("node:fs", () => ({ ...fs, default: fs }));
vi.mock("node:fs/promises", () => ({ ...fs.promises, default: fs.promises }));

vi.mock("electron-log", () => {
	const logFns = {
		silly: vi.fn(),
		debug: vi.fn(),
		verbose: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	};

	const logger = { ...logFns, scope: () => logFns };

	return { ...logger, default: logger };
});
