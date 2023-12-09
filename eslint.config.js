// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate";
import style from "./dist/index.js";

export default style(
	{
		roblox: false,
		// typescript: {
		// 	parserOptions: {
		// 		ecmaVersion: 2018,
		// 		jsx: true,
		// 		project: "./tsconfig.json",
		// 		sourceType: "module",
		// 		useJSXTextNode: true,
		// 	},
		// 	tsconfigPath: "./tsconfig.json",
		// },
		ignores: ["fixtures", "_fixtures"],
		formatters: true,
	},
	{
		files: ["src/**/*.ts"],
		rules: {
			"perfectionist/sort-objects": "error",
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
