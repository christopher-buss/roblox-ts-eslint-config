import { pluginPackageJson } from "../plugins";
import type { OptionsProjectType, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export async function packageJson(
	options: OptionsProjectType = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { type = "game" } = options;

	return [
		{
			files: ["**/package.json"],
			languageOptions: {
				parser: await interopDefault(import("jsonc-eslint-parser")),
			},
			name: "style/package-json",
			plugins: {
				"package-json": pluginPackageJson,
			},
			rules: {
				"package-json/no-empty-fields": "error",
				"package-json/no-redundant-files": "error",
				"package-json/order-properties": "error",
				"package-json/repository-shorthand": "error",
				"package-json/sort-collections": "error",
				"package-json/unique-dependencies": "error",
				"package-json/valid-local-dependency": "error",
				"package-json/valid-name": "error",
				"package-json/valid-package-definition": "error",
				"package-json/valid-repository-directory": "error",
				"package-json/valid-version": "error",

				...(type === "package"
					? {
							"package-json/require-author": "error",
							"package-json/require-files": "error",
							"package-json/require-keywords": "error",
							"package-json/require-name": "error",
							"package-json/require-types": "error",
							"package-json/require-version": "error",
						}
					: {}),
			},
		},
	];
}
