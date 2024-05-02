// eslint-disable-next-line ts/ban-ts-comment -- /
// @ts-nocheck
import styleMigrate from "@stylistic/eslint-plugin-migrate";

import style from "./dist/index.js";

export default style(
	{
		formatters: true,
		ignores: ["fixtures", "_fixtures", "src/typegen.d.ts"],
		react: true,
		roblox: false,
	},
	{
		files: ["src/**/*.ts"],
		rules: {
			"perfectionist/sort-objects": [
				"error",
				{
					order: "asc",
					"partition-by-comment": "Part:**",
					type: "natural",
				},
			],
			"sonar/cognitive-complexity": "off",
		},
	},
	{
		files: ["src/configs/*.ts"],
		plugins: {
			"style-migrate": styleMigrate,
		},
		rules: {
			"style-migrate/migrate": ["error", { namespaceTo: "style" }],
		},
	},
);
