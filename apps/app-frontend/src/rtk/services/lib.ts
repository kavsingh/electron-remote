import { invoke } from "~/bridge";

import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { InvokeMap } from "~/bridge";

type IpcBaseQueryInput = (api: InvokeMap) => Promise<unknown>;

const ipcBaseQuery: BaseQueryFn<IpcBaseQueryInput, unknown, Error> = async (
	input,
) => {
	try {
		const result: unknown = await input(invoke);

		return { data: result ?? null };
	} catch (cause) {
		const error =
			cause instanceof Error ? cause : new Error(String(cause), { cause });

		return { error };
	}
};

export { ipcBaseQuery };
export type { IpcBaseQueryInput };
