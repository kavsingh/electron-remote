import type { Configuration } from "electron-builder";

const config: Configuration = {
	appId: "com.electron-remote.dev",
	afterPack: "build/after-pack.ts",
	directories: { buildResources: "build" },
	files: ["out/**"],
	nsis: {
		artifactName: "${productName} ${version} ${arch} Installer.${ext}",
		shortcutName: "${productName}",
		uninstallDisplayName: "${productName}",
		createDesktopShortcut: "always",
	},
	mac: {
		target: { target: "default", arch: ["universal"] },
		hardenedRuntime: true,
		entitlements: "build/entitlements.mac.plist",
		entitlementsInherit: "build/entitlements.mac.plist",
	},
	dmg: {
		artifactName: "${productName} ${version} ${arch}.${ext}",
	},
	linux: {
		target: ["AppImage", "snap", "deb"],
		maintainer: "electronjs.org",
		category: "Utility",
	},
	appImage: {
		artifactName: "${productName} ${version} ${arch}.${ext}",
	},
	npmRebuild: false,
	publish: {
		provider: "generic",
		url: "https://example.com/auto-updates",
	},
};

export default config;
