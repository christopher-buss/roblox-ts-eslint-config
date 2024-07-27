import { pluginSonar } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

export async function sonarjs(): Promise<Array<TypedFlatConfigItem>> {
	return [
		{
			name: "style/sonarjs",
			plugins: {
				sonar: pluginSonar,
			},
			rules: {
				"sonar/cognitive-complexity": "warn",
				"sonar/elseif-without-else": "off",
				"sonar/max-switch-cases": "error",
				"sonar/no-all-duplicated-branches": "error",
				"sonar/no-collapsible-if": "error",
				"sonar/no-duplicate-string": [
					"error",
					{
						ignoreStrings: "Not implemented",
					},
				],
				"sonar/no-duplicated-branches": "error",
				"sonar/no-element-overwrite": "error",
				"sonar/no-empty-collection": "error",
				"sonar/no-gratuitous-expressions": "off",
				"sonar/no-identical-conditions": "error",
				"sonar/no-identical-expressions": "error",
				"sonar/no-identical-functions": "error",
				"sonar/no-ignored-return": "error",
				"sonar/no-inverted-boolean-check": "error",
				"sonar/no-nested-switch": "error",
				"sonar/no-nested-template-literals": "error",
				"sonar/no-one-iteration-loop": "error",
				"sonar/no-redundant-boolean": "error",
				"sonar/no-redundant-jump": "error",
				"sonar/no-unused-collection": "error",
				"sonar/no-use-of-empty-return-value": "error",
				"sonar/no-useless-catch": "error",
				"sonar/non-existent-operator": "error",
				"sonar/prefer-immediate-return": "error",
				"sonar/prefer-object-literal": "error",
				"sonar/prefer-single-boolean-return": "error",
				"sonar/prefer-while": "error",
			},
		},
	];
}
