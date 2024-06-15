import { fixupPluginRules } from "@eslint/compat";

import { pluginPromise } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function promise(): Promise<Array<TypedFlatConfigItem>> {
	return [
		{
			name: "style:promise",
			plugins: {
				promise: fixupPluginRules(pluginPromise),
			},
			rules: {
				"promise/always-return": [
					"error",
					{
						ignoreLastCallback: true,
					},
				],
				"promise/avoid-new": "off",
				"promise/catch-or-return": [
					"error",
					{
						allowFinally: true,
						allowThen: true,
					},
				],
				"promise/no-callback-in-promise": "off",
				// TODO: Enable this rule eslint-community/eslint-plugin-promise#472
				"promise/no-multiple-resolved": "off",
				"promise/no-native": "off",
				"promise/no-nesting": "warn",
				"promise/no-new-statics": "off",
				"promise/no-promise-in-callback": "warn",
				"promise/no-return-in-finally": "warn",
				"promise/no-return-wrap": "error",
				"promise/param-names": "warn",
				"promise/prefer-await-to-callbacks": "off",
				"promise/prefer-await-to-then": "off",
			},
		},
	];
}
