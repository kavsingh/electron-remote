import {
	IPC_NAMESPACE,
	createIpcBridge,
} from "app-shared/common/ipc-preload.ts";
import { contextBridge, ipcRenderer } from "electron";

process.once("loaded", () => {
	contextBridge.exposeInMainWorld(IPC_NAMESPACE, createIpcBridge(ipcRenderer));
});
