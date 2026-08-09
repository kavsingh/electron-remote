import { err, Result } from "neverthrow";

// https://stackoverflow.com/a/54409977
function divBigint(
	dividend: bigint,
	divisor: bigint,
	precision = 100n,
): Result<number, Error> {
	return divisor === 0n
		? err(new Error("Division by zero"))
		: Result.fromThrowable(
				() => Number((dividend * precision) / divisor) / Number(precision),
				(cause) => new Error("Failed to divide bigints", { cause }),
			)();
}

function normalizeBigint(
	val: bigint,
	min: bigint,
	max: bigint,
): Result<number, Error> {
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
