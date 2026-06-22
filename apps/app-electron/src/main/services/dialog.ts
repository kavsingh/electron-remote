import { BrowserWindow, dialog } from "electron";

import type { OpenDialogOptions } from "electron";

function openDialog(options: OpenDialogOptions) {
	// TODO: determine requesting window somehow?
	const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
		win.isFocused(),
	);

	if (!focusedWindow) throw new Error("No focused window");

	return dialog.showOpenDialog(focusedWindow, options);
}

export { openDialog };
