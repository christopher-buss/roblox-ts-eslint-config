import { GLOB_YAML } from "../globs";
import { pluginCommentLength, pluginComments } from "../plugins";
import type { OptionsStylistic, TypedFlatConfigItem } from "../types";

export async function comments(
	options: OptionsStylistic = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { stylistic = true } = options;

	return [
		{
			name: "style/eslint/comments",
			plugins: {
				"comment-length": pluginCommentLength,
				"eslint-comments": pluginComments,
			},
			rules: {
				// We cover these with prettier
				"comment-length/limit-multi-line-comments": "off",
				"comment-length/limit-single-line-comments": "off",

				"eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
				"eslint-comments/no-aggregating-enable": "error",
				"eslint-comments/no-duplicate-disable": "error",
				"eslint-comments/no-unlimited-disable": "error",
				"eslint-comments/no-unused-enable": "error",
				"eslint-comments/require-description": [
					"error",
					{
						ignore: ["eslint-enable"],
					},
				],

				...(stylistic
					? {
							"no-inline-comments": "error",
							"style/multiline-comment-style": ["error", "separate-lines"],
						}
					: {}),
			},
		},
		{
			files: [GLOB_YAML],
			rules: {
				// TODO: Seems to be a false positive
				"comment-length/limit-multi-line-comments": "off",
				"no-inline-comments": "off",
			},
		},
	];
}
