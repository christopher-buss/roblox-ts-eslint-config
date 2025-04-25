import process from "node:process";

import { GLOB_LUA, GLOB_SRC } from "../globs";
import { pluginFormatLua, pluginRobloxTS, pluginSentinel } from "../plugins";
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

	const [parserTs] = await Promise.all([
		interopDefault(import("@typescript-eslint/parser")),
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
			roblox: pluginRobloxTS,
			sentinel: pluginSentinel,
		},
		/* eslint-disable no-inline-comments -- For replacements */
		rules: {
			"roblox/lua-truthiness": "warn",
			"roblox/misleading-luatuple-checks": "warn",
			"roblox/no-array-pairs": "warn",
			"roblox/no-enum-merging": "error",
			"roblox/no-for-in": "error",
			"roblox/no-function-expression-id": "error",
			"roblox/no-getters-or-setters": "error",
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

			"sentinel/explicit-size-check": "error",

			"ts/no-explicit-any": "error",

			// Part: Replacements
			"roblox/no-any": "off", // -> @typescript-eslint/no-explicit-any
			"roblox/no-export-assignment-let": "off", // -> import/no-mutable-exports

			...(stylistic
				? {
						"sentinel/prefer-math-min-max": "error",
					}
				: {}),
		},
		/* eslint-enable no-inline-comments */
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
