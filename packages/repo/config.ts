import path from "node:path";

import electronPackageJson from "../../apps/app-electron/package.json" with { type: "json" };

import type { ServerOptions } from "vite";

interface RepoConfig {
	repoRoot: string;
	frontendRoot: string;
	frontendBuildDir: string;
	frontendDevServerOptions: ServerOptions;
	frontendPreviewServerOptions: ServerOptions;
	electronRoot: string;
	electronEntry: string;
}

const repoRoot = path.resolve(import.meta.dirname, "../..");
const frontendRoot = path.resolve(repoRoot, "apps/app-frontend");
const electronRoot = path.resolve(repoRoot, "apps/app-electron");

const config: RepoConfig = {
	repoRoot,
	frontendRoot,
	electronRoot,
	frontendBuildDir: path.resolve(frontendRoot, "dist"),
	frontendDevServerOptions: { port: 5321, host: "0.0.0.0" },
	frontendPreviewServerOptions: { port: 5321, host: "0.0.0.0" },
	electronEntry: path.resolve(electronRoot, electronPackageJson.main),
};

export { config };
