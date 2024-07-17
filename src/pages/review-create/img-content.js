import '/src/pages/review-create/img-content.scss';
import pb from '/src/lib/utils/pocketbase';

async function imgContent() {
   const textarea = document.querySelector('textarea');
   const btnSubmit = document.querySelector('.btn__submit');

   let formData = new FormData();

   const handleReview = (e) => {
      localStorage.setItem('review', e.target.value);
   };
   textarea.addEventListener('input', handleReview);

   const date = localStorage.getItem('date');
   const withwho = localStorage.getItem('withwho');
   const how = localStorage.getItem('how');
   const delay = localStorage.getItem('delay');
   const keyword = localStorage.getItem('keyword');
   const review = localStorage.getItem('review');
   const stores_id = localStorage.getItem('stores_id');

   const fileInput = document.querySelector('.upload-button');
   fileInput.addEventListener('change', function () {
      for (let file of fileInput.files) {
         formData.append('image', file);
      }
   });

   let user;

   user = await pb.collection('users').getOne(pb.authStore.model.id);

   formData.append('date', date);
   formData.append('withwho', withwho);
   formData.append('how', how);
   formData.append('delay', delay);
   formData.append('keyword', keyword);
   formData.append('review', review);
   formData.append('stores_id', stores_id);
   formData.append('users_id', user.id);

   for (let [key, value] of formData.entries()) {
      console.log(key, value);
   }

   async function handleBtnSubmit() {
      await pb
         .collection('review')
         .create(formData)
         .then(() => {
            location.href = '/src/pages/review-done/review-done.html';
         })
         .catch((e) => {
            console.log(e);
         });
   }

   btnSubmit.addEventListener('click', handleBtnSubmit);
}
imgContent();
