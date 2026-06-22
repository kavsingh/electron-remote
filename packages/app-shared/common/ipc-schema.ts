import { AppContext } from "./app.ts";
import { eventPayload, invoker } from "./ipc-schema-lib.ts";
import { ThemeSource } from "./theme.ts";

import type { SystemInfo, SystemStats } from "./system.ts";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

const invokeMap = {
	getThemeSource: invoker<ThemeSource>(),
	setThemeSource: invoker<undefined, ThemeSource>(),
	getSystemInfo: invoker<SystemInfo>(),
	getSystemStats: invoker<SystemStats>(),
	openDialog: invoker<OpenDialogReturnValue, OpenDialogOptions>(),
	getAppContext: invoker<AppContext>(),
	setAppContext: invoker<undefined, AppContext>(),
};

const eventMap = {
	systemStats: eventPayload<[SystemStats]>(),
};

type InvokeMap = typeof invokeMap;
type EventMap = typeof eventMap;

export { invokeMap, eventMap };
export type { InvokeMap, EventMap };
