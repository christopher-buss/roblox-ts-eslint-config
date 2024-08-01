import type { OptionsStylistic, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export async function jsdoc(options: OptionsStylistic = {}): Promise<Array<TypedFlatConfigItem>> {
	const { stylistic = true } = options;

	return [
		{
			name: "style/jsdoc",
			plugins: {
				jsdoc: await interopDefault(import("eslint-plugin-jsdoc")),
			},
			rules: {
				"jsdoc/check-access": "warn",
				"jsdoc/check-param-names": ["warn", { checkDestructured: false }],
				"jsdoc/check-property-names": "warn",
				"jsdoc/check-types": "warn",
				"jsdoc/convert-to-jsdoc-comments": "warn",
				"jsdoc/empty-tags": "warn",
				"jsdoc/implements-on-classes": "warn",
				"jsdoc/informative-docs": "warn",
				"jsdoc/no-blank-block-descriptions": "warn",
				"jsdoc/no-blank-blocks": "warn",
				"jsdoc/no-defaults": "warn",
				"jsdoc/no-multi-asterisks": "warn",
				"jsdoc/no-types": "warn",
				"jsdoc/require-asterisk-prefix": "warn",
				"jsdoc/require-description": [
					"warn",
					{ exemptedBy: ["hidden, ignore", "inheritdoc", "client", "server"] },
				],
				"jsdoc/require-description-complete-sentence": "warn",
				"jsdoc/require-hyphen-before-param-description": "warn",
				"jsdoc/require-param": [
					"warn",
					{ checkDestructured: false, exemptedBy: ["ignore"] },
				],
				"jsdoc/require-param-description": "warn",
				"jsdoc/require-param-name": "warn",
				"jsdoc/require-property": "warn",
				"jsdoc/require-property-description": "warn",
				"jsdoc/require-property-name": "warn",
				"jsdoc/require-returns": ["warn", { exemptedBy: ["hidden"] }],
				"jsdoc/require-returns-check": "warn",
				"jsdoc/require-returns-description": "warn",
				"jsdoc/require-template": "warn",
				"jsdoc/require-yields-check": "warn",
				"jsdoc/sort-tags": "off",

				...(stylistic
					? {
							"jsdoc/check-alignment": "warn",
							"jsdoc/multiline-blocks": "warn",
						}
					: {}),
			},
		},
	];
}
