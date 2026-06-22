import * as systeminformation from "systeminformation";
import { describe, it, expect, vi } from "vitest";

import { getSystemInfo, getSystemStats } from "./system.ts";

vi.mock(import("systeminformation"));

describe("system services", () => {
	describe(getSystemInfo, () => {
		it("should provide system info", async () => {
			expect.assertions(1);

			// @ts-expect-error sparse mock
			vi.spyOn(systeminformation, "osInfo").mockResolvedValueOnce({
				codename: "OS Code",
				release: "1.0.0",
				arch: "arch",
			});

			await expect(getSystemInfo()).resolves.toStrictEqual({
				osName: "OS Code",
				osVersion: "1.0.0",
				osArch: "arch",
			});
		});
	});

	describe(getSystemStats, () => {
		it("should provide system stats", async () => {
			expect.assertions(1);

			// @ts-expect-error sparse mock
			vi.spyOn(systeminformation, "mem").mockResolvedValueOnce({
				total: 100,
				available: 40,
				active: 60,
			});

			await expect(getSystemStats()).resolves.toStrictEqual({
				memTotal: "100",
				memAvailable: "40",
				memUsed: "60",
				sampledAt: expect.any(String),
			});
		});
	});
});
