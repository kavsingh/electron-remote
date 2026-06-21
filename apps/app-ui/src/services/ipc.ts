import {
	mutationOptions,
	QueryClient,
	queryOptions,
} from "@tanstack/react-query";
import { getIpc } from "app-shared/browser/ipc-browser.ts";

const { invoke, events } = getIpc();

function themeSourceQuery() {
	return queryOptions({
		queryKey: ["themeSource"],
		queryFn: invoke.getThemeSource,
	});
}

function setThemeSourceMutation() {
	return mutationOptions({ mutationFn: invoke.setThemeSource });
}

function systemInfoQuery() {
	return queryOptions({
		queryKey: ["systemInfo"],
		queryFn: invoke.getSystemInfo,
	});
}

function systemStatsQuery() {
	return queryOptions({
		queryKey: ["systemStats"],
		queryFn: invoke.getSystemStats,
	});
}

function openDialogMutation() {
	return mutationOptions({ mutationFn: invoke.openDialog });
}

function createQueryClient() {
	const client = new QueryClient();
	const statsKey = systemStatsQuery().queryKey;

	events.systemStats.subscribe((_, payload) => {
		const current = client.getQueryData(statsKey);
		const shouldUpdate = current
			? BigInt(payload.sampledAt) >= BigInt(current.sampledAt)
			: true;

		if (shouldUpdate) client.setQueryData(statsKey, payload);
	});

	return client;
}

export {
	createQueryClient,
	themeSourceQuery,
	setThemeSourceMutation,
	systemInfoQuery,
	systemStatsQuery,
	openDialogMutation,
};
