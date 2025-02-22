// @ts-expect-error missing types
import styleMigrate from "@stylistic/eslint-plugin-migrate";

// eslint-disable-next-line antfu/no-import-dist -- Need the compiled version.
import { style } from "./dist";

export default style(
	{
		ignores: ["fixtures", "_fixtures", "src/typegen.d.ts"],
		roblox: false,
		test: true,
		type: "package",
	},
	{
		files: ["src/**/*.ts"],
		rules: {
			"max-lines-per-function": "off",
			"sonar/cognitive-complexity": "off",
		},
	},
	{
		files: ["src/configs/*.ts"],
		plugins: {
			"style-migrate": styleMigrate,
		},
		rules: {
			"style-migrate/migrate": ["error", { namespaceTo: "style" }],
		},
	},
);
