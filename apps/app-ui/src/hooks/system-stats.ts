import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemStats } from "app-shared/common/system.ts";
import { useEffect, useEffectEvent } from "react";

import { events, systemStatsQuery } from "~/services/ipc";

export function useSystemStats() {
	const queryClient = useQueryClient();
	const query = useQuery(systemStatsQuery());
	const onStatsEvent = useEffectEvent((_: unknown, event: SystemStats) => {
		const current = queryClient.getQueryData(systemStatsQuery().queryKey);
		const shouldUpdate = current
			? BigInt(event.sampledAt) >= BigInt(current.sampledAt)
			: true;

		if (shouldUpdate) {
			queryClient.setQueryData(systemStatsQuery().queryKey, event);
		}
	});

	useEffect(() => {
		const subscription = events.systemStats.subscribe(onStatsEvent);

		return subscription.unsubscribe;
	}, []);

	return query;
}
