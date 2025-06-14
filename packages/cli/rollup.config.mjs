import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import { builtinModules } from 'module';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/app-gen-cli.bundle.mjs',
      format: 'esm',
      sourcemap: true,
    }
  ],
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.lib.json',
      declaration: true,
      declarationDir: 'dist',
      sourceMap: true,
      outDir: 'dist',
      outputToFilesystem: true
    }),
    terser(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' }
      ]
    })
  ],
  external: [
    ...builtinModules,
    '@app-gen-cli/shared',
    '@app-gen-cli/generators'
  ]
};
