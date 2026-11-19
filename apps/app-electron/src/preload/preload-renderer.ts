import { createBridge } from "@app/bridge/preload";
import { contextBridge, ipcRenderer } from "electron";

import type { StaticApi } from "@app/bridge/preload";

function getArgumentValue(key: string): string | undefined {
	return process.argv.find((arg) => arg.startsWith(`--${key}=`))?.split("=")[1];
}

function getList(key: string): string[] {
	const items: string[] = [];
	const value = getArgumentValue(key);

	if (!value) return items;

	for (const arg of value.split(",")) items.push(arg.trim());

	return items;
}

const appInfo: StaticApi["appInfo"] = {
	appVersion: getArgumentValue("app-version") ?? "0.0.0",
	electronVersion: process.versions.electron,
	architecture: process.arch,
	platform: process.platform,
	platformVersion: process.getSystemVersion(),
	supportedIpc: {
		invoke: getList("supported-ipc-invoke"),
		events: getList("supported-ipc-events"),
	},
};

process.once("loaded", () => {
	const { namespace, api } = createBridge({ appInfo }, ipcRenderer);

	contextBridge.exposeInMainWorld(namespace, api);
});
