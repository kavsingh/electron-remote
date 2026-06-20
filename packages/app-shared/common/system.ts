import { z } from "zod";

const systemStatsSchema = z.object({
	memTotal: z.string(),
	memUsed: z.string(),
	memAvailable: z.string(),
	sampledAt: z.string(),
});

type SystemStats = z.infer<typeof systemStatsSchema>;

const systemInfoSchema = z.object({
	osName: z.string(),
	osVersion: z.string(),
	osArch: z.string(),
});

type SystemInfo = z.infer<typeof systemInfoSchema>;

export { systemInfoSchema, systemStatsSchema };
export type { SystemInfo, SystemStats };
