# @isentinel/eslint-config

## Usage

### Quick Start

For an existing template that already has this config setup, please refer to the
[roblox-ts
template](https://github.com/christopher-buss/roblox-ts-project-template)
repository. This includes all necessarily files and configurations to get you up
and running.

### Starter Wizard

We provided a CLI tool to help you set up your project, or migrate from the legacy config to the new flat config with one command.

```bash
npx @isentinel/eslint-config@latest
```

### Manual Install

If you prefer to set up manually:

```bash
pnpm i -D eslint @isentinel/eslint-config
```

### Create config file

With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json` (recommended):

```js
// eslint.config.ts
import style from "@isentinel/eslint-config";

export default style();
```

> Note that `.eslintignore` no longer works in Flat config, see
> [customization](#customization) for more details.

> [!TIP]
> ESLint can support .ts config files, but requires some additional setup. See
> [here](https://eslint.org/docs/latest/use/configure/configuration-files#typescript-configuration-files)
> for more information.

### tsconfig.build.json

Create a `tsconfig.build.json` file in the root of your project with the
following content:

```json
{
	"extends": "./tsconfig.json",
	"include": ["src/**/*", "eslint.config.ts"],
	"exclude": ["node_modules"]
}
```

This is required to allow typescript to work with the ESLint configuration file,
without erroring due to it not being included in the project.

### Add script for package.json

For example:

```json
{
	"scripts": {
		"lint": "eslint",
		"lint:fix": "eslint --fix"
	}
}
```

## Recommended Settings

### TSConfig

Many of the rules in this config are designed to work with the following options
set:

```json
{
	"noUncheckedIndexedAccess": true,
	"noImplicitReturns": true,
	"noFallthroughCasesInSwitch": true
}
```

### ESLint

The `ts/no-non-null-assertion` rule is enabled by default, which will warn you
when you use the `!` operator to assert that a value is not `undefined`. The
caveat is that this rule will not always play nicely with
`noUncheckedIndexedAccess`, and will often require you to disable it in certain
places. I believe that this is a good trade-off, as it will help you catch
potential bugs in your code, but you can disable it if you find it too restrictive.

```json
{
	"rules": {
		"ts/no-non-null-assertion": "off"
	}
}
```

## VS Code support (auto fix)

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```json
{
	// Enable the ESlint flat config support
	"eslint.experimental.useFlatConfig": true,

	"editor.formatOnSave": false,

	// Auto fix
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "always",
		"source.organizeImports": "never"
	},

	// Silent the stylistic rules in you IDE, but still auto fix them
	"eslint.rules.customizations": [
		{ "rule": "style/*", "severity": "off", "fixable": true },
		{ "rule": "format/*", "severity": "off", "fixable": true },
		{ "rule": "*-indent", "severity": "off", "fixable": true },
		{ "rule": "*-spacing", "severity": "off", "fixable": true },
		{ "rule": "*-spaces", "severity": "off", "fixable": true },
		{ "rule": "*-order", "severity": "off", "fixable": true },
		{ "rule": "*-dangle", "severity": "off", "fixable": true },
		{ "rule": "*-newline", "severity": "off", "fixable": true },
		{ "rule": "*quotes", "severity": "off", "fixable": true },
		{ "rule": "*semi", "severity": "off", "fixable": true }
	],

	// Enable eslint for all supported languages
	"eslint.validate": [
		"typescript",
		"typescriptreact",
		"markdown",
		"json",
		"jsonc",
		"yaml",
		"toml"
	],

	// Currently required to enable .ts config files
	"eslint.options": { "flags": ["unstable_ts_config"] }
}
```

## Customization

Normally you only need to import the `style` preset:

```ts
// eslint.config.ts
import style from "@isentinel/eslint-config";

export default style();
```

And that's it! Or you can configure each integration individually, for example:

```ts
// eslint.config.ts
import style from "@isentinel/eslint-config";

export default style({
	// `.eslintignore` is no longer supported in Flat config, use `ignores`
	// instead
	ignores: [
		"./fixtures",
		// ...globs
	],

	// Type of the project. `package` for packages, the default is `game`
	type: "package",

	// Provide TypeScript parser options for access to type checking lints.
	typescript: {
		parserOptions: {
			project: "tsconfig.build.json",
		},
		tsconfigPath: "tsconfig.build.json",
	},

	// Disable yaml support
	yaml: false,
});
```

The `style` factory function also accepts any number of arbitrary custom config overrides:

```ts
// eslint.config.ts
import style from "@isentinel/eslint-config";

export default style(
	{
		// Configures for this config
	},

	// From the second arguments they are ESLint Flat Configs
	// you can have multiple configs
	{
		files: ["**/*.ts"],
		rules: {},
	},
	{
		rules: {},
	},
);
```

Check out the [configs](https://github.com/christopher-buss/roblox-ts-eslint-config/tree/main/src/configs) and [factory](https://github.com/christopher-buss/roblox-ts-eslint-config/blob/main/src/factory.ts) for more details.

> Thanks to [antfu/eslint-config](https://github.com/antfu/eslint-config) and [sxzz/eslint-config](https://github.com/sxzz/eslint-config) for the inspiration and reference.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of the mandatory convention from npm package name), we renamed some plugins to make the overall scope more consistent and easier to write.

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `i/*`                  | [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i)                                |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Spell Checker

This config includes the [CSpell](https://cspell.org/) plugin by default, which
will warn you when you have misspelled words in your code. This can be useful
for catching typos, and ensuring that your code is consistent. Roblox keywords
are also included in the dictionary, which is provided by the
[`cspell-dicts-roblox`](https://github.com/christopher-buss/cspell-dicts-roblox)
package. If any words roblox words are missing, please open an issue on that
repository rather than this one.

Sometimes you will have words that are not in the dictionary, but are still
valid for your project. To add these words to the dictionary, you can create a
`cspell.config.yaml` file in the root of your project with the following content:

```yaml
# cspell.config.yaml
words:
  - isentinel
  - isverycool
```

To disable this, you can set the `spellCheck` option to `false`:

```js
// eslint.config.ts
import style from "@isentinel/eslint-config";

export default style({
	spellCheck: false,
});
```

For more information on how to configure the spell checker, please refer to the
[CSpell documentation](https://cspell.org/).

#### `perfectionist` (sorting)

This plugin [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) allows you to sorted object keys, imports, etc, with auto-fix.

The plugin is installed and some rules are enabled by default, but these rules
can be disabled or overridden by your own config. For example, I personally have
sort-objects set to:

```js
// eslint.config.ts
import style from "@isentinel/eslint-config";

export default style({
	rules: {
		"perfectionist/sort-objects": [
			"warn",
			{
				"custom-groups": {
					id: "id",
					name: "name",
					"react-props": ["children", "ref"],
				},
				groups: ["id", "name", "unknown", "react-props"],
				order: "asc",
				"partition-by-comment": "Part:**",
				type: "natural",
			},
		],
	},
});
```

### Optional Configs

We provide some optional configs for specific use cases, that we don't include their dependencies by default.

#### React

To enable React support, you need to explicitly turn it on:

```js
// eslint.config.ts
import style from "@isentinel/eslint-config";

export default style({
	react: true,
});
```

Running `npx eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
pnpm i -D @eslint-react/eslint-plugin eslint-plugin-react-roblox-hooks
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
	"simple-git-hooks": {
		"pre-commit": "pnpm lint-staged"
	},
	"lint-staged": {
		"*": "eslint --fix"
	}
}
```

and then

```bash
pnpm i -D lint-staged simple-git-hooks
```

## View what rules are enabled

There is a visual tool to help you view what rules are enabled in your project and apply them to what files, [eslint-config-inspector](https://github.com/eslint/config-inspector)

Go to your project root that contains `eslint.config.ts` and run:

```bash
npx eslint-config-inspector
```

### I prefer XXX...

Sure, you can configure and override rules locally in your project to fit your
needs. If that still does not work for you, you can always fork this repo and
maintain your own. I am open to PRs that help improve the overall experience for
developers, and there may still be rules activated that do not apply to the
roblox-ts ecosystem.
