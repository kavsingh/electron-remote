// oxlint-disable typescript/no-invalid-void-type

import { createApi, retry } from "@reduxjs/toolkit/query/react";

import { ipcBaseQuery } from "./lib";

import type { InvokeArgs, InvokeReturn } from "~/bridge";

const baseQuery = retry(ipcBaseQuery, { maxRetries: 3 });

const ipcApi = createApi({
	baseQuery,
	reducerPath: "ipcApi",
	tagTypes: ["SystemInfo", "SystemStats", "ThemeSource", "AppContext"],
	endpoints(builder) {
		return {
			themeSource: builder.query<InvokeReturn<"getThemeSource">, void>({
				query: () => (api) => api.getThemeSource(),
				providesTags: ["ThemeSource"],
			}),

			setThemeSource: builder.mutation<
				InvokeReturn<"setThemeSource">,
				InvokeArgs<"setThemeSource">[0]
			>({
				query: (themeSource) => {
					return (api) => api.setThemeSource(themeSource);
				},
				invalidatesTags: ["ThemeSource"],
				extraOptions: { maxRetries: 0 },
			}),

			systemInfo: builder.query<InvokeReturn<"getSystemInfo">, void>({
				query: () => (api) => api.getSystemInfo(),
				providesTags: ["SystemInfo"],
			}),

			systemStats: builder.query<InvokeReturn<"getSystemStats">, void>({
				query: () => (api) => api.getSystemStats(),
				providesTags: ["SystemStats"],
			}),

			openDialog: builder.mutation<
				InvokeReturn<"openDialog">,
				InvokeArgs<"openDialog">[0]
			>({
				query: (options) => (api) => api.openDialog(options),
				extraOptions: { maxRetries: 0 },
			}),

			appContext: builder.query<InvokeReturn<"getAppContext">, void>({
				query: () => (api) => api.getAppContext(),
				extraOptions: { maxRetries: 0 },
			}),

			setAppContext: builder.mutation<
				InvokeReturn<"setAppContext">,
				InvokeArgs<"setAppContext">[0]
			>({
				query: (context) => (api) => api.setAppContext(context),
				extraOptions: { maxRetries: 0 },
				invalidatesTags: ["AppContext"],
			}),
		};
	},
});

export { ipcApi };
