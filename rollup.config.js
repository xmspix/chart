import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [{
    file: pkg.main,
    format: 'cjs',
    exports: 'auto'
  },
  {
    file: pkg.module,
    format: 'es',
    exports: 'auto'
  },
  {
    file: pkg.browser,
    format: 'iife',
    name: 'Chart',
    exports: 'auto'
  }],
  plugins: [typescript()],
};