import { pluginPerfectionist } from "../plugins";
import type { PerfectionistConfig, TypedFlatConfigItem } from "../types";

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @param config - An optional configuration object for the plugin.
 * @returns The configuration.
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(
	config?: PerfectionistConfig,
): Promise<Array<TypedFlatConfigItem>> {
	const { customClassGroups = [] } = config ?? {};

	const customGroups = customClassGroups.reduce((previousValue, currentValue) => {
		return {
			...previousValue,
			[currentValue]: currentValue,
		};
	}, {});

	return [
		{
			name: "style/perfectionist",
			plugins: {
				perfectionist: pluginPerfectionist,
			},
			rules: {
				"perfectionist/sort-array-includes": ["error", { type: "natural" }],
				"perfectionist/sort-classes": [
					"warn",
					{
						customGroups: {
							...customGroups,
						},
						groups: [
							"private-static-readonly-property",
							"private-readonly-property",
							"private-static-property",
							"private-property",

							"protected-static-readonly-property",
							"protected-readonly-property",
							"protected-static-property",
							"protected-property",

							"public-static-readonly-property",
							"public-readonly-property",
							"public-static-property",
							"public-property",

							"constructor",

							...customClassGroups,
						],
						type: "natural",
					},
				],
				"perfectionist/sort-enums": [
					"error",
					{ partitionByComment: "Part:**", type: "natural" },
				],
				"perfectionist/sort-interfaces": [
					"error",
					{
						customGroups: { callbacks: ["on[A-Z]*"] },
						groups: ["unknown", "callbacks"],
						type: "natural",
					},
				],
				"perfectionist/sort-intersection-types": ["error", { type: "natural" }],
				"perfectionist/sort-jsx-props": "off",
				"perfectionist/sort-maps": ["error", { type: "natural" }],
				"perfectionist/sort-object-types": ["error", { type: "natural" }],
				"perfectionist/sort-objects": [
					"error",
					{ partitionByComment: "Part:**", type: "natural" },
				],
				"perfectionist/sort-switch-case": ["error", { type: "natural" }],
				"perfectionist/sort-union-types": ["error", { type: "natural" }],
				"perfectionist/sort-variable-declarations": ["error", { type: "natural" }],
			},
		},
	];
}
