import { fixupPluginRules } from "@eslint/compat";

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
				"comment-length/limit-multi-line-comments": [
					"warn",
					{
						ignoreUrls: true,
						maxLength: 80,
					},
				],
				"comment-length/limit-single-line-comments": [
					"warn",
					{
						ignoreUrls: true,
						maxLength: 80,
					},
				],
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
	];
}
