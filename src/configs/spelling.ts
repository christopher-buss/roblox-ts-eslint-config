import { GLOB_SRC } from "src";
import { pluginCspell } from "src/plugins";

import type {
	OptionsComponentExtensions,
	OptionsFiles,
	SpellCheckConfig,
	TypedFlatConfigItem,
} from "../types";

export async function spelling(
	options: OptionsComponentExtensions & OptionsFiles & SpellCheckConfig = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { componentExts: componentExtensions = [], language = "en-US" } = options;

	const files = options.files ?? [
		GLOB_SRC,
		...componentExtensions.map(extension => `**/*.${extension}`),
	];

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
							import: ["@isentinel/dict-roblox"],
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
