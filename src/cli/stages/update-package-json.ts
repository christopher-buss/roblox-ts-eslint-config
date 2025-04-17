import { log, note } from "@clack/prompts";

import ansis from "ansis";
import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { version } from "../../../package.json";
import { dependenciesMap } from "../constants";
import { versionsMap } from "../constants-generated";

export async function updatePackageJson(): Promise<void> {
	const cwd = process.cwd();

	const pathPackageJSON = path.join(cwd, "package.json");

	log.step(ansis.cyan(`Bumping @isentinel/eslint-config to v${version}`));

	const packageContent = await fsp.readFile(pathPackageJSON, "utf-8");
	const package_: Record<string, any> = JSON.parse(packageContent);

	package_.devDependencies ??= {};
	package_.devDependencies["@isentinel/eslint-config"] = `^${version}`;
	package_.devDependencies.eslint ??= versionsMap.eslint;

	const addedPackages: Array<string> = [];

	for (const dep of dependenciesMap["react"]) {
		package_.devDependencies[dep] = versionsMap[dep as keyof typeof versionsMap];
		addedPackages.push(dep);
	}

	if (addedPackages.length) {
		note(`${ansis.dim(addedPackages.join(", "))}`, "Added packages");
	}

	await fsp.writeFile(pathPackageJSON, JSON.stringify(package_, null, 2));
	log.success(ansis.green("Changes wrote to package.json"));
}
