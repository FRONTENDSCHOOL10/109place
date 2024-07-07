import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
   root: './src',
   build: {
      outDir: 'docs',
      rollupOptions: {
         input: {
            main: resolve(__dirname, 'index.html'),
         },
      },
   },
});
