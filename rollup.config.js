import resolve from "@rollup/plugin-node-resolve";
import typescript from '@rollup/plugin-typescript';
import pkg from "./package.json";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import stripBanner from 'rollup-plugin-strip-banner';

const extensions = [".js", ".ts"];
const moduleName = pkg.name.replace(/^@.*\//, "");
const author = pkg.author;
const banner = `
/**
* @license
* author: ${author}
* ${moduleName}.js v${pkg.version}
* Released under the ${pkg.license} license.
*/
`;

export default [
  // Bundle for browser
  {
    input: "src/index.ts",
    output: [
      {
        name: moduleName,
        file: pkg.module.replace('.esm.js', '.js'),
        format: "iife",
        banner,
      },
      {
        name: moduleName,
        file: pkg.module.replace(".esm.js", ".min.js"),
        format: "iife",
        banner,
        plugins: [terser()],
      },
    ],
    plugins: [
      typescript(),
      resolve({
        extensions
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        extensions
      }),
      stripBanner()
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        banner,
      },
      {
        file: pkg.module,
        format: "es",
        banner,
      },
    ],
    plugins: [
      typescript(),
      resolve({
        extensions
      }),
      babel({
        babelHelpers: "inline",
        exclude: "node_modules/**",
        extensions
      }),
      stripBanner()
    ],
  },
];