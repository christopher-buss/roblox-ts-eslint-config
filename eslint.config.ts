// @ts-expect-error missing types
import styleMigrate from "@stylistic/eslint-plugin-migrate";

import style from "./dist/index.js";

export default style(
	{
		formatters: {
			prettierOptions: {
				arrowParens: "avoid",
				jsdocPreferCodeFences: true,
				jsdocPrintWidth: 80,
				plugins: ["prettier-plugin-jsdoc"],
				printWidth: 100,
				semi: true,
				singleQuote: false,
				tabWidth: 4,
				trailingComma: "all",
				tsdoc: true,
				useTabs: true,
			},
		},
		ignores: ["fixtures", "_fixtures", "src/typegen.d.ts"],
		react: false,
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
