import process from "node:process";
import { GLOB_SRC } from "src";
import { pluginRobloxTS } from "src/plugins";
import { interopDefault, toArray } from "src/utils";

import type {
	OptionsComponentExtensions,
	OptionsFiles,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";

export async function roblox(
	options: OptionsComponentExtensions &
		OptionsFiles &
		OptionsOverrides &
		OptionsTypeScriptParserOptions &
		OptionsTypeScriptWithTypes = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { componentExts: componentExtensions = [], parserOptions = {} } = options;

	const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined;

	const [parserTs] = await Promise.all([
		interopDefault(import("@typescript-eslint/parser")),
	] as const);

	const files = options.files ?? [
		GLOB_SRC,
		...componentExtensions.map(extension => `**/*.${extension}`),
	];

	return [
		{
			files,
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					ecmaVersion: 2018,
					sourceType: "script",
					...(tsconfigPath
						? {
								project: tsconfigPath,
								tsconfigRootDir: process.cwd(),
							}
						: {}),
					...(parserOptions as any),
				},
			},
			name: "style:roblox",
			plugins: {
				roblox: pluginRobloxTS,
			},
			rules: {
				"roblox/lua-truthiness": "warn",
				"roblox/misleading-luatuple-checks": "warn",
				"roblox/no-any": "off",
				"roblox/no-array-pairs": "warn",
				"roblox/no-enum-merging": "error",
				// TODO: Enable this rule when it's fixed
				// "roblox/no-export-assignment-let": "error",
				"roblox/no-for-in": "error",
				"roblox/no-function-expression-id": "error",
				"roblox/no-getters-or-setters": "error",
				"roblox/no-global-this": "error",
				"roblox/no-namespace-merging": "error",
				"roblox/no-null": "error",
				"roblox/no-object-math": "error",
				"roblox/no-preceding-spread-element": "error",
				"roblox/no-private-identifier": "error",
				"roblox/no-prototype": "error",
				"roblox/no-rbx-postfix-new": "error",
				"roblox/no-regex": "error",
				"roblox/no-spread-destructuring": "error",
				"roblox/no-value-typeof": "error",

				"ts/no-explicit-any": "error",
			},
		},
	];
}
