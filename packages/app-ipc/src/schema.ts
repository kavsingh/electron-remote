import { AppContext } from "@app/shared/common/app";
import { ThemeSource } from "@app/shared/common/theme";

import { eventPayload, invoker } from "./lib.ts";

import type { SystemInfo, SystemStats } from "@app/shared/common/system";
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

// type helpers

type InvokeChannel = keyof InvokeMap;
type InvokeArgs<TKey extends InvokeChannel> = Parameters<InvokeMap[TKey]>;
type InvokeReturn<TKey extends InvokeChannel> = Awaited<
	ReturnType<InvokeMap[TKey]>
>;

type EventChannel = keyof EventMap;
type EventPayload<TKey extends EventChannel> = EventMap[TKey];

export { invokeMap, eventMap };
export type {
	InvokeMap,
	EventMap,
	InvokeChannel,
	InvokeArgs,
	InvokeReturn,
	EventChannel,
	EventPayload,
};
