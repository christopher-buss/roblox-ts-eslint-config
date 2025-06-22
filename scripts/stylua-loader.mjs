export async function load(url, context, nextLoad) {
	// Only process @johnnymorganz/stylua files
	if (url.includes("@johnnymorganz/stylua")) {
		const result = await nextLoad(url, context);

		if (result.format === "module") {
			let source = result.source;

			// Convert buffer to string if necessary
			if (typeof source !== "string") {
				source = new TextDecoder().decode(source);
			}

			// Replace the problematic export line
			source = source.replace(
				/export\s*{\s*getImports\s+as\s+__getImports\s*,\s*finalizeInit\s+as\s+__finalizeInit\s*}/g,
				"export { __wbg_get_imports as __getImports, __wbg_finalize_init as __finalizeInit }",
			);

			return {
				...result,
				source,
			};
		}
	}

	return nextLoad(url, context);
}
