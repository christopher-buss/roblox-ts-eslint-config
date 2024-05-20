import { fixupPluginRules } from "@eslint/compat";

import { GLOB_TS, GLOB_TSX } from "../globs";
import type {
	OptionsFiles,
	OptionsTypeScriptWithTypes,
	ReactConfig,
	TypedFlatConfigItem,
} from "../types";
import { ensurePackages, interopDefault, toArray } from "../utils";

export async function react(
	options: OptionsFiles & OptionsTypeScriptWithTypes & ReactConfig = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { files = [GLOB_TS, GLOB_TSX], overrides = {} } = options;

	await ensurePackages(["@eslint-react/eslint-plugin", "eslint-plugin-react-hooks"]);

	const [pluginReact, pluginReactHooks, pluginStylistic, parserTs] = await Promise.all([
		interopDefault(import("@eslint-react/eslint-plugin")),
		interopDefault(import("eslint-plugin-react-hooks")),
		interopDefault(import("@stylistic/eslint-plugin")),
		interopDefault(import("@typescript-eslint/parser")),
	] as const);

	const plugins = pluginReact.configs.all.plugins;

	const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined;

	return [
		{
			name: "style:react:setup",
			plugins: {
				react: plugins["@eslint-react"],
				"react-hooks": fixupPluginRules(pluginReactHooks),
				"react-hooks-extra": plugins["@eslint-react/hooks-extra"],
				"react-naming-convention": plugins["@eslint-react/naming-convention"],
				style: pluginStylistic,
			},
		},
		{
			files,
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					project: tsconfigPath,
				},
				sourceType: "module",
			},
			name: "style:react:rules",
			rules: {
				// recommended rules from @eslint-react
				"react/ensure-forward-ref-using-ref": "warn",
				"react/no-access-state-in-setstate": "error",
				"react/no-array-index-key": "warn",
				"react/no-children-count": "warn",
				"react/no-children-for-each": "warn",
				"react/no-children-map": "warn",
				"react/no-children-only": "warn",
				"react/no-children-prop": "warn",
				"react/no-children-to-array": "warn",
				"react/no-class-component": "error",
				"react/no-clone-element": "warn",
				"react/no-comment-textnodes": "warn",
				"react/no-complicated-conditional-rendering": "off",
				"react/no-component-will-mount": "error",
				"react/no-component-will-receive-props": "error",
				"react/no-component-will-update": "error",
				"react/no-create-ref": "error",
				"react/no-direct-mutation-state": "error",
				"react/no-duplicate-key": "error",
				"react/no-implicit-key": "off",
				"react/no-leaked-conditional-rendering": "warn",
				"react/no-missing-key": "error",
				"react/no-nested-components": "warn",
				"react/no-redundant-should-component-update": "error",
				"react/no-set-state-in-component-did-mount": "warn",
				"react/no-set-state-in-component-did-update": "warn",
				"react/no-set-state-in-component-will-update": "warn",
				"react/no-string-refs": "off",
				"react/no-unsafe-component-will-mount": "off",
				"react/no-unsafe-component-will-receive-props": "off",
				"react/no-unsafe-component-will-update": "off",
				"react/no-unstable-context-value": "error",
				"react/no-unstable-default-props": "error",
				"react/no-unused-class-component-members": "warn",
				"react/no-unused-state": "warn",
				"react/no-useless-fragment": "warn",
				"react/prefer-destructuring-assignment": "warn",
				"react/prefer-shorthand-boolean": "off",
				"react/prefer-shorthand-fragment": "warn",

				// recommended rules react-hooks
				"react-hooks/exhaustive-deps": "warn",
				"react-hooks/rules-of-hooks": "error",
				// recommended rules from @eslint-react/hooks-extra
				"react-hooks-extra/ensure-custom-hooks-using-other-hooks": "error",
				"react-hooks-extra/ensure-use-callback-has-non-empty-deps": "error",
				"react-hooks-extra/ensure-use-memo-has-non-empty-deps": "error",
				"react-hooks-extra/prefer-use-state-lazy-initialization": "error",
				// recommended rules from @eslint-react/naming-convention
				"react-naming-convention/use-state": "error",

				// "react/destructuring-assignment": [
				// 	"error",
				// 	"always",
				// 	{
				// 		destructureInSignature: "always",
				// 	},
				// ],
				// "react/display-name": "off",
				// "react/function-component-definition": "error",
				// "react/hook-use-state": "error",
				// "react/jsx-boolean-value": ["error", "always"],
				// "react/jsx-fragments": "error",
				// "react/jsx-handler-names": "error",
				// "react/jsx-key": "error",
				// "react/jsx-max-depth": [
				// 	"error",
				// 	{
				// 		max: 5,
				// 	},
				// ],
				// "react/jsx-no-bind": "error",
				// "react/jsx-no-comment-textnodes": "error",
				// "react/jsx-no-duplicate-props": "error",
				// "react/jsx-no-leaked-render": "error",
				// "react/jsx-no-target-blank": "error",
				// "react/jsx-no-undef": "off",
				// "react/jsx-uses-react": "error",
				// "react/jsx-uses-vars": "error",
				// "react/no-children-prop": "error",
				// "react/no-danger-with-children": "off",
				// "react/no-deprecated": "error",
				// "react/no-direct-mutation-state": "error",
				// "react/no-find-dom-node": "off",
				// "react/no-is-mounted": "error",
				// "react/no-render-return-value": "error",
				// "react/no-string-refs": "error",
				// "react/no-unescaped-entities": "off",
				// "react/no-unknown-property": "off",
				// "react/no-unsafe": "off",
				// "react/no-unstable-nested-components": [
				// 	"error",
				// 	{
				// 		allowAsProps: true,
				// 	},
				// ],
				// "react/no-unused-prop-types": "error",
				// "react/prefer-read-only-props": "error",
				// "react/prop-types": "off",
				// "react/react-in-jsx-scope": "off",
				// "react/require-render-return": "error",
				// "react/self-closing-comp": [
				// 	"error",
				// 	{
				// 		component: true,
				// 	},
				// ],

				"style/jsx-curly-brace-presence": [
					"error",
					{
						children: "never",
						propElementValues: "always",
						props: "never",
					},
				],

				"style/jsx-newline": "error",
				"style/jsx-sort-props": [
					"error",
					{
						callbacksLast: true,
						ignoreCase: true,
						reservedFirst: true,
						shorthandFirst: true,
					},
				],

				// overrides
				...overrides,
			},
			settings: {
				react: {
					version: "17.0",
				},
				reactOptions: {
					importSource: "@rbxts",
					jsxPragma: "React",
				},
			},
		},
		{
			files: ["**/*.story.tsx"],
			rules: {
				"react-hooks/rules-of-hooks": "off",
			},
		},
		{
			files: [GLOB_TSX],
			rules: {
				"max-lines-per-function": "off",
			},
		},
	];
}
