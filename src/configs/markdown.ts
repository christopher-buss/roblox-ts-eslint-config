import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";

import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from "../globs";
import type {
	OptionsComponentExtensions,
	OptionsFiles,
	OptionsOverrides,
	TypedFlatConfigItem,
} from "../types";
import { interopDefault, parserPlain } from "../utils";

export async function markdown(
	options: OptionsComponentExtensions & OptionsFiles & OptionsOverrides = {},
): Promise<Array<TypedFlatConfigItem>> {
	const {
		componentExts: componentExtensions = [],
		files = [GLOB_MARKDOWN],
		overrides = {},
	} = options;

	const markdownPlugin = await interopDefault(import("@eslint/markdown"));

	return [
		{
			name: "style/markdown/setup",
			plugins: {
				markdownPlugin,
			},
		},
		{
			files,
			ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
			name: "style/markdown/processor",
			// `eslint-plugin-markdown` only creates virtual files for code blocks,
			// but not the markdown file itself. We use `eslint-merge-processors` to
			// add a pass-through processor for the markdown file itself.
			processor: mergeProcessors([markdownPlugin.processors.markdown, processorPassThrough]),
		},
		{
			files,
			languageOptions: {
				parser: parserPlain,
			},
			name: "style/markdown/parser",
		},
		{
			files: [
				GLOB_MARKDOWN_CODE,
				...componentExtensions.map((extension) => `${GLOB_MARKDOWN}/**/*.${extension}`),
			],
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						impliedStrict: true,
					},
				},
			},
			name: "style/markdown/disables",
			rules: {
				"antfu/no-top-level-await": "off",

				"import/newline-after-import": "off",

				"no-alert": "off",
				"no-console": "off",
				"no-labels": "off",
				"no-lone-blocks": "off",
				"no-restricted-syntax": "off",
				"no-undef": "off",
				"no-unused-expressions": "off",
				"no-unused-labels": "off",
				"no-unused-vars": "off",

				"node/prefer-global/process": "off",
				"style/comma-dangle": "off",

				"style/eol-last": "off",
				"ts/consistent-type-imports": "off",
				"ts/no-namespace": "off",
				"ts/no-redeclare": "off",
				"ts/no-require-imports": "off",
				"ts/no-unused-vars": "off",
				"ts/no-use-before-define": "off",
				"ts/no-var-requires": "off",

				"unicode-bom": "off",
				"unused-imports/no-unused-imports": "off",
				"unused-imports/no-unused-vars": "off",

				...overrides,
			},
		},
	];
}
