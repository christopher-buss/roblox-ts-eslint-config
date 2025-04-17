import { GLOB_SRC } from "src/globs";

import { pluginAntfu, pluginImport, pluginSimpleImportSort } from "../plugins";
import type { OptionsProjectType, OptionsStylistic, TypedFlatConfigItem } from "../types";

export async function imports(
	options: OptionsProjectType & OptionsStylistic = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { stylistic = true, type = "game" } = options;

	return [
		{
			name: "style/imports",
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
				"import/no-namespace": "error",
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
		stylistic
			? {
					languageOptions: {
						parserOptions: {
							sourceType: "script",
						},
					},
					name: "style/import-sort",
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
				}
			: {},
		...(type === "game"
			? [
					{
						files: [`src/${GLOB_SRC}`],
						name: "style/imports/game",
						rules: {
							"no-restricted-syntax": [
								"error",
								{
									message: "Prefer named exports",
									selector: "ExportDefaultDeclaration",
								},
							],
						} satisfies TypedFlatConfigItem["rules"],
					},
				]
			: []),
	];
}
