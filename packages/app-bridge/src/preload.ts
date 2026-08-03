import { BRIDGE_STATICS_NAMESPACE } from "./lib.ts";

import type { StaticApi } from "./static.ts";
import type { IpcRenderer } from "electron";

function startOrpc(ipcRenderer: IpcRenderer, allowedOrigins?: string[]): void {
	window.addEventListener("message", (event) => {
		if (event.data === "start-orpc-client") {
			const [serverPort] = event.ports;

			if (!serverPort) {
				throw new Error("No server port provided for ORPC client.");
			}

			const origin = event.origin;

			if (allowedOrigins && !allowedOrigins.includes(origin)) {
				throw new Error(`Origin ${origin} is not allowed.`);
			}

			ipcRenderer.postMessage("start-orpc-server", null, [serverPort]);
		}
	});
}

interface CreateBridgeOptions {
	ipcRenderer: IpcRenderer;
	allowedOrigins?: string[] | undefined;
}

function createBridge(
	staticApi: StaticApi,
	{ ipcRenderer, allowedOrigins }: CreateBridgeOptions,
): {
	api: StaticApi;
	namespace: string;
} {
	startOrpc(ipcRenderer, allowedOrigins);

	return { api: staticApi, namespace: BRIDGE_STATICS_NAMESPACE };
}

export { createBridge };
export type { CreateBridgeOptions, StaticApi };
