import process from "node:process";

import { GLOB_LUA, GLOB_SRC } from "../globs";
import type {
	OptionsComponentExtensions,
	OptionsFiles,
	OptionsOverrides,
	OptionsStylistic,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";
import { interopDefault, parserPlain, toArray } from "../utils";

export async function roblox(
	options: OptionsComponentExtensions &
		OptionsFiles &
		OptionsOverrides &
		OptionsStylistic &
		OptionsTypeScriptParserOptions &
		OptionsTypeScriptWithTypes = {},
	formatLua = true,
): Promise<Array<TypedFlatConfigItem>> {
	const {
		componentExts: componentExtensions = [],
		parserOptions = {},
		stylistic = true,
	} = options;

	const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined;

	const [parserTs, pluginRobloxTs, pluginSentinel, pluginFormatLua] = await Promise.all([
		interopDefault(import("@typescript-eslint/parser")),
		interopDefault(import("eslint-plugin-roblox-ts-x")),
		interopDefault(import("eslint-plugin-sentinel")),
		interopDefault(import("eslint-plugin-format-lua")),
	] as const);

	const files = options.files ?? [
		GLOB_SRC,
		...componentExtensions.map(extension => `**/*.${extension}`),
	];

	const configs: Array<TypedFlatConfigItem> = [];

	configs.push({
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
		name: "style/roblox",
		plugins: {
			roblox: pluginRobloxTs,
			sentinel: pluginSentinel,
		},
		rules: {
			"roblox/lua-truthiness": "warn",
			"roblox/misleading-lua-tuple-checks": "error",
			"roblox/no-any": "error",
			"roblox/no-array-pairs": "warn",
			"roblox/no-enum-merging": "error",
			"roblox/no-export-assignment-let": "error",
			"roblox/no-for-in": "error",
			"roblox/no-function-expression-name": "error",
			"roblox/no-get-set": "error",
			"roblox/no-namespace-merging": "error",
			"roblox/no-null": "error",
			"roblox/no-object-math": "error",
			"roblox/no-post-fix-new": "error",
			"roblox/no-preceding-spread-element": "error",
			"roblox/no-private-identifier": "error",
			"roblox/no-unsupported-syntax": "error",
			"roblox/no-value-typeof": "error",
			"roblox/prefer-task-library": "error",
			"roblox/size-method": "error",

			"sentinel/explicit-size-check": "error",

			...(stylistic
				? {
						"sentinel/prefer-math-min-max": "error",
					}
				: {}),
		},
	});

	if (formatLua) {
		configs.push({
			files: [GLOB_LUA],
			languageOptions: {
				parser: parserPlain,
			},
			plugins: {
				"format-lua": pluginFormatLua,
			},
			rules: {
				"format-lua/stylua": "error",
			},
		});
	}

	return configs;
}
