import { pluginPerfectionist } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @returns The configuration.
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<Array<TypedFlatConfigItem>> {
	return [
		{
			name: "style/perfectionist",
			plugins: {
				perfectionist: pluginPerfectionist,
			},
			rules: {
				"perfectionist/sort-array-includes": ["error", { type: "natural" }],
				"perfectionist/sort-classes": ["off"],
				"perfectionist/sort-enums": ["error", { type: "natural" }],
				"perfectionist/sort-interfaces": ["error", { type: "natural" }],
				"perfectionist/sort-intersection-types": ["error", { type: "natural" }],
				"perfectionist/sort-jsx-props": "off",
				"perfectionist/sort-maps": ["error", { type: "natural" }],
				"perfectionist/sort-object-types": ["error", { type: "natural" }],
				"perfectionist/sort-objects": ["error", { type: "natural" }],
				"perfectionist/sort-switch-case": ["error", { type: "natural" }],
				"perfectionist/sort-union-types": ["error", { type: "natural" }],
				"perfectionist/sort-variable-declarations": ["error", { type: "natural" }],
			},
		},
	];
}
