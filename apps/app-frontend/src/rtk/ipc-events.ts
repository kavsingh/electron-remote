import { events } from "~/ipc";

import { ipcApi } from "./services/ipc";

import type { Dispatch } from "@reduxjs/toolkit";

function setupIpcEventListeners(dispatch: Dispatch) {
	const subs = [
		events.systemStats.subscribe(() => {
			void dispatch(ipcApi.util.invalidateTags(["SystemStats"]));
		}),
	];

	return function dispose() {
		for (const sub of subs) sub.unsubscribe();
	};
}

export { setupIpcEventListeners };
