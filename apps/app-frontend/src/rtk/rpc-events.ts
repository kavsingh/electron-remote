import { consumeEventIterator } from "@orpc/client";

import { rpc } from "~/bridge";

import { rpcApi } from "./services/rpc";

import type { Dispatch } from "@reduxjs/toolkit";

function setupIpcEventListeners(dispatch: Dispatch) {
	const subs = [
		consumeEventIterator(rpc.onSystemStats(), {
			onEvent: () => {
				void dispatch(rpcApi.util.invalidateTags(["SystemStats"]));
			},
		}),
	];

	return function dispose() {
		for (const sub of subs) void sub();
	};
}

export { setupIpcEventListeners };
