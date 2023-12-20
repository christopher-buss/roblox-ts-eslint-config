import fs from "node:fs";

import {
	comments,
	ignores,
	imports,
	jsdoc,
	jsonc,
	markdown,
	node,
	perfectionist,
	prettier,
	react,
	roblox,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	typescript,
	unicorn,
} from "./configs";
import { formatters } from "./configs/formatters";
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from "./types";
import { combine, interopDefault } from "./utils";

const flatConfigProps: Array<keyof FlatConfigItem> = [
	"files",
	"ignores",
	"languageOptions",
	"linterOptions",
	"processor",
	"plugins",
	"rules",
	"settings",
];

/**
 * Construct an array of ESLint flat config items.
 */
export async function style(
	options: OptionsConfig & FlatConfigItem = {},
	...userConfigs: Array<Awaitable<UserConfigItem | Array<UserConfigItem>>>
): Promise<Array<UserConfigItem>> {
	const {
		componentExts = [],
		gitignore: enableGitignore = true,
		jsx,
		overrides = {},
		react: enableReact = false,
		roblox: enableRoblox = true,
		typescript: enableTypeScript,
	} = options;

	const stylisticOptions =
		options.stylistic === false
			? false
			: typeof options.stylistic === "object"
			  ? options.stylistic
			  : {};
	if (stylisticOptions && !("jsx" in stylisticOptions)) {
		stylisticOptions.jsx = jsx ?? true;
	}

	const configs: Array<Awaitable<Array<FlatConfigItem>>> = [];

	if (enableGitignore) {
		if (typeof enableGitignore !== "boolean") {
			configs.push(
				interopDefault(import("eslint-config-flat-gitignore")).then(r => [
					r(enableGitignore),
				]),
			);
		} else if (fs.existsSync(".gitignore")) {
			configs.push(interopDefault(import("eslint-config-flat-gitignore")).then(r => [r()]));
		}
	}

	// Base configs
	configs.push(
		ignores(),
		comments(),
		node(),
		jsdoc({
			stylistic: stylisticOptions,
		}),
		imports({
			stylistic: stylisticOptions,
		}),
		unicorn(),

		// Optional plugins (installed but not enabled by default)
		perfectionist(),
	);

	configs.push(
		typescript({
			...(typeof enableTypeScript !== "boolean" ? enableTypeScript : {}),
			componentExts,
			overrides: overrides.typescript,
		}),
	);

	if (enableRoblox) {
		configs.push(
			roblox({
				...(typeof enableTypeScript !== "boolean" ? enableTypeScript : {}),
				componentExts,
				overrides: overrides.typescript,
			}),
		);
	}

	if (stylisticOptions) {
		configs.push(stylistic(stylisticOptions));
	}

	if (enableReact) {
		configs.push(
			react({
				overrides: overrides.react,
				typescript: !!enableTypeScript,
			}),
		);
	}

	if (options.jsonc ?? true) {
		configs.push(
			jsonc({
				overrides: overrides.jsonc,
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsconfig(),
		);
	}

	if (options.markdown ?? true) {
		configs.push(
			markdown(
				{
					componentExts,
					overrides: overrides.markdown,
				},

				options.formatters === true || !!(options.formatters || {})?.markdown,
			),
		);
	}

	if (options.formatters) {
		configs.push(
			formatters(
				options.formatters,
				typeof stylisticOptions === "boolean" ? {} : stylisticOptions,
				options.markdown !== false,
			),
		);
	}

	configs.push(
		prettier({
			...(typeof enableTypeScript !== "boolean" ? enableTypeScript : {}),
			componentExts,
			overrides: overrides.typescript,
		}),
	);

	// User can optionally pass a flat config item to the first argument
	// We pick the known keys as ESLint would do schema validation
	const fusedConfig = flatConfigProps.reduce((acc, key) => {
		if (key in options) {
			acc[key] = options[key] as any;
		}

		return acc;
	}, {} as FlatConfigItem);
	if (Object.keys(fusedConfig).length) {
		configs.push([fusedConfig]);
	}

	const merged = combine(...configs, ...userConfigs);

	return merged;
}
