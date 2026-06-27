import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { setupListeners as setupQueryListeners } from "@reduxjs/toolkit/query/react";
import {
	TypedUseSelectorHook,
	useDispatch,
	useSelector,
	useStore,
} from "react-redux";

import { setupIpcEventListeners } from "./ipc-events";
import { ipcApi } from "./services/ipc";

const reducer = combineSlices(ipcApi);

function createAppStore() {
	const store = configureStore({
		reducer,
		middleware(getDefaultMiddleware) {
			return getDefaultMiddleware().concat(ipcApi.middleware);
		},
		devTools: !import.meta.env.PROD,
	});

	const removeQueryListeners = setupQueryListeners(store.dispatch);
	const removeIpcEventListeners = setupIpcEventListeners(store.dispatch);

	function dispose() {
		removeQueryListeners();
		removeIpcEventListeners();
	}

	return { store, dispose } as const;
}

type AppStore = ReturnType<typeof createAppStore>["store"];
type AppState = ReturnType<AppStore["getState"]>;
type AppDispatch = AppStore["dispatch"];

// Use these instead of plain `useStore`, `useDispatch` and `useSelector`
const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

function useAppDispatch() {
	return useDispatch<AppDispatch>();
}

function useAppStore(): AppStore {
	// TODO: figure out a way to properly type actions - useStore<AppState, Actions>()
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	return useStore() as AppStore;
}

export { createAppStore, useAppSelector, useAppDispatch, useAppStore };
export type { AppStore, AppState, AppDispatch };
