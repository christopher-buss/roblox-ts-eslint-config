import { builtinRules } from "eslint/use-at-your-own-risk";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import fs from "node:fs/promises";

import {
	combine,
	comments,
	formatters,
	ignores,
	imports,
	jsdoc,
	jsonc,
	markdown,
	perfectionist,
	prettier,
	promise,
	react,
	roblox,
	shopify,
	sonarjs,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	typescript,
	unicorn,
	yaml,
} from "../src";

const configs = await combine(
	{
		plugins: {
			"": {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	comments(),
	formatters(),
	ignores(),
	imports(),
	jsdoc(),
	jsonc(),
	markdown(),
	perfectionist(),
	prettier(),
	promise(),
	react(),
	roblox(),
	shopify(),
	sonarjs(),
	sortPackageJson(),
	sortTsconfig(),
	stylistic(),
	typescript(),
	unicorn(),
	yaml(),
);

const configNames = configs.map(index => index.name).filter(Boolean) as Array<string>;

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", dts);
