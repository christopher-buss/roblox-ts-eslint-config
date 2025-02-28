import { GLOB_SRC, GLOB_SRC_EXT } from "../globs";
import type { TypedFlatConfigItem } from "../types";

export async function disables(): Promise<Array<TypedFlatConfigItem>> {
	return [
		{
			files: [`**/scripts/${GLOB_SRC}`],
			name: "style/disables/scripts",
			rules: {
				"antfu/no-top-level-await": "off",
				"no-console": "off",
				"ts/explicit-function-return-type": "off",
			},
		},
		{
			files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
			name: "style/disables/cli",
			rules: {
				"antfu/no-top-level-await": "off",
				"no-console": "off",
			},
		},
		{
			files: ["**/bin/**/*", `**/bin.${GLOB_SRC_EXT}`],
			name: "style/disables/bin",
			rules: {
				"antfu/no-import-dist": "off",
				"antfu/no-import-node-modules-by-path": "off",
			},
		},
		{
			files: ["**/*.d.?([cm])ts"],
			name: "style/disables/dts",
			rules: {
				"eslint-comments/no-unlimited-disable": "off",
				"import/no-duplicates": "off",
				"max-lines": "off",
				"no-restricted-syntax": "off",
				"unused-imports/no-unused-vars": "off",
			},
		},
		{
			files: ["**/*.{test,spec}.([tj])s?(x)"],
			name: "style/disables/test",
			rules: {
				"antfu/no-top-level-await": "off",
				"no-unused-expressions": "off",
			},
		},
		{
			files: ["**/*.js", "**/*.cjs"],
			name: "style/disables/cjs",
			rules: {
				"ts/no-require-imports": "off",
			},
		},
	];
}
