import { scope } from "electron-log";

import { Store } from "~/lib/store.ts";
import { getSystemStats } from "~/services/system.ts";

import type { SystemStats } from "@app/shared/common/system";

class SystemStatsStore extends Store<SystemStats> {
	readonly #logger = scope("SystemStatsStore");
	#active = true;
	#timeout: NodeJS.Timeout | undefined = undefined;

	startSampling() {
		this.#active = true;
		void this.#tick();
	}

	stopSampling() {
		this.#active = false;

		if (this.#timeout) {
			clearTimeout(this.#timeout);
			this.#timeout = undefined;
		}
	}

	async #tick() {
		if (!this.#active) return;

		(await getSystemStats()).match(
			(stats) => this.update((state) => void Object.assign(state, stats)),
			(cause) => this.#logger.error(cause),
		);

		if (this.#timeout) clearTimeout(this.#timeout);
		this.#timeout = setTimeout(() => void this.#tick(), 1000);
	}
}

function createSystemStatsStore() {
	return new SystemStatsStore({
		memTotal: "0",
		memUsed: "0",
		memAvailable: "0",
		sampledAt: "0",
	});
}

export { createSystemStatsStore };
export type { SystemStatsStore };
