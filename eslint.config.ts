// @ts-expect-error missing types
import styleMigrate from "@stylistic/eslint-plugin-migrate";

import style from "./dist/index.js";

export default style(
	{
		ignores: ["fixtures", "_fixtures", "src/typegen.d.ts"],
		roblox: false,
	},
	{
		files: ["src/**/*.ts"],
		rules: {
			"max-lines-per-function": "off",
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
