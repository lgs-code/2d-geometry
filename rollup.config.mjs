import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from "./package.json" assert { type: 'json' };

const production = process.env.BUILD === 'production';

export default [
  // browser-friendly UMD build
  {
    input: "build/index.js",
    output: {
      name: pkg.name.replace("@lgs-code/", ""),
      file: pkg.browser,
      format: "umd",
      sourcemap: !production,
      sourcemapExcludeSources: true
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: production ? "./tsconfig.prod.json" : "./tsconfig.json", sourceMap:!production }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "build/index.js",
    output: [
      { 
        file: pkg.main, 
        format: "cjs", 
        sourcemap: !production,
        sourcemapExcludeSources: true
      },
      { 
        file: pkg.module, 
        format: "es", 
        sourcemap: !production,
        sourcemapExcludeSources: true
      },
    ],
    plugins: [
      production && terser(), 
      typescript({ tsconfig: production ? "./tsconfig.prod.json" : "./tsconfig.json", sourceMap:!production })
    ],
  },

  {
    input: 'build/index.d.ts',
    output: [{ file: pkg.main.replace(".js", ".d.ts"), format: 'cjs' }],
    plugins: [dts()],
  },
];