// via vite define
declare const REMOTE_ENTRY_URL: string;
declare const REMOTE_ENTRY_URL_E2E: string;

// via env
// oxlint-disable-next-line typescript/no-empty-interface
interface ImportMetaEnv {}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
