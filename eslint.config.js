// @ts-check
import styleMigrate from "@stylistic/eslint-plugin-migrate";
import style from "./dist/index.js";

export default style(
	{
		roblox: true,
		typescript: true,
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
