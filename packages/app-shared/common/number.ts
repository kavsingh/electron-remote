// https://stackoverflow.com/a/54409977
function divBigint(
	dividend: bigint,
	divisor: bigint,
	precision = 100n,
): number {
	return Number((dividend * precision) / divisor) / Number(precision);
}

function normalizeBigint(val: bigint, min: bigint, max: bigint): number {
	return divBigint(val - min, max - min);
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function asFiniteNumberOr(value: unknown, defaultValue: number): number {
	const asNumber = Number(value);

	return isFiniteNumber(asNumber) ? asNumber : defaultValue;
}

export { divBigint, normalizeBigint, isFiniteNumber, asFiniteNumberOr };
