import { z } from "zod";

const THEME_SOURCES = ["system", "light", "dark"] as const;

type ThemeSource = (typeof THEME_SOURCES)[number];

const themeSourceSchema: z.ZodType<ThemeSource> = z.union(
	THEME_SOURCES.map((source) => z.literal(source)),
);

export { THEME_SOURCES, themeSourceSchema };
export type { ThemeSource };
