import { Dispatch } from "@reduxjs/toolkit";

import { events } from "~/ipc";

import { ipcApi } from "./services/ipc";

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
