import { BrowserWindow, dialog } from "electron";
import { errAsync, ResultAsync } from "neverthrow";

import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

function openDialog(
	options: OpenDialogOptions,
): ResultAsync<OpenDialogReturnValue, Error> {
	// TODO: determine requesting window somehow?
	const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
		win.isFocused(),
	);

	if (!focusedWindow) return errAsync(new Error("No focused window"));

	return ResultAsync.fromPromise(
		dialog.showOpenDialog(focusedWindow, options),
		(cause) => new Error("Failed to open dialog", { cause }),
	);
}

export { openDialog };
