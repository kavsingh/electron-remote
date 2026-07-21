import { z } from "zod";

interface SystemInfo {
	osName: string;
	osVersion: string;
	osArch: string;
}

interface SystemStats {
	memTotal: string;
	memUsed: string;
	memAvailable: string;
	sampledAt: string;
}

const systemInfoSchema: z.ZodType<SystemInfo> = z.object({
	osName: z.string(),
	osVersion: z.string(),
	osArch: z.string(),
});

const systemStatsSchema: z.ZodType<SystemStats> = z.object({
	memTotal: z.string(),
	memUsed: z.string(),
	memAvailable: z.string(),
	sampledAt: z.string(),
});

export { systemInfoSchema, systemStatsSchema };
export type { SystemInfo, SystemStats };
