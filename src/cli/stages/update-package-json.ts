import { log, note } from "@clack/prompts";

import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pico from "picocolors";

import { dependenciesMap, pkgJson as packageJson } from "../constants";

export async function updatePackageJson(): Promise<void> {
	const cwd = process.cwd();

	const pathPackageJSON = path.join(cwd, "package.json");

	log.step(pico.cyan(`Bumping @isentinel/eslint-config to v${packageJson.version}`));

	const packageContent = await fsp.readFile(pathPackageJSON, "utf-8");
	const package_: Record<string, any> = JSON.parse(packageContent);

	package_.devDependencies ??= {};
	package_.devDependencies["@isentinel/eslint-config"] = `^${packageJson.version}`;
	package_.devDependencies.eslint ??= packageJson.devDependencies.eslint
		.replace("npm:eslint-ts-patch@", "")
		.replace(/-\d+$/, "");

	const addedPackages: Array<string> = [];

	for (const dep of dependenciesMap["react"]) {
		package_.devDependencies[dep] = packageJson.devDependencies[dep];
		addedPackages.push(dep);
	}

	if (addedPackages.length) {
		note(`${pico.dim(addedPackages.join(", "))}`, "Added packages");
	}

	await fsp.writeFile(pathPackageJSON, JSON.stringify(package_, null, 2));
	log.success(pico.green(`Changes wrote to package.json`));
}
