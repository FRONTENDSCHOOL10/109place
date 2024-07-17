import '/src/pages/review-create/img-content.scss';
import pb from '/src/lib/utils/pocketbase';

async function imgContent() {
   const textarea = document.querySelector('textarea');
   const btnSubmit = document.querySelector('.btn__submit');
   const fileInput = document.querySelector('.upload-button');

   // Create a new FormData object
   let formData = new FormData();

   // Handle review input and store it in localStorage
   const handleReview = (e) => {
      localStorage.setItem('review', e.target.value);
   };
   textarea.addEventListener('input', handleReview);

   // Retrieve stored data from localStorage
   const date = localStorage.getItem('date');
   const withwho = localStorage.getItem('withwho');
   const how = localStorage.getItem('how');
   const delay = localStorage.getItem('delay');
   const keyword = localStorage.getItem('keyword');
   const review = localStorage.getItem('review');
   const stores_id = JSON.parse(localStorage.getItem('stores_id'));

   // Handle file input changes and append files to FormData
   fileInput.addEventListener('change', function () {
      for (let file of fileInput.files) {
         formData.append('image', file);
      }
   });
   // Get user details
   let user;
   try {
      user = await pb.collection('users').getOne(pb.authStore.model.id);
   } catch (error) {
      console.error('Error fetching user data:', error);
   }

   // Append additional data to FormData
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

   // Handle form submission
   async function handleBtnSubmit(e) {
      e.preventDefault();

      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
         console.log(key, value);
      }

      try {
         await pb.collection('review').create(formData);
         // Redirect or handle successful creation
         // location.href = '/src/pages/review-done/review-done.html';
      } catch (error) {
         console.error('Error creating review:', error);
      }
   }

   btnSubmit.addEventListener('click', handleBtnSubmit);
}
imgContent();
