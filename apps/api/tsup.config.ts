import { defineConfig } from "tsup";

export default defineConfig((opts) => {
    return {
        entry: ["./src/index.ts"],
        clean: !opts.watch,
        minify: false,
        sourcemap: true,
        dts: true,
        format: ["esm"],
        splitting: true,
    };
});
