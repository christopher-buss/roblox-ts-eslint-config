import type { FlatConfigItem } from "../types";
import { pluginUnicorn } from "../plugins";

export async function unicorn(): Promise<Array<FlatConfigItem>> {
	return [
		{
			name: "style:unicorn",
			plugins: {
				unicorn: pluginUnicorn,
			},
			rules: {
				"unicorn/consistent-destructuring": "error",
				"unicorn/consistent-function-scoping": "error",
				// Pass error message when throwing errors
				"unicorn/error-message": "off",
				// Uppercase regex escapes
				"unicorn/escape-case": "off",
				// Array.isArray instead of instanceof
				"unicorn/no-instanceof-array": "off",
				// Ban `new Array` as `Array` constructor's params are ambiguous
				"unicorn/no-new-array": "off",
				// Prevent deprecated `new Buffer()`
				"unicorn/no-new-buffer": "off",
				// Lowercase number formatting for octal, hex, binary (0x1'error' instead of 0X1'error')
				"unicorn/number-literal-case": "error",
				// textContent instead of innerText
				"unicorn/prefer-dom-node-text-content": "off",
				// includes over indexOf when checking for existence
				"unicorn/prefer-includes": "off",
				// Prefer using the node: protocol
				"unicorn/prefer-node-protocol": "off",
				// Prefer using number properties like `Number.isNaN` rather than `isNaN`
				"unicorn/prefer-number-properties": "off",
				// String methods startsWith/endsWith instead of more complicated stuff
				"unicorn/prefer-string-starts-ends-with": "off",
				// Enforce throwing type error when throwing error while checking typeof
				"unicorn/prefer-type-error": "error",
				// Use new when throwing error
				"unicorn/throw-new-error": "error",
			},
		},
	];
}
