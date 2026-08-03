import { oc, eventIterator } from "@orpc/contract";
import { z } from "zod";

import type { AppContext } from "@app/shared/common/app";
import type { SystemInfo, SystemStats } from "@app/shared/common/system";
import type { ThemeSource } from "@app/shared/common/theme";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

const contract = oc.router({
	getThemeSource: oc.output(z.custom<ThemeSource>()),
	setThemeSource: oc.input(z.custom<ThemeSource>()),
	getSystemInfo: oc.output(z.custom<SystemInfo>()),
	getSystemStats: oc.output(z.custom<SystemStats>()),
	openDialog: oc
		.input(z.custom<OpenDialogOptions>())
		.output(z.custom<OpenDialogReturnValue>()),
	getAppContext: oc.output(z.custom<AppContext>()),
	setAppContext: oc.input(z.custom<AppContext>()),
	onSystemStats: oc.output(eventIterator(z.void())),
});

export { contract };
export type {
	AppContext,
	OpenDialogOptions,
	OpenDialogReturnValue,
	SystemInfo,
	SystemStats,
	ThemeSource,
};
