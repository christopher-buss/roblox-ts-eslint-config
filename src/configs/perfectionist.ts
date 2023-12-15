import { pluginPerfectionist } from "../plugins";
import type { FlatConfigItem } from "../types";

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(): Promise<Array<FlatConfigItem>> {
	return [
		{
			name: "style:perfectionist",
			plugins: {
				perfectionist: pluginPerfectionist,
			},
			rules: {
				"perfectionist/sort-array-includes": ["error", { type: "natural" }],
				"perfectionist/sort-classes": ["off"],
				"perfectionist/sort-enums": ["error", { type: "natural" }],
				"perfectionist/sort-interfaces": ["error", { type: "natural" }],
				"perfectionist/sort-jsx-props": ["error", { type: "natural" }],
				"perfectionist/sort-maps": ["error", { type: "natural" }],
				"perfectionist/sort-object-types": ["error", { type: "natural" }],
				"perfectionist/sort-objects": ["error", { type: "natural" }],
			},
		},
	];
}
