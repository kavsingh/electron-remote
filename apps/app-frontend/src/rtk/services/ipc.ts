// oxlint-disable typescript/no-invalid-void-type

import { createApi, retry } from "@reduxjs/toolkit/query/react";

import { invoke } from "~/bridge";

import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { InvokeChannel, InvokeArgs, InvokeReturn } from "~/bridge";

type InvokeChannelArgs = {
	[TKey in InvokeChannel]: [TKey, InvokeArgs<TKey>];
}[InvokeChannel];

const ipcBaseQuery: BaseQueryFn<InvokeChannelArgs, unknown, Error> = async (
	input,
) => {
	const [invokeKey, args] = input;

	try {
		// @ts-expect-error --- IGNORE ---
		const result: unknown = await invoke[invokeKey](...args);

		return { data: result ?? null };
	} catch (cause) {
		const error =
			cause instanceof Error ? cause : new Error(String(cause), { cause });

		return { error };
	}
};

const baseQuery = retry(ipcBaseQuery, { maxRetries: 3 });

const ipcApi = createApi({
	baseQuery,
	reducerPath: "ipcApi",
	tagTypes: ["SystemInfo", "SystemStats", "ThemeSource", "AppContext"],
	endpoints(builder) {
		return {
			themeSource: builder.query<InvokeReturn<"getThemeSource">, void>({
				query: () => ["getThemeSource", []],
				providesTags: ["ThemeSource"],
			}),

			setThemeSource: builder.mutation<
				InvokeReturn<"setThemeSource">,
				InvokeArgs<"setThemeSource">[0]
			>({
				query: (themeSource) => ["setThemeSource", [themeSource]],
				invalidatesTags: ["ThemeSource"],
				extraOptions: { maxRetries: 0 },
			}),

			systemInfo: builder.query<InvokeReturn<"getSystemInfo">, void>({
				query: () => ["getSystemInfo", []],
				providesTags: ["SystemInfo"],
			}),

			systemStats: builder.query<InvokeReturn<"getSystemStats">, void>({
				query: () => ["getSystemStats", []],
				providesTags: ["SystemStats"],
			}),

			openDialog: builder.mutation<
				InvokeReturn<"openDialog">,
				InvokeArgs<"openDialog">[0]
			>({
				query: (options) => ["openDialog", [options]],
				extraOptions: { maxRetries: 0 },
			}),

			appContext: builder.query<InvokeReturn<"getAppContext">, void>({
				query: () => ["getAppContext", []],
				extraOptions: { maxRetries: 0 },
			}),

			setAppContext: builder.mutation<
				InvokeReturn<"setAppContext">,
				InvokeArgs<"setAppContext">[0]
			>({
				query: (context) => ["setAppContext", [context]],
				extraOptions: { maxRetries: 0 },
				invalidatesTags: ["AppContext"],
			}),
		};
	},
});

export { ipcApi };
