import { pluginPromise } from "../plugins";
import type { FlatConfigItem } from "../types";

export async function promise(): Promise<Array<FlatConfigItem>> {
	return [
		{
			name: "style:promise",
			plugins: {
				promise: pluginPromise,
			},
			rules: {
				"promise/always-return": "off",
				"promise/avoid-new": "off",
				"promise/catch-or-return": [
					"error",
					{
						allowFinally: true,
						allowThen: true,
					},
				],
				"promise/no-callback-in-promise": "off",
				"promise/no-multiple-resolved": "warn",
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