import { fixupPluginRules } from "@eslint/compat";

import { GLOB_YAML } from "src/globs";
import type { TypedFlatConfigItem } from "src/types";

import { pluginCommentLength, pluginComments } from "../plugins";

export async function comments(): Promise<Array<TypedFlatConfigItem>> {
	return [
		{
			name: "style:eslint-comments",
			plugins: {
				"comment-length": fixupPluginRules(pluginCommentLength),
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

				"no-inline-comments": "error",
				"style/multiline-comment-style": ["error", "separate-lines"],
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
