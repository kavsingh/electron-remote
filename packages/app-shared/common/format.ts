import { tryOr } from "./error.ts";
import { divBigint } from "./number.ts";

const memoryThresholds = [
	[BigInt(1024 * 1024 * 1024), "GB"],
	[BigInt(1024 * 1024), "MB"],
	[1024n, "KB"],
	[0n, "B"],
] as const;

function formatMem(value: string | number | bigint): string {
	const mem = tryOr(() => BigInt(value), 0n);

	for (const [threshold, unit] of memoryThresholds) {
		if (mem >= threshold) {
			return `${divBigint(mem, threshold).toFixed(2)} ${unit}`;
		}
	}

	return "-";
}

export { formatMem };
