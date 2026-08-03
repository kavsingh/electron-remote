interface AppInfo {
	appVersion: string;
	electronVersion: string;
	architecture: string;
	platform: string;
	platformVersion: string;
}

interface StaticApi {
	appInfo: AppInfo;
}

export type { AppInfo, StaticApi };
