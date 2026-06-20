// oxlint-disable typescript/no-unsafe-type-assertion

import { ThemeSource } from "./theme.ts";

import type { SystemInfo, SystemStats } from "./system.ts";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

const invokeMap = {
	getThemeSource: {} as () => Promise<ThemeSource>,
	setThemeSource: {} as (source: ThemeSource) => Promise<ThemeSource>,
	getSystemInfo: {} as () => Promise<SystemInfo>,
	getSystemStats: {} as () => Promise<SystemStats>,
	openDialog: {} as (
		options: OpenDialogOptions,
	) => Promise<OpenDialogReturnValue>,
};

const eventMap = {
	systemStats: {} as [SystemStats],
};

type InvokeMap = typeof invokeMap;
type EventMap = typeof eventMap;

export { invokeMap, eventMap };
export type { InvokeMap, EventMap };
