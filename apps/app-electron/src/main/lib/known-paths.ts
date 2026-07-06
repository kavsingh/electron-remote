import path from "node:path";

const REMOTE_RENDERER_FALLBACK_ROOT = path.resolve(
	import.meta.dirname,
	"../renderer-remote",
);

const RENDERER_ERROR_ROOT = path.resolve(import.meta.dirname, "../renderer");

export { REMOTE_RENDERER_FALLBACK_ROOT, RENDERER_ERROR_ROOT };
