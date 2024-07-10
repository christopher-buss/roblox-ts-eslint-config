import { GLOB_SRC_EXT } from "src/globs";

import { pluginAntfu, pluginImport, pluginSimpleImportSort } from "../plugins";
import type { OptionsStylistic, TypedFlatConfigItem } from "../types";

export async function imports(options: OptionsStylistic = {}): Promise<Array<TypedFlatConfigItem>> {
	const { stylistic = true } = options;

	return [
		{
			name: "style:imports",
			plugins: {
				antfu: pluginAntfu,
				import: pluginImport,
			},
			rules: {
				"antfu/import-dedupe": "error",
				"antfu/no-import-dist": "error",
				"antfu/no-import-node-modules-by-path": "error",

				"import/first": "error",
				"import/no-duplicates": "error",
				"import/no-mutable-exports": "error",
				"import/no-named-default": "error",
				"import/no-self-import": "error",
				"import/no-webpack-loader-syntax": "off",
				"import/order": "off",

				...(stylistic
					? {
							"import/newline-after-import": [
								"error",
								{ considerComments: true, count: 1 },
							],
						}
					: {}),
			},
		},
		{
			languageOptions: {
				parserOptions: {
					sourceType: "script",
				},
			},
			name: "style:import-sort",
			plugins: {
				"simple-import-sort": pluginSimpleImportSort,
			},
			rules: {
				"simple-import-sort/exports": "error",
				"simple-import-sort/imports": [
					"error",
					{
						groups: [["^react"], ["@?"], ["^\\w"], ["^\\."]],
					},
				],
			},
		},
		{
			files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
			name: "antfu/imports/disables/bin",
			rules: {
				"antfu/no-import-dist": "off",
				"antfu/no-import-node-modules-by-path": "off",
			},
		},
	];
}
