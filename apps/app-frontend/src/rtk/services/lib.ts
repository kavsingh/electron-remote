import { rpc } from "~/bridge";

import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";

const rpcBaseQuery: BaseQueryFn<
	// oxlint-disable-next-line typescript/no-explicit-any
	{ fn: (client: typeof rpc) => Promise<any> },
	unknown,
	Error
> = async (input) => {
	const { fn } = input;

	try {
		const result: unknown = await fn(rpc);

		return { data: result ?? null };
	} catch (cause) {
		const error =
			cause instanceof Error ? cause : new Error(String(cause), { cause });

		return { error };
	}
};

export { rpcBaseQuery };
