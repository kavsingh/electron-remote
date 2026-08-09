import { invoke } from "~/bridge";

import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { ResultAsync } from "neverthrow";
import type { Invoke, InvokeChannel } from "~/bridge";

type IpcBaseQueryInput = (api: Invoke) => ResultAsync<unknown, unknown>;

// oxlint-disable-next-line typescript/consistent-type-definitions
type IpcQueryError = { type: "genericError"; message: string };

function toError(cause: unknown) {
	if (cause instanceof Error) return cause;

	return new Error(String(cause), { cause: cause });
}

const ipcBaseQuery: BaseQueryFn<
	IpcBaseQueryInput,
	unknown,
	IpcQueryError
> = async (input) => {
	try {
		const result = await input(invoke);

		if (result.isOk()) return { data: result.value ?? null };

		return {
			error: { type: "genericError", message: toError(result.error).message },
		};
	} catch (cause) {
		return { error: { type: "genericError", message: toError(cause).message } };
	}
};

type IpcReturn<TChannel extends InvokeChannel> =
	ReturnType<Invoke[TChannel]> extends ResultAsync<infer TValue, infer _TError>
		? TValue
		: never;

export { ipcBaseQuery };
export type { IpcBaseQueryInput, IpcReturn };
