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
				"shopify/prefer-early-return": ["error", { maximumStatements: 1 }],
			},
		},
	];
}
