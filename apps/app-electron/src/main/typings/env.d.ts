interface ImportMetaEnv {
	readonly MAIN_VITE_REMOTE_DEV_URL: string;
	readonly MAIN_VITE_REMOTE_PROD_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
