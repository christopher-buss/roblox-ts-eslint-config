import type { Plugin } from "esbuild";
import { defineConfig } from "tsup";

function removeStyLuaEsmExports(): Plugin {
	return {
		name: "remove-stylua-esm-exports",
		setup(build) {
			build.onLoad({ filter: /@johnnymorganz\/stylua/ }, async (args) => {
				const fs = await import("fs");
				let contents = await fs.promises.readFile(args.path, "utf8");

				// Replace the problematic export line with correct wasm-bindgen exports
				contents = contents.replace(
					/export\s*{\s*getImports\s+as\s+__getImports\s*,\s*finalizeInit\s+as\s+__finalizeInit\s*}/g,
					"export { __wbg_get_imports as __getImports, __wbg_finalize_init as __finalizeInit }",
				);

				return {
					contents,
					loader: "js",
				};
			});
		},
	};
}

export default defineConfig({
	clean: true,
	entry: ["src/index.ts", "src/cli.ts"],
	esbuildPlugins: [removeStyLuaEsmExports()],
	format: ["esm"],
	noExternal: ["@johnnymorganz/stylua", "eslint-plugin-format-lua"],
	shims: true,
});
