interface ImportMetaEnv {
	readonly VITE_REMOTE_DEV_URL: string;
	readonly VITE_REMOTE_PROD_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
