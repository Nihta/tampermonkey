import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "main.js",
  output: [
    {
      file: "dist/bundle.js",
      format: "iife",
      inlineDynamicImports: true,
    },
    {
      file: "dist/bundle.min.js",
      format: "iife",
      inlineDynamicImports: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve(), // resolve node_modules
    commonjs(), // convert CommonJS to ES modules
  ],
};
