import { contract } from "@app/bridge/electron";
import { implement } from "@orpc/server";
import { nativeTheme } from "electron";

import { openDialog } from "./services/dialog.ts";
import { getSystemInfo } from "./services/system.ts";

import type { AppStore } from "./stores/app.ts";
import type { SystemStatsStore } from "./stores/system-stats.ts";

const os = implement(contract);

function initRouter(ctx: {
	appStore: AppStore;
	systemStatsStore: SystemStatsStore;
}) {
	const router = os.router({
		getSystemInfo: os.getSystemInfo.handler(getSystemInfo),

		getSystemStats: os.getSystemStats.handler(
			() => ctx.systemStatsStore.getState().stats,
		),

		getThemeSource: os.getThemeSource.handler(() => nativeTheme.themeSource),

		setThemeSource: os.setThemeSource.handler(({ input }) => {
			nativeTheme.themeSource = input;
		}),

		openDialog: os.openDialog.handler(({ input }) => openDialog(input)),

		getAppContext: os.getAppContext.handler(
			() => ctx.appStore.getState().appContext,
		),

		setAppContext: os.setAppContext.handler(({ input }) => {
			ctx.appStore.update((state) => void (state.appContext = input));
		}),

		onSystemStats: os.onSystemStats.handler(async function* ({ signal }) {
			for await (const _ of ctx.systemStatsStore.toIterable("update", {
				signal,
			})) {
				yield undefined;
			}
		}),
	});

	return router;
}

export { initRouter };
