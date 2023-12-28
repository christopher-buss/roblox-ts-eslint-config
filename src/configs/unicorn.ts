import { pluginUnicorn } from "../plugins";
import type { FlatConfigItem } from "../types";

export async function unicorn(): Promise<Array<FlatConfigItem>> {
	return [
		{
			name: "style:unicorn",
			plugins: {
				unicorn: pluginUnicorn,
			},
			rules: {
				// The auto-fix here does not support roblox-ts well, but the
				"unicorn/catch-error-name": [
					"error",
					{
						name: "err",
					},
				],
				"unicorn/consistent-destructuring": "error",
				"unicorn/consistent-function-scoping": "error",
				"unicorn/no-array-for-each": "error",
				"unicorn/no-lonely-if": "error",
				"unicorn/no-negated-condition": "off",
				"unicorn/no-nested-ternary": "error",
				"unicorn/no-static-only-class": "error",
				"unicorn/no-unused-properties": "error",
				"unicorn/no-useless-promise-resolve-reject": "error",
				"unicorn/no-useless-undefined": ["error", { checkArguments: false }],
				"unicorn/number-literal-case": "error",
				"unicorn/prefer-logical-operator-over-ternary": "error",
				"unicorn/prefer-switch": "error",
				"unicorn/prefer-ternary": ["error", "only-single-line"],
				"unicorn/prevent-abbreviations": [
					"error",
					{
						replacements: {
							args: false,
							dist: {
								distance: true,
							},
							e: {
								err: true,
								error: false,
							},
							err: false,
							fn: {
								func: true,
								function: false,
							},
							func: false,
							inst: {
								instance: true,
							},
							nums: {
								numbers: true,
							},
							pos: {
								position: true,
							},
							props: false,
							ref: false,
							refs: false,
							str: false,
						},
					},
				],
				"unicorn/switch-case-braces": "error",
			},
		},
	];
}
