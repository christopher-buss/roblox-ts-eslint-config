/* eslint-disable import/newline-after-import -- #2673 */
import * as p from "@clack/prompts";

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
// @ts-expect-error missing types
import parse from "parse-gitignore";
import pico from "picocolors";

import type { PromptResult } from "../types";
import { getEslintConfigContent } from "../utils";

export async function updateEslintFiles(result: PromptResult): Promise<void> {
	const cwd = process.cwd();
	const pathESLintIgnore = path.join(cwd, ".eslintignore");
	const pathPackageJSON = path.join(cwd, "package.json");

	const packageContent = await fsp.readFile(pathPackageJSON, "utf-8");
	const package_: Record<string, any> = JSON.parse(packageContent);

	const configFileName = package_.type === "module" ? "eslint.config.js" : "eslint.config.mjs";
	const pathFlatConfig = path.join(cwd, configFileName);

	const eslintIgnores: Array<string> = [];
	if (fs.existsSync(pathESLintIgnore)) {
		p.log.step(pico.cyan(`Migrating existing .eslintignore`));
		const content = await fsp.readFile(pathESLintIgnore, "utf-8");
		const parsed = parse(content);
		const globs = parsed.globs();

		for (const glob of globs) {
			if (glob.type === "ignore") {
				eslintIgnores.push(...glob.patterns);
			} else if (glob.type === "unignore") {
				eslintIgnores.push(...glob.patterns.map((pattern: string) => `!${pattern}`));
			}
		}
	}

	const configLines: Array<string> = [];

	if (eslintIgnores.length) {
		configLines.push(`ignores: ${JSON.stringify(eslintIgnores)},`);
	}

	for (const framework of result.frameworks) {
		configLines.push(`${framework}: true,`);
	}

	const mainConfig = configLines.map(index => `  ${index}`).join("\n");
	const additionalConfig: Array<string> = [];

	const eslintConfigContent: string = getEslintConfigContent(mainConfig, additionalConfig);

	await fsp.writeFile(pathFlatConfig, eslintConfigContent);
	p.log.success(pico.green(`Created ${configFileName}`));

	const files = fs.readdirSync(cwd);
	const legacyConfig: Array<string> = [];
	for (const file of files) {
		if (/eslint|prettier/.test(file) && !/eslint\.config\./.test(file)) {
			legacyConfig.push(file);
		}
	}

	if (legacyConfig.length) {
		p.note(`${pico.dim(legacyConfig.join(", "))}`, "You can now remove those files manually");
	}
}
