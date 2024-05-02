import { GLOB_JSX, GLOB_TSX } from "../globs";
import type {
	FlatConfigItem,
	OptionsFiles,
	OptionsHasTypeScript,
	OptionsOverrides,
} from "../types";
import { ensurePackages, interopDefault } from "../utils";

export async function react(
	options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {},
): Promise<Array<FlatConfigItem>> {
	const { files = [GLOB_JSX, GLOB_TSX], overrides = {}, typescript = true } = options;

	await ensurePackages([
		"eslint-plugin-react",
		"eslint-plugin-react-hooks",
		"eslint-plugin-react-prefer-function-component",
	]);

	const [pluginReact, pluginReactHooks, pluginStylistic, pluginPreferHooks] = await Promise.all([
		interopDefault(import("eslint-plugin-react")),
		interopDefault(import("eslint-plugin-react-hooks")),
		interopDefault(import("@stylistic/eslint-plugin")),
		interopDefault(import("eslint-plugin-react-prefer-function-component")),
	] as const);

	return [
		{
			name: "style:react:setup",
			plugins: {
				"prefer-hooks": pluginPreferHooks,
				react: pluginReact,
				"react-hooks": pluginReactHooks,
				style: pluginStylistic,
			},
			settings: {
				react: {
					version: "detect",
				},
			},
		},
		{
			files,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},
			name: "style:react:rules",
			rules: {
				"prefer-hooks/react-prefer-function-component": "error",
				"react/destructuring-assignment": [
					"error",
					"always",
					{
						destructureInSignature: "always",
					},
				],
				"react/display-name": "off",
				"react/function-component-definition": "error",
				"react/hook-use-state": "error",
				"react/jsx-boolean-value": ["error", "always"],
				"react/jsx-fragments": "error",
				"react/jsx-handler-names": "error",
				"react/jsx-key": "error",
				"react/jsx-max-depth": [
					"error",
					{
						max: 5,
					},
				],
				"react/jsx-no-bind": "error",
				"react/jsx-no-comment-textnodes": "error",
				"react/jsx-no-duplicate-props": "error",
				"react/jsx-no-leaked-render": "error",
				"react/jsx-no-target-blank": "error",
				"react/jsx-no-undef": "error",
				"react/jsx-uses-react": "error",
				"react/jsx-uses-vars": "error",
				"react/no-children-prop": "error",
				"react/no-danger-with-children": "off",
				"react/no-deprecated": "error",
				"react/no-direct-mutation-state": "error",
				"react/no-find-dom-node": "off",
				"react/no-is-mounted": "error",
				"react/no-render-return-value": "error",
				"react/no-string-refs": "error",
				"react/no-unescaped-entities": "off",
				"react/no-unknown-property": "off",
				"react/no-unsafe": "off",
				"react/no-unstable-nested-components": [
					"error",
					{
						allowAsProps: true,
					},
				],
				"react/no-unused-prop-types": "error",
				"react/prefer-read-only-props": "error",
				"react/prop-types": "error",
				"react/react-in-jsx-scope": "off",
				"react/require-render-return": "error",
				"react/self-closing-comp": [
					"error",
					{
						component: true,
					},
				],
				"react-hooks/exhaustive-deps": "warn",
				"react-hooks/rules-of-hooks": "error",
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

				...(typescript
					? {
							"react/jsx-no-undef": "off",
							"react/prop-type": "off",
						}
					: {}),

				// overrides
				...overrides,
			},
			settings: {
				react: {
					version: "17.0",
				},
			},
		},
		{
			files: ["**/*.story.tsx"],
			rules: {
				"react-hooks/rules-of-hooks": "off",
			},
		},
	];
}
