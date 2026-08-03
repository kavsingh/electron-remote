// oxlint-disable typescript/no-invalid-void-type

import { createApi, retry } from "@reduxjs/toolkit/query/react";

import { rpcBaseQuery } from "./lib";

import type { RpcInputs, RpcOutputs } from "~/bridge";

const baseQuery = retry(rpcBaseQuery, { maxRetries: 3 });

const rpcApi = createApi({
	baseQuery,
	reducerPath: "ipcApi",
	tagTypes: ["SystemInfo", "SystemStats", "ThemeSource", "AppContext"],
	endpoints(builder) {
		return {
			themeSource: builder.query<RpcOutputs["getThemeSource"], void>({
				query: () => {
					return { fn: (client) => client.getThemeSource() };
				},
				providesTags: ["ThemeSource"],
			}),

			setThemeSource: builder.mutation<
				RpcOutputs["setThemeSource"],
				RpcInputs["setThemeSource"]
			>({
				query: (input) => {
					return { fn: (client) => client.setThemeSource(input) };
				},
				invalidatesTags: ["ThemeSource"],
				extraOptions: { maxRetries: 0 },
			}),

			systemInfo: builder.query<RpcOutputs["getSystemInfo"], void>({
				query: () => {
					return { fn: (client) => client.getSystemInfo() };
				},
				providesTags: ["SystemInfo"],
			}),

			systemStats: builder.query<RpcOutputs["getSystemStats"], void>({
				query: () => {
					return { fn: (client) => client.getSystemStats() };
				},
				providesTags: ["SystemStats"],
			}),

			openDialog: builder.mutation<
				RpcOutputs["openDialog"],
				RpcInputs["openDialog"]
			>({
				query: (options) => {
					return { fn: (client) => client.openDialog(options) };
				},
				extraOptions: { maxRetries: 0 },
			}),

			appContext: builder.query<RpcOutputs["getAppContext"], void>({
				query: () => {
					return { fn: (client) => client.getAppContext() };
				},
				extraOptions: { maxRetries: 0 },
			}),

			setAppContext: builder.mutation<
				RpcOutputs["setAppContext"],
				RpcInputs["setAppContext"]
			>({
				query: (context) => {
					return { fn: (client) => client.setAppContext(context) };
				},
				extraOptions: { maxRetries: 0 },
				invalidatesTags: ["AppContext"],
			}),
		};
	},
});

export { rpcApi };
