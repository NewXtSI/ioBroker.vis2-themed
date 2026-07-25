import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import tsconfigPaths from 'vite-tsconfig-paths';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';

const pack = JSON.parse(readFileSync('./package.json').toString());

export default {
  plugins: [
    federation({
      manifest: true,
      name: 'vis2ThemedWidgets',
      filename: 'customWidgets.js',
      exposes: {
        './ThemedCheckbox': './src/ThemedCheckbox',
        './ThemedButton': './src/ThemedButton',
        './ThemedBar': './src/ThemedBar',
        './ThemedSlider': './src/ThemedSlider',
        './translations': './src/translations'
      },
      remotes: {},
      shared: moduleFederationShared(pack),
      dts: false
    }),
    react(),
    tsconfigPaths(),
    commonjs()
  ],
  server: {
    port: 3020,
    proxy: {
      '/_socket': 'http://localhost:8082',
      '/vis.0': 'http://localhost:8082',
      '/adapter': 'http://localhost:8082',
      '/habpanel': 'http://localhost:8082',
      '/vis': 'http://localhost:8082',
      '/widgets': 'http://localhost:8082/vis',
      '/widgets.html': 'http://localhost:8082/vis',
      '/web': 'http://localhost:8082',
      '/state': 'http://localhost:8082'
    }
  },
  base: './',
  build: {
    target: 'chrome89',
    outDir: './build'
  }
};
