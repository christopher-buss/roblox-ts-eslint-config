import pico from "picocolors";

import type { FrameworkOption, PromItem } from "./types";

export const vscodeSettingsString = `
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
    { "rule": "format/*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "typescript",
    "typescriptreact",
    "markdown",
    "json",
    "jsonc",
    "yaml",
	"toml",
	"luau"
  ]
`;

export const frameworkOptions: Array<PromItem<FrameworkOption>> = [
	{
		label: pico.cyan("React"),
		value: "react",
	},
];

export const frameworks: Array<FrameworkOption> = frameworkOptions.map(({ value }) => value);

export const dependenciesMap = {
	react: ["@eslint-react/eslint-plugin", "eslint-plugin-react-hooks"],
} as const;

export { default as pkgJson } from "../../package.json";
