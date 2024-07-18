import '/src/pages/review-create/img-content.scss';
import pb from '/src/lib/utils/pocketbase';
import '/src/components/input-count/input-count.js';
async function imgContent() {
   const textarea = document.querySelector('textarea');
   const btnSubmit = document.querySelector('.btn__submit');
   const fileInput = document.querySelector('.upload-button');
   const shopName = document.querySelector('.shop-name');
   const visitDate = document.querySelector('.visit-date');
   const howData = document.querySelector('.data-how');
   const delayData = document.querySelector('.data-delay');
   const withwhoData = document.querySelector('.data-withwho');
   const keywordData = document.querySelector('.data-keyword');

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
         alert('등록완료');
      } catch (error) {
         console.error('Error creating review:', error);
      }
   }

   btnSubmit.addEventListener('click', handleBtnSubmit);

   //리뷰 데이터 화면에 뿌리기
   const place_name = localStorage.getItem('place_name');

   let str = place_name;
   let newStr = str.replace(/"/g, '');

   shopName.innerText = newStr;
   visitDate.innerText = date;
   howData.innerText = how + ' 이용';
   delayData.innerText = delay;
   withwhoData.innerText = withwho;
   keywordData.innerText = keyword;

   fileInput.addEventListener('change', function () {
      for (let file of fileInput.files) {
         formData.append('image', file);
      }

      // 이미지 프리뷰 추가
      const preview = document.getElementById('preview');
      const reader = new FileReader();

      reader.onloadend = function () {
         preview.classList.add('preview-img--on');
         preview.src = reader.result;
      };

      if (fileInput.files[0]) {
         reader.readAsDataURL(fileInput.files[0]);
      } else {
         preview.src = '';
      }
   });
}
imgContent();
