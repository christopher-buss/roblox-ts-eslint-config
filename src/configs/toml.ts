import { GLOB_TOML } from "../globs";
import type {
	OptionsFiles,
	OptionsOverrides,
	OptionsStylistic,
	TypedFlatConfigItem,
} from "../types";
import { interopDefault } from "../utils";

export async function toml(
	options: OptionsFiles & OptionsOverrides & OptionsStylistic = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { files = [GLOB_TOML], overrides = {}, stylistic = true } = options;

	const { indent = 2 } = typeof stylistic === "boolean" ? {} : stylistic;

	const [pluginToml, parserToml] = await Promise.all([
		interopDefault(import("eslint-plugin-toml")),
		interopDefault(import("toml-eslint-parser")),
	] as const);

	return [
		{
			name: "style/toml/setup",
			plugins: {
				toml: pluginToml,
			},
		},
		{
			files,
			languageOptions: {
				parser: parserToml,
			},
			name: "style/toml/rules",
			rules: {
				"style/spaced-comment": "off",

				"toml/comma-style": "error",
				"toml/keys-order": "error",
				"toml/no-space-dots": "error",
				"toml/no-unreadable-number-separator": "error",
				"toml/precision-of-fractional-seconds": "error",
				"toml/precision-of-integer": "error",
				"toml/tables-order": "error",

				...(stylistic
					? {
							"toml/array-bracket-newline": "error",
							"toml/array-bracket-spacing": "error",
							"toml/array-element-newline": "error",
							"toml/indent": ["error", indent === "tab" ? 2 : indent],
							"toml/inline-table-curly-spacing": "error",
							"toml/key-spacing": "error",
							"toml/padding-line-between-pairs": "error",
							"toml/padding-line-between-tables": "error",
							"toml/quoted-keys": "error",
							"toml/spaced-comment": "error",
							"toml/table-bracket-spacing": "error",
						}
					: {}),

				...overrides,
			},
		},
	];
}
