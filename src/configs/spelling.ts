import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { GLOB_SRC } from "src";
import { pluginCspell } from "src/plugins";

import type {
	OptionsComponentExtensions,
	OptionsFiles,
	SpellCheckConfig,
	TypedFlatConfigItem,
} from "../types";

const require = createRequire(import.meta.url);

export async function spelling(
	options: OptionsComponentExtensions & OptionsFiles & SpellCheckConfig = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { componentExts: componentExtensions = [], language = "en-US" } = options;

	const files = options.files ?? [
		GLOB_SRC,
		...componentExtensions.map(extension => `**/*.${extension}`),
	];

	const robloxDictionary = require.resolve("@isentinel/dict-roblox");
	const urlRobloxDictionary = pathToFileURL(robloxDictionary);
	const urlRoblox = new URL("dict/roblox.txt", urlRobloxDictionary);

	const rbxtsDictionary = require.resolve("@isentinel/dict-rbxts");
	const urlRbxtsDictionary = pathToFileURL(rbxtsDictionary);
	const urlRbxts = new URL("dict/rbxts.txt", urlRbxtsDictionary);

	return [
		{
			files,
			name: "style/spelling",
			plugins: {
				"@cspell": pluginCspell,
			},
			rules: {
				"@cspell/spellchecker": [
					"warn",
					{
						autoFix: false,
						checkComments: true,
						cspell: {
							dictionaries: ["roblox", "rbxts"],
							dictionaryDefinitions: [
								{
									name: "roblox",
									path: urlRoblox.href,
								},
								{
									name: "rbxts",
									path: urlRbxts.href,
								},
							],
							language,
							words: ["isentinel"],
						},
						generateSuggestions: true,
						numSuggestions: 8,
					},
				],
			},
		},
	];
}
