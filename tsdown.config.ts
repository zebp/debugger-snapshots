import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/vite.ts"],
  outDir: "dist",
  format: "esm",
  target: "es2020",
  sourcemap: true,
  dts: true,
});
