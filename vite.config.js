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
            reviewdate: resolve(
               __dirname,
               '/src/pages/review-create/date-place.html'
            ),
            login: resolve(__dirname, '/src/pages/login/login.html'),
            signup: resolve(__dirname, '/src/pages/signup/signup.html'),
            placedetail: resolve(
               __dirname,
               '/src/pages/place-detail/place-detail.html'
            ),
            reviewimg: resolve(
               __dirname,
               '/src/pages/review-create/img-content.html'
            ),
            reviewtag: resolve(
               __dirname,
               '/src/pages/review-create/tag-select.html'
            ),
            reviewdone: resolve(
               __dirname,
               '/src/pages/review-done/review-done.html'
            ),
            reviewsearch: resolve(
               __dirname,
               '/src/pages/review-search/review-search.html'
            ),
            svaedplace: resolve(
               __dirname,
               '/src/pages/saved-places/saved-places.html'
            ),
            searchdetail: resolve(
               __dirname,
               '/src/pages/search-detail/search-detail.html'
            ),
         },
      },
   },
});
