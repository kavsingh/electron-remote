import path from "node:path";
import { pathToFileURL } from "node:url";

import { net } from "electron";
import log from "electron-log";

import { REMOTE_RENDERER_FALLBACK_ROOT } from "./known-paths.ts";

import type { CustomScheme } from "electron";

async function serveFile(filepath: string, fileRoot: string) {
	const resolvedPath = path.resolve(fileRoot, filepath.replace(/^\//, ""));
	const relativePath = path.relative(fileRoot, resolvedPath);
	const isSafe =
		relativePath &&
		!relativePath.startsWith("..") &&
		!path.isAbsolute(relativePath);

	if (!isSafe) {
		log.error("unsafe filepath", { resolvedPath, relativePath });

		return new Response("unsafe path", {
			status: 400,
			headers: { "content-type": "text/html" },
		});
	}

	const fileUrl = pathToFileURL(resolvedPath).href;

	log.debug("fetching file", { resolvedPath, fileUrl });

	try {
		return await net.fetch(fileUrl);
	} catch (cause) {
		log.error("failed to load", cause);

		return new Response(`failed to load: ${String(cause)}`, {
			status: 500,
			headers: { "content-type": "text/html" },
		});
	}
}

const APP_PROTOCOL_SCHEME = "app";
const APP_RENDERER_HOST = "renderer";
const APP_RENDERER_URL = `${APP_PROTOCOL_SCHEME}://${APP_RENDERER_HOST}/`;
const appProtocol: CustomScheme = {
	scheme: APP_PROTOCOL_SCHEME,
	privileges: { standard: true, corsEnabled: true },
};

async function appProtocolHandler(request: Request): Promise<Response> {
	const { host, pathname } = new URL(request.url);

	log.debug("handling app protocol", { host, pathname });

	switch (host) {
		case APP_RENDERER_HOST: {
			const isRoot = pathname === "" || pathname === "/";

			return serveFile(
				isRoot ? "index.html" : pathname,
				REMOTE_RENDERER_FALLBACK_ROOT,
			);
		}

		default: {
			log.error("invalid host", { host, pathname });

			return new Response("invalid host", {
				status: 400,
				headers: { "content-type": "text/html" },
			});
		}
	}
}

export {
	APP_PROTOCOL_SCHEME,
	APP_RENDERER_HOST,
	APP_RENDERER_URL,
	appProtocol,
	appProtocolHandler,
};
