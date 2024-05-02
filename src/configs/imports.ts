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
	];
}
