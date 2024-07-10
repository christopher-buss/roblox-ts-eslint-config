import type { TypedFlatConfigItem } from "src";
import { pluginPackageJson } from "src/plugins";
import { interopDefault } from "src/utils";

export async function packageJson(): Promise<Array<TypedFlatConfigItem>> {
	return [
		{
			files: ["**/package.json"],
			languageOptions: {
				parser: await interopDefault(import("jsonc-eslint-parser")),
			},
			name: "style:package-json",
			plugins: {
				"package-json": pluginPackageJson,
			},
			rules: {
				"package-json/order-properties": "error",
				"package-json/repository-shorthand": "error",
				"package-json/sort-collections": "error",
				"package-json/unique-dependencies": "error",
				"package-json/valid-local-dependency": "error",
				"package-json/valid-name": "error",
				"package-json/valid-package-def": "error",
				"package-json/valid-repository-directory": "error",
				"package-json/valid-version": "error",
			},
		},
	];
}
