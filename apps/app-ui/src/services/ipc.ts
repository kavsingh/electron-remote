import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getIpcBridge } from "app-shared/browser/ipc-browser.ts";

const { invoke, events } = getIpcBridge();

function themeSourceQuery() {
	return queryOptions({
		queryKey: ["themeSource"],
		queryFn: invoke.getThemeSource,
	});
}

function setThemeSourceMutation() {
	return mutationOptions({
		mutationFn: invoke.setThemeSource,
	});
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

export {
	events,
	themeSourceQuery,
	setThemeSourceMutation,
	systemInfoQuery,
	systemStatsQuery,
	openDialogMutation,
};
