import { pluginAntfu, pluginArrowReturnStyle } from "../plugins";
import type { StylisticConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export const StylisticConfigDefaults: StylisticConfig = {
	indent: "tab",
	jsx: true,
	quotes: "double",
	semi: true,
};

export async function stylistic(
	options: StylisticConfig = {},
): Promise<Array<TypedFlatConfigItem>> {
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
				"arrow-style": pluginArrowReturnStyle,
				style: pluginStylistic,
			},
			rules: {
				...config.rules,

				"antfu/consistent-list-newline": "error",
				"antfu/if-newline": "off",
				"antfu/top-level-function": "error",

				"arrow-style/arrow-return-style": [
					"warn",
					{
						jsxAlwaysUseExplicitReturn: true,
						maxLen: 80,
					},
				],

				"arrow-style/no-export-default-arrow": "warn",

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
					{
						blankLine: "any",
						next: "*",
						prev: ["do"],
					},
				],
			},
		},
	];
}
