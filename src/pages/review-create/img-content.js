import '/src/pages/review-create/img-content.scss';
import pb from '/src/lib/utils/pocketbase';

async function imgContent() {
   const textarea = document.querySelector('textarea');
   const btnSubmit = document.querySelector('.btn__submit');
   const fileInput = document.querySelector('.upload-button');

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
   const stores_id = JSON.parse(localStorage.getItem('stores_id'));

   fileInput.addEventListener('change', function () {
      for (let file of fileInput.files) {
         formData.append('image', file);
      }
   });

   let user;
   try {
      user = await pb.collection('users').getOne(pb.authStore.model.id);
   } catch (error) {
      console.error('Error fetching user data:', error);
   }

   formData.append('date', date);
   formData.append('withwho', withwho);
   formData.append('how', how);
   formData.append('delay', delay);
   formData.append('keyword', keyword);
   formData.append('review', review);
   formData.append('stores_id', stores_id);
   if (user) {
      formData.append('users_id', user.id);
   }

   async function handleBtnSubmit(e) {
      e.preventDefault();

      for (let [key, value] of formData.entries()) {
         console.log(key, value);
      }

      try {
         await pb.collection('review').create(formData);
      } catch (error) {
         console.error('Error creating review:', error);
      }
   }

   btnSubmit.addEventListener('click', handleBtnSubmit);
}
imgContent();
