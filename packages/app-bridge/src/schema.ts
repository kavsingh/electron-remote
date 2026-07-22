import type { Invoker } from "./lib.ts";
import type { AppContext } from "@app/shared/common/app";
import type { SystemInfo, SystemStats } from "@app/shared/common/system";
import type { ThemeSource } from "@app/shared/common/theme";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

interface AppInfo {
	appVersion: string;
	electronVersion: string;
	architecture: NodeJS.Architecture;
	platform: NodeJS.Platform;
	platformVersion: string;
}

interface StaticApi {
	appInfo: AppInfo;
}

// oxlint-disable typescript/no-unsafe-type-assertion
const invokeMap = {
	getThemeSource: {} as Invoker<ThemeSource>,
	setThemeSource: {} as Invoker<undefined, ThemeSource>,
	getSystemInfo: {} as Invoker<SystemInfo>,
	getSystemStats: {} as Invoker<SystemStats>,
	openDialog: {} as Invoker<OpenDialogReturnValue, OpenDialogOptions>,
	getAppContext: {} as Invoker<AppContext>,
	setAppContext: {} as Invoker<undefined, AppContext>,
};

const eventMap = {
	systemStats: {} as SystemStats,
};
// oxlint-enable typescript/no-unsafe-type-assertion

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
	SystemInfo,
	SystemStats,
	ThemeSource,
	AppContext,
	OpenDialogOptions,
	OpenDialogReturnValue,
	AppInfo,
	StaticApi,
};
