import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
   build: {
      outDir: 'docs',
      rollupOptions: {
         input: {
            main: resolve(__dirname, 'index.html'),
            homepage: resolve(__dirname, './src/pages/homepage/homepage.html'),
            mypagemain: resolve(__dirname, '/src/pages/my-page/main/main.html'),
            reviewdate : resolve(__dirname, '/src/pages/review-create/date-place.html')
         },
      },
   },
});
