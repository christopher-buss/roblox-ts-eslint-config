import type { ESLintReactSettings } from "@eslint-react/shared";
import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin";
import type { ParserOptions } from "@typescript-eslint/parser";

import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { Options as PrettierOptions } from "prettier";

import type { ConfigNames, RuleOptions } from "./typegen";

export type Awaitable<T> = Promise<T> | T;

export type Rules = RuleOptions;

// eslint-disable-next-line unicorn/prefer-export-from -- Required due to build issues
export type { ConfigNames };

export type TypedFlatConfigItem = {
	// Relax plugins type limitation, as most of the plugins did not have correct
	// type info yet.
	/**
	 * An object containing a name-value mapping of plugin names to plugin
	 * objects. When `files` is specified, these plugins are only available to
	 * the matching files.
	 *
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 */
	plugins?: Record<string, any>;
} & Omit<Linter.FlatConfig<Linter.RulesRecord & Rules>, "plugins">;

export interface OptionsFiles {
	/** Override the `files` option to provide custom globs. */
	files?: Array<string>;
}

export type OptionsTypescript =
	| (OptionsOverrides & OptionsTypeScriptParserOptions)
	| (OptionsOverrides & OptionsTypeScriptWithTypes);

export interface OptionsFormatters {
	/**
	 * Enable formatting support for CSS, Less, Sass, and SCSS.
	 *
	 * Currently only support Prettier.
	 */
	css?: "prettier" | boolean;

	/**
	 * Custom options for dprint.
	 *
	 * By default it's controlled by our own config.
	 */
	dprintOptions?: boolean;

	/** Enable formatting support for GraphQL. */
	graphql?: "prettier" | boolean;

	/**
	 * Enable formatting support for HTML.
	 *
	 * Currently only support Prettier.
	 */
	html?: "prettier" | boolean;

	/**
	 * Enable formatting support for Markdown.
	 *
	 * Support both Prettier and dprint.
	 *
	 * When set to `true`, it will use Prettier.
	 */
	markdown?: "dprint" | "prettier" | boolean;

	/**
	 * Custom options for Prettier.
	 *
	 * By default it's controlled by our own config.
	 */
	prettierOptions?: PrettierOptions;

	/**
	 * Enable formatting support for TOML.
	 *
	 * Currently only support dprint.
	 */
	toml?: "dprint" | boolean;
}

export interface OptionsComponentExtensions {
	/** Additional extensions for components. */
	componentExts?: Array<string>;
}

export interface OptionsTypeScriptParserOptions {
	/**
	 * Glob patterns for files that should be type aware.
	 *
	 * @default \['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: Array<string>;

	/** Additional parser options for TypeScript. */
	parserOptions?: Partial<ParserOptions>;
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * When this options is provided, type aware rules will be enabled.
	 *
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: Array<string> | string;
}

export interface OptionsHasTypeScript {
	typescript?: boolean;
}

export interface OptionsStylistic {
	stylistic?: StylisticConfig | boolean;
}

export type StylisticConfig = Pick<StylisticCustomizeOptions, "indent" | "jsx" | "quotes" | "semi">;

export type ReactConfig = ESLintReactSettings & OptionsOverrides;

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem["rules"];
}

export interface OptionsIsInEditor {
	isInEditor?: boolean;
}

export interface OptionsConfig extends OptionsComponentExtensions {
	/**
	 * Automatically rename plugins in the config.
	 *
	 * @default true
	 */
	autoRenamePlugins?: boolean;

	/**
	 * Use external formatters to format files.
	 *
	 * Requires installing:
	 *
	 * - `eslint-plugin-format`.
	 *
	 * When set to `true`, it will enable all formatters.
	 *
	 * @default false
	 */
	formatters?: OptionsFormatters | boolean;

	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @default true
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 */
	gitignore?: FlatGitignoreOptions | boolean;

	/**
	 * Control to disable some rules in editors.
	 *
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;

	/**
	 * Enable JSDoc support.
	 *
	 * @default true
	 */
	jsdoc?: boolean;

	/**
	 * Enable JSONC support.
	 *
	 * @default true
	 */
	jsonc?: OptionsOverrides | boolean;

	/**
	 * Enable JSX related rules.
	 *
	 * Currently only stylistic rules are included.
	 *
	 * @default true
	 */
	jsx?: boolean;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * For formatting Markdown content, enable also `formatters.markdown`.
	 *
	 * @default true
	 */
	markdown?: OptionsOverrides | boolean;

	/**
	 * Provide overrides for rules for each integration.
	 *
	 * @deprecated Use `overrides` option in each integration key instead.
	 */
	overrides?: {
		javascript?: TypedFlatConfigItem["rules"];
		jsonc?: TypedFlatConfigItem["rules"];
		markdown?: TypedFlatConfigItem["rules"];
		react?: TypedFlatConfigItem["rules"];
		stylistic?: TypedFlatConfigItem["rules"];
		svelte?: TypedFlatConfigItem["rules"];
		test?: TypedFlatConfigItem["rules"];
		toml?: TypedFlatConfigItem["rules"];
		typescript?: TypedFlatConfigItem["rules"];
		vue?: TypedFlatConfigItem["rules"];
		yaml?: TypedFlatConfigItem["rules"];
	};

	/**
	 * Enable react rules.
	 *
	 * Requires installing:
	 *
	 * - `@eslint-react/eslint-plugin`
	 * - `eslint-plugin-react-hooks`.
	 *
	 * @default false
	 */
	react?: ReactConfig | boolean;

	/**
	 * Enable Roblox-TS support.
	 *
	 * @ignore
	 * @note This is only required as we are linting this
	 * project with its own rule-set, despite not being a roblox project.
	 */
	roblox?: boolean;

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: StylisticConfig | boolean;

	/**
	 * Enable TOML support.
	 *
	 * @default true
	 */
	toml?: OptionsOverrides | boolean;

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	typescript?: OptionsTypescript;

	/**
	 * Enable YAML support.
	 *
	 * @default true
	 */
	yaml?: OptionsOverrides | boolean;
}
