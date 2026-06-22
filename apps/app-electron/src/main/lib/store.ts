import { Draft, produce } from "immer";

import { IterableEventEmitter } from "./node-events.ts";

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
		const nextState = produce(this.#state, updater);

		if (nextState === this.#state) return;

		this.#state = nextState;
		this.emit("update");
	}
}

export { Store };
