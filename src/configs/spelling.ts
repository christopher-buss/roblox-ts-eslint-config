import { GLOB_SRC } from "src";
import { pluginCspell } from "src/plugins";

import type { OptionsComponentExtensions, OptionsFiles, TypedFlatConfigItem } from "../types";

export async function spelling(
	options: OptionsComponentExtensions & OptionsFiles = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { componentExts: componentExtensions = [] } = options;

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
							language: "en-US",
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
