import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
   build: {
      outDir: 'docs',
      rollupOptions: {
         input: {
            main: resolve(__dirname, 'index.html'),
            sample: resolve(__dirname, './src/pages/sample/sample.html'),
         },
      },
   },
});
