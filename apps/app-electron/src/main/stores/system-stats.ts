import { SystemStats } from "@app/shared/common/system";
import { scope } from "electron-log";

import { Store } from "~/lib/store.ts";
import { getSystemStats } from "~/services/system.ts";

interface SystemStatsState {
	stats: SystemStats;
}

class SystemStatsStore extends Store<SystemStatsState> {
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

		try {
			const stats = await getSystemStats();

			this.update((state) => void (state.stats = stats));
		} catch (cause) {
			this.#logger.error(cause);
		} finally {
			this.#timeout = setTimeout(() => void this.#tick(), 1000);
		}
	}
}

function createSystemStatsStore() {
	return new SystemStatsStore({
		stats: {
			memTotal: "0",
			memUsed: "0",
			memAvailable: "0",
			sampledAt: "0",
		},
	});
}

export { createSystemStatsStore };
export type { SystemStatsStore };
