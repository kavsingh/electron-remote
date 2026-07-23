import { baseConfig } from "code-config/oxlint";
import { defineConfig } from "oxlint";

import type { OxlintConfig } from "oxlint";

const config: OxlintConfig = defineConfig({ extends: [baseConfig] });

export default config;
