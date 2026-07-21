import { mem, osInfo } from "systeminformation";

import type { SystemInfo, SystemStats } from "@app/shared/common/system";

async function getSystemInfo(): Promise<SystemInfo> {
	const sysOsInfo = await osInfo();

	return {
		osName: sysOsInfo.codename,
		osVersion: sysOsInfo.release,
		osArch: sysOsInfo.arch,
	};
}

async function getSystemStats(): Promise<SystemStats> {
	const sysMem = await mem();

	return {
		memTotal: String(sysMem.total),
		memUsed: String(sysMem.active),
		memAvailable: String(sysMem.available),
		sampledAt: String(Date.now()),
	};
}

export { getSystemInfo, getSystemStats };
