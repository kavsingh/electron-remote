interface ViteTypeOptions {
	strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
	readonly REMOTE_ENTRY_URL: string;
	readonly REMOTE_ENTRY_URL_E2E: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
