import type { RPCHandler } from "@orpc/server/message-port";
import type { IpcMain } from "electron";

interface InitializeRpcOptions {
	allowedOrigins?: string[] | undefined;
}

function initializeRpc(
	ipcMain: IpcMain,
	// oxlint-disable-next-line typescript/no-explicit-any
	handler: RPCHandler<any>,
	options?: InitializeRpcOptions,
): void {
	ipcMain.on("start-orpc-server", (event) => {
		const [serverPort] = event.ports;

		if (!serverPort) {
			throw new Error("No server port provided for ORPC server.");
		}

		if (options?.allowedOrigins) {
			const url = URL.parse(event.sender.hostWebContents?.getURL() ?? "");

			if (!url) {
				throw new Error("Unable to parse the URL of the sender.");
			}

			const origin = `${url.protocol}//${url.host}`;

			if (!options.allowedOrigins.includes(origin)) {
				throw new Error(
					`Origin ${origin} is not allowed to start the ORPC server.`,
				);
			}
		}

		handler.upgrade(serverPort);
		serverPort.start();
	});
}

export { contract } from "./rpc.ts";
export { initializeRpc };
export type { RPCHandler };
