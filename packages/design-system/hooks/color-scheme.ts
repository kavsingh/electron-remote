import { useSyncExternalStore } from "react";

function prefersDarkState() {
	const query = globalThis.matchMedia("(prefers-color-scheme: dark)");
	let prefersDark = query.matches;

	query.addEventListener("change", (event) => {
		prefersDark = event.matches;
	});

	return {
		snapshot: () => prefersDark,
		subscribe: (subscriber: () => void) => {
			query.addEventListener("change", subscriber);

			return () => {
				query.removeEventListener("change", subscriber);
			};
		},
	};
}

const state = prefersDarkState();

export function usePrefersDark() {
	return useSyncExternalStore(state.subscribe, state.snapshot);
}
