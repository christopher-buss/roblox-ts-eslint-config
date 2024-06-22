import * as p from "@clack/prompts";

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pico from "picocolors";

import { addTsconfigBuild } from "./stages/add-tsconfig.build.json";
import { updateEslintFiles } from "./stages/update-eslint-files";
import { updatePackageJson } from "./stages/update-package-json";
import { updateVscodeSettings } from "./stages/update-vscode-settings";
import type { FrameworkOption, PromptResult } from "./types";
import { isGitClean } from "./utils";

export interface CliRunOptions {
	/** Use the framework template for optimal customization: react. */
	frameworks?: Array<string>;
	/** Skip prompts and use default values. */
	yes?: boolean;
}

export async function run(options: CliRunOptions = {}): Promise<undefined> {
	const argumentSkipPrompt = !!process.env.SKIP_PROMPT || options.yes;
	const argumentTemplate = ["react"] as Array<FrameworkOption>;

	if (fs.existsSync(path.join(process.cwd(), "eslint.config.js"))) {
		p.log.warn(pico.yellow(`eslint.config.js already exists, migration wizard exited.`));
		return process.exit(1);
	}

	// Set default value for promptResult if `argSkipPrompt` is enabled
	let result: PromptResult = {
		frameworks: argumentTemplate,
		uncommittedConfirmed: false,
		updateVscodeSettings: true,
	};

	if (!argumentSkipPrompt) {
		result = (await p.group(
			{
				uncommittedConfirmed: () => {
					if (argumentSkipPrompt || isGitClean()) {
						return Promise.resolve(true);
					}

					return p.confirm({
						initialValue: false,
						message:
							"There are uncommitted changes in the current repository, are you sure to continue?",
					});
				},

				updateVscodeSettings: ({ results }) => {
					if (!results.uncommittedConfirmed) {
						return;
					}

					return p.confirm({
						initialValue: true,
						message: "Update .vscode/settings.json for better VS Code experience?",
					});
				},
			},
			{
				onCancel: () => {
					p.cancel("Operation cancelled.");
					process.exit(0);
				},
			},
		)) as PromptResult;

		if (!result.uncommittedConfirmed) {
			return process.exit(1);
		}
	}

	await updatePackageJson();
	await updateEslintFiles();
	await updateVscodeSettings(result);
	await addTsconfigBuild();

	p.log.success(pico.green(`Setup completed`));
	p.outro(`Now you can update the dependencies and run ${pico.blue("eslint . --fix")}\n`);
}
