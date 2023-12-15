import { interopDefault } from "../utils";
import type { FlatConfigItem, StylisticConfig } from "../types";
import { pluginAntfu } from "../plugins";

export const StylisticConfigDefaults: StylisticConfig = {
	indent: 4,
	jsx: true,
	quotes: "single",
	semi: false,
};

export async function stylistic(options: StylisticConfig = {}): Promise<Array<FlatConfigItem>> {
	const { indent, jsx, quotes, semi } = {
		...StylisticConfigDefaults,
		...options,
	};

	const pluginStylistic = await interopDefault(import("@stylistic/eslint-plugin"));

	const config = pluginStylistic.configs.customize({
		flat: true,
		indent,
		jsx,
		pluginName: "style",
		quotes,
		semi,
	});

	return [
		{
			name: "style:stylistic",
			plugins: {
				antfu: pluginAntfu,
				style: pluginStylistic,
			},
			rules: {
				...config.rules,

				"antfu/consistent-list-newline": "error",
				"antfu/if-newline": "off",
				"antfu/top-level-function": "error",

				curly: ["error", "all"],

				"style/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],

				"style/padding-line-between-statements": [
					"error",
					{
						blankLine: "always",
						next: "*",
						prev: ["block", "block-like", "class", "export", "import"],
					},
					{
						blankLine: "never",
						next: "*",
						prev: ["case"],
					},
					{
						blankLine: "any",
						next: ["export", "import"],
						prev: ["export", "import"],
					},
				],
			},
		},
	];
}
