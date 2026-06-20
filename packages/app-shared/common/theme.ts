import { z } from "zod";

const THEME_SOURCES = ["system", "light", "dark"] as const;

const themeSourceSchema = z.union(
	THEME_SOURCES.map((source) => z.literal(source)),
);

type ThemeSource = z.infer<typeof themeSourceSchema>;

export { THEME_SOURCES, themeSourceSchema };
export type { ThemeSource };
