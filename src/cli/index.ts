import { intro, log } from "@clack/prompts";

import ansis from "ansis";
import process from "node:process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { pkgJson as packageJson } from "./constants";
import { run } from "./run";

function header(): void {
	console.log("\n");
	const introText = `${ansis.green("@isentinel/eslint-config")}`;
	const versionText = `v${packageJson.version}`;
	intro(introText + ansis.dim(versionText));
}

const instance = yargs(hideBin(process.argv))
	.scriptName("@isentinel/eslint-config")
	.usage("")
	.command(
		"*",
		"Run the initialization or migration",
		args => {
			return args
				.option("yes", {
					alias: "y",
					description: "Skip prompts and use default values",
					type: "boolean",
				})
				.option("template", {
					alias: "t",
					description: "Use the framework template for optimal customization: react",
					type: "string",
				})
				.help();
		},
		async args => {
			header();
			try {
				await run(args);
			} catch (err) {
				log.error(ansis.inverse(ansis.red(" Failed to migrate ")));
				log.error(ansis.red(`✘ ${String(err)}`));
				process.exit(1);
			}
		},
	)
	.showHelpOnFail(false)
	.alias("h", "help")
	.version("version", packageJson.version)
	.alias("v", "version");

// eslint-disable-next-line no-unused-expressions, ts/no-unused-expressions -- yargs API
instance.help().argv;
