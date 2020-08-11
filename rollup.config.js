// Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import commonjs from '@rollup/plugin-commonjs';
// compiler
import babel from '@rollup/plugin-babel';
// locates third party modules in node_modules
import resolve from '@rollup/plugin-node-resolve';
// typescript
import typescript from '@rollup/plugin-typescript';

/* resolve options */
const extensions = ['.js', '.ts', '.jsx', '.tsx'];

const banner = `/* A simple MVVM implemented in TypeScript */`;

const bulids = {
  internal: {
    input: [
      'src/observer/dep.ts',
      'src/observer/observer.ts',
      'src/observer/watcher.ts',
    ],
    output: {
      dir: 'dist',
      // Use CommonJS for testing in NodeJS
      banner: banner,
      format: 'cjs',
      entryFileNames: '[name].js',
    },
    external: ['@babel/runtime'],
    babelHelpers: 'runtime',
  },
  runtime: {
    input: ['src/mvvm.ts'],
    output: {
      dir: 'dist',
      banner: banner,
      name: 'MVVM',
      format: 'iife',
      entryFileNames: '[name].js',
    },
    external: ['@babel/runtime'],
    babelHelpers: 'runtime',
  },
};

function getConfig(name) {
  const opts = bulids[name];
  const config = {
    input: opts.input,
    plugins: [
      resolve({ extensions }), // locate modules
      commonjs(), // Convert CommonJS to ES
      typescript(), // Convert TS to ES
      babel({
        extensions,
        babelHelpers: opts.babelHelpers, // 'runtime' for building libraries with @babel/plugin-transform-runtime and @babel/runtime, 'bundled' for building application code
      }),
    ],
    output: opts.output,
    external: opts.external,
  };
  return config;
}

export default () => getConfig(process.env.BUILD);
