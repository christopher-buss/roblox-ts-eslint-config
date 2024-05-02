import { eslintPluginShopify } from "../plugins";
import type { FlatConfigItem } from "../types";

export async function shopify(): Promise<Array<FlatConfigItem>> {
	return [
		{
			name: "style:shopify",
			plugins: {
				shopify: eslintPluginShopify,
			},
			rules: {
				"shopify/prefer-class-properties": "error",
				"shopify/prefer-early-return": ["error", { maximumStatements: 1 }],
				"shopify/prefer-module-scope-constants": "error",
				"shopify/strict-component-boundaries": "error",
				"shopify/typescript/prefer-pascal-case-enums": "error",
				"shopify/typescript/prefer-singular-enums": "error",
			},
		},
	];
}
