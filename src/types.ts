import type {
	EslintCommentsRules,
	EslintRules,
	FlatESLintConfigItem,
	ImportRules,
	JsoncRules,
	MergeIntersection,
	Prefix,
	ReactHooksRules,
	ReactRules,
	RenamePrefix,
	RuleConfig,
	SonarJSRules,
} from "@antfu/eslint-define-config";
import type { RuleOptions as JSDocumentRules } from "@eslint-types/jsdoc/types";
import type { RuleOptions as TypeScriptRules } from "@eslint-types/typescript-eslint/types";
import type { RuleOptions as UnicornRules } from "@eslint-types/unicorn/types";
import type {
	StylisticCustomizeOptions,
	UnprefixedRuleOptions as StylisticRules,
} from "@stylistic/eslint-plugin";
import type { ParserOptions } from "@typescript-eslint/parser";

import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { Rules as AntfuRules } from "eslint-plugin-antfu";

import type { VendoredPrettierOptions } from "./vender/prettier-types";

export type WrapRuleConfig<T extends Record<string, any>> = {
	[K in keyof T]: T[K] extends RuleConfig ? T[K] : RuleConfig<T[K]>;
};

export type Awaitable<T> = T | Promise<T>;

export type Rules = WrapRuleConfig<
	MergeIntersection<
		RenamePrefix<TypeScriptRules, "@typescript-eslint/", "ts/"> &
			EslintCommentsRules &
			EslintRules &
			ImportRules &
			JSDocumentRules &
			JsoncRules &
			Prefix<AntfuRules, "antfu/"> &
			Prefix<StylisticRules, "style/"> &
			ReactHooksRules &
			ReactRules &
			RenamePrefix<SonarJSRules, "sonarjs/", "sonar/"> &
			UnicornRules
	>
>;

export type FlatConfigItem = Omit<FlatESLintConfigItem<Rules, false>, "plugins"> & {
	/** Custom name of each config item. */
	name?: string;

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
};

export type UserConfigItem = FlatConfigItem | Linter.FlatConfig;

export interface OptionsFiles {
	/** Override the `files` option to provide custom globs. */
	files?: Array<string>;
}

export type OptionsTypescript =
	| (OptionsTypeScriptWithTypes & OptionsOverrides)
	| (OptionsTypeScriptParserOptions & OptionsOverrides);

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
	markdown?: "prettier" | "dprint" | boolean;

	/**
	 * Custom options for Prettier.
	 *
	 * By default it's controlled by our own config.
	 */
	prettierOptions?: VendoredPrettierOptions;

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
	tsconfigPath?: string | Array<string>;
}

export interface OptionsHasTypeScript {
	typescript?: boolean;
}

export interface OptionsStylistic {
	stylistic?: boolean | StylisticConfig;
}

export type StylisticConfig = Pick<StylisticCustomizeOptions, "indent" | "quotes" | "jsx" | "semi">;

export interface OptionsOverrides {
	overrides?: FlatConfigItem["rules"];
}

export interface OptionsIsInEditor {
	isInEditor?: boolean;
}

export interface OptionsConfig extends OptionsComponentExtensions {
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
	formatters?: boolean | OptionsFormatters;

	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @default true
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 */
	gitignore?: boolean | FlatGitignoreOptions;

	/**
	 * Control to disable some rules in editors.
	 *
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;

	/**
	 * Enable JSONC support.
	 *
	 * @default true
	 */
	jsonc?: boolean | OptionsOverrides;

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
	markdown?: boolean | OptionsOverrides;

	/**
	 * Enable react rules.
	 *
	 * Requires installing:
	 *
	 * - `eslint-plugin-react`
	 * - `eslint-plugin-react-hooks`.
	 *
	 * @default false
	 */
	react?: boolean | OptionsOverrides;

	/** Enable Roblox-TS support. */
	roblox?: boolean;

	/**
	 * Enable stylistic rules.
	 *
	 * @default true
	 */
	stylistic?: boolean | StylisticConfig;

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	typescript?: OptionsTypescript;
}
