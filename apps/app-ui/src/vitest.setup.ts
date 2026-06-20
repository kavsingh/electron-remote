// oxlint-disable import/no-unassigned-import

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { vi, afterEach } from "vitest";

vi.stubGlobal(
	"ResizeObserver",
	class {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	},
);

vi.stubGlobal(
	"matchMedia",
	vi.fn(() => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() })),
);

vi.mock("electron-log/renderer", () => {
	const logger = {
		silly: vi.fn(),
		debug: vi.fn(),
		verbose: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	};

	return { ...logger, scope: () => logger };
});

afterEach(() => {
	cleanup();
});
