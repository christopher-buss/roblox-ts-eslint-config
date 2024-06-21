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

	const robloxPackage = require.resolve("@isentinel/dict-roblox");
	const urlRobloxPackage = pathToFileURL(robloxPackage);
	const urlRoblox = new URL("dict/roblox.txt", urlRobloxPackage);

	return [
		{
			files,
			name: "style:spelling",
			plugins: {
				["@cspell"]: pluginCspell,
			},
			rules: {
				"@cspell/spellchecker": [
					"warn",
					{
						autoFix: false,
						checkComments: true,
						cspell: {
							dictionaries: ["roblox"],
							dictionaryDefinitions: [
								{
									name: "roblox",
									path: urlRoblox.href,
								},
							],
							language,
							words: ["isentinel"],
						},
						// debugMode: true,
						generateSuggestions: true,
						numSuggestions: 8,
					},
				],
			},
		},
	];
}
