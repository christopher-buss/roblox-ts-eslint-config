import process from "node:process";
import fs from "node:fs";
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from "./types";
import {
	comments,
	ignores,
	imports,
	javascript,
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
	test,
	typescript,
	unicorn,
} from "./configs";
import { combine, interopDefault } from "./utils";
import { formatters } from "./configs/formatters";

const flatConfigProps: (keyof FlatConfigItem)[] = [
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
	...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]
): Promise<UserConfigItem[]> {
	const {
		componentExts = [],
		gitignore: enableGitignore = true,
		isInEditor = !!((process.env.VSCODE_PID ?? process.env.JETBRAINS_IDE) && !process.env.CI),
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
		stylisticOptions.jsx = options.jsx ?? true;
	}

	const configs: Awaitable<FlatConfigItem[]>[] = [];

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
		javascript({
			isInEditor,
			overrides: overrides.javascript,
		}),
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

	if (options.test ?? true) {
		configs.push(
			test({
				isInEditor,
				overrides: overrides.test,
			}),
		);
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

	configs.push(prettier());

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
