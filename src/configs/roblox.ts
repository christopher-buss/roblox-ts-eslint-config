import { pluginRobloxTS } from "src/plugins";
import type { FlatConfigItem } from "../types";

export async function roblox(): Promise<FlatConfigItem[]> {
	return [
		{
			name: "style:roblox",
			plugins: {
				roblox: pluginRobloxTS,
			},
			rules: {
				"roblox/lua-truthiness": "warn",
				"roblox/misleading-luatuple-checks": "warn",
				"roblox/no-any": "off",
				"roblox/no-array-pairs": "warn",
				"roblox/no-enum-merging": "error",
				"roblox/no-export-assignment-let": "error",
				"roblox/no-for-in": "error",
				"roblox/no-function-expression-id": "error",
				"roblox/no-getters-or-setters": "error",
				"roblox/no-global-this": "error",
				"roblox/no-namespace-merging": "error",
				"roblox/no-null": "error",
				"roblox/no-object-math": "error",
				"roblox/no-preceding-spread-element": "error",
				"roblox/no-private-identifier": "error",
				"roblox/no-prototype": "error",
				"roblox/no-rbx-postfix-new": "error",
				"roblox/no-regex": "error",
				"roblox/no-spread-destructuring": "error",
				"roblox/no-value-typeof": "error",

				"ts/no-explicit-any": "error",
			},
		},
	];
}
