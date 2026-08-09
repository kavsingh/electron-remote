import { ResultAsync } from "neverthrow";
import { mem, osInfo } from "systeminformation";

import type { SystemInfo, SystemStats } from "@app/shared/common/system";

function getSystemInfo(): ResultAsync<SystemInfo, Error> {
	return ResultAsync.fromPromise(
		osInfo(),
		(cause) => new Error("Failed to get system info", { cause }),
	).map((sysOsInfo) => ({
		osName: sysOsInfo.codename,
		osVersion: sysOsInfo.release,
		osArch: sysOsInfo.arch,
	}));
}

function getSystemStats(): ResultAsync<SystemStats, Error> {
	return ResultAsync.fromPromise(
		mem(),
		(cause) => new Error("Failed to get system memory info", { cause }),
	).map((memInfo) => ({
		memTotal: String(memInfo.total),
		memUsed: String(memInfo.active),
		memAvailable: String(memInfo.available),
		sampledAt: String(Date.now()),
	}));
}

export { getSystemInfo, getSystemStats };
