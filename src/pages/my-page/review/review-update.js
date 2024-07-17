import '/src/pages/review-create/img-content.scss';
import pb from '/src/lib/utils/pocketbase';

async () => {
   const record = await pb.collection('users').getOne(pb.authStore.model.id);

   const urlParams = new URLSearchParams(window.location.search);

   const selectReview = await pb
      .collection('review')
      .getOne(urlParams.get('reviewId'));
   const stores = await pb.collection('stores').getOne(selectReview.stores_id);
   const BASE_URL = 'https://vanilla-109place.pockethost.io';
   const reviewImageUrl = `${BASE_URL}/api/files/review/${selectReview.id}/${selectReview.image[0]}`;

   const image = new FormData();

   const textarea = document.querySelector('textarea');
   const fileInput = document.querySelector('.upload-button');

   const handleReview = (e) => {
      console.log(e.target.value);
      localStorage.setItem('review', e.target.value);
   };

   fileInput.addEventListener('change', function () {
      for (let file of fileInput.files) {
         image.append('image', file);
      }
   });

   image.append('title', 'Hello world!');

   // // set some other regular text field value
   // formData.append('title', 'Hello world!');

   await pb.collection('review').create(image);

   textarea.addEventListener('input', handleReview);
   // imageUpload.addEventListener('change', handleImg);

   const updateStoreName = document.querySelector('.review-update--store-name');
   updateStoreName.textContent = stores.name;
   console.log(stores.name);
};
