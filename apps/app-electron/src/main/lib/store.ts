import { create } from "mutative";

import { IterableEventEmitter } from "./node-events.ts";

import type { Draft } from "mutative";

class Store<TState extends object> extends IterableEventEmitter<{
	update: [];
}> {
	#state: TState;

	constructor(initialState: TState) {
		super();
		this.#state = initialState;
	}

	getState(): Readonly<TState> {
		return this.#state;
	}

	update(updater: (draft: Draft<TState>) => undefined) {
		const nextState = create(this.#state, updater);

		if (nextState === this.#state) return;

		this.#state = nextState;
		this.emit("update");
	}
}

export { Store };
