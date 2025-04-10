import { fixupPluginRules } from "@eslint/compat";

import { pluginUnicorn } from "src/plugins";

import { GLOB_TS, GLOB_TSX } from "../globs";
import type {
	OptionsFiles,
	OptionsStylistic,
	OptionsTypeScriptWithTypes,
	ReactConfig,
	TypedFlatConfigItem,
} from "../types";
import { ensurePackages, interopDefault, toArray } from "../utils";

export async function react(
	options: OptionsFiles & OptionsStylistic & OptionsTypeScriptWithTypes & ReactConfig = {},
): Promise<Array<TypedFlatConfigItem>> {
	const {
		filenameCase = "kebabCase",
		files = [GLOB_TS, GLOB_TSX],
		importSource,
		jsxPragma,
		overrides = {},
		stylistic = true,
	} = options;

	await ensurePackages(["@eslint-react/eslint-plugin", "eslint-plugin-react-roblox-hooks"]);

	const [pluginReact, pluginReactHooks, pluginStylistic, parserTs, pluginTs] = await Promise.all([
		interopDefault(import("@eslint-react/eslint-plugin")),
		interopDefault(import("eslint-plugin-react-roblox-hooks")),
		interopDefault(import("@stylistic/eslint-plugin")),
		interopDefault(import("@typescript-eslint/parser")),
		interopDefault(import("@typescript-eslint/eslint-plugin")),
	] as const);

	const plugins = pluginReact.configs.all.plugins;

	const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined;
	const isTypeAware = !!tsconfigPath;

	return [
		{
			name: "style/react/setup",
			plugins: {
				"react": plugins["@eslint-react"],
				"react-hooks-extra": plugins["@eslint-react/hooks-extra"],
				"react-hooks-roblox": fixupPluginRules(pluginReactHooks),
				"react-naming-convention": plugins["@eslint-react/naming-convention"],
				"style": pluginStylistic,
				"ts": pluginTs,
				"unicorn": pluginUnicorn,
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
					...(isTypeAware ? { project: tsconfigPath } : {}),
				},
				sourceType: "module",
			},
			name: "style/react/rules",
			rules: {
				// recommended rules from @eslint-react/hooks-extra
				// react-lua does not seem to fully support the patterns that this rule enforces.
				"react-hooks-extra/no-direct-set-state-in-use-effect": "off",
				"react-hooks-extra/no-redundant-custom-hook": "error",
				"react-hooks-extra/no-unnecessary-use-callback": "error",
				"react-hooks-extra/no-unnecessary-use-memo": "error",
				"react-hooks-extra/prefer-use-state-lazy-initialization": "error",
				// recommended rules react-hooks roblox
				"react-hooks-roblox/exhaustive-deps": "warn",
				"react-hooks-roblox/rules-of-hooks": "error",
				// recommended rules from @eslint-react/naming-convention
				"react-naming-convention/filename-extension": ["warn", "as-needed"],
				"react-naming-convention/use-state": "error",
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
				"react/no-complex-conditional-rendering": "error",
				"react/no-component-will-mount": "error",
				"react/no-component-will-receive-props": "error",
				"react/no-component-will-update": "error",
				"react/no-create-ref": "error",
				"react/no-direct-mutation-state": "error",
				"react/no-duplicate-key": "error",
				"react/no-implicit-key": "error",
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
				// TODO: False positives on roblox primitives.
				"react/no-unstable-default-props": "off",
				"react/no-unused-class-component-members": "warn",
				"react/no-unused-state": "warn",
				"react/prefer-read-only-props": "error",
				"react/prefer-shorthand-boolean": "off",

				...(stylistic
					? {
							"one-var": "off",
							"react/no-useless-fragment": "warn",
							"react/prefer-destructuring-assignment": "warn",
							"react/prefer-shorthand-fragment": "warn",
							"style/jsx-curly-brace-presence": [
								"error",
								{
									children: "never",
									propElementValues: "always",
									props: "never",
								},
							],
							"style/jsx-newline": "error",
							"style/jsx-self-closing-comp": "error",
							"style/jsx-sort-props": [
								"error",
								{
									callbacksLast: true,
									ignoreCase: true,
									reservedFirst: true,
									shorthandFirst: true,
								},
							],
						}
					: {}),

				...(isTypeAware
					? {
							"react/no-leaked-conditional-rendering": "warn",
						}
					: {}),

				// overrides
				...overrides,
			},
			settings: {
				reactOptions: {
					importSource: importSource ?? "@rbxts",
					jsxPragma: jsxPragma ?? "React",
				},
			},
		},
		{
			files: [GLOB_TSX],
			rules: {
				"max-lines-per-function": "off",
				"unicorn/filename-case": [
					"error",
					{
						case: filenameCase,
						ignore: ["README.md"],
						multipleFileExtensions: true,
					},
				],
			},
		},
	];
}
