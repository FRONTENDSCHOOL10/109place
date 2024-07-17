import pb from '/src/lib/utils/pocketbase';

(async () => {
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
      localStorage.setItem('review', e.target.value);
   };

   fileInput.addEventListener('change', function () {
      for (let file of fileInput.files) {
         image.append('image', file);
      }
   });

   image.append('title', 'Hello world!');

   textarea.addEventListener('input', handleReview);

   const updateStoreName = document.querySelector('.review-update--store-name');
   updateStoreName.textContent = stores.name;

   const updateReviewDate = document.querySelector('.review-data__date');
   updateReviewDate.textContent = selectReview.date.split(' ')[0];

   const updateReviewVisit = document.querySelector('.review-data__visit');
   updateReviewVisit.textContent = `${selectReview.visit_count}번째 방문`;

   const updateReviewHow = document.querySelector('.review-data__how');
   updateReviewHow.textContent = `${selectReview.how} 이용`;

   const updateReviewDelay = document.querySelector('.review-data__delay');
   updateReviewDelay.textContent = selectReview.delay;

   const updateReviewWith = document.querySelector('.review-data__with');
   updateReviewWith.textContent = selectReview.withwho;

   selectReview.keyword.forEach((key) => {
      const reviewTagContainer = document.querySelector(
         '.review-tag-container'
      );
      const reviewTagContent = document.createElement('p');
      const reviewTag = document.createElement('div');
      reviewTag.className = 'review-tag';

      if (key.includes('음식')) {
         reviewTagContent.textContent = '😋 음식이 맛있어요';
      }
      if (key.includes('재료')) {
         reviewTagContent.textContent = '🥦 재료가 신선해요';
      }
      if (key.includes('가성비')) {
         reviewTagContent.textContent = '👍 가성비가 좋아요';
      }
      if (key.includes('메뉴')) {
         reviewTagContent.textContent = '🍷 특별한 메뉴가 있어요';
      }
      if (key.includes('양')) {
         reviewTagContent.textContent = '🍚 양이 많아요';
      }
      reviewTagContainer.appendChild(reviewTag);
      reviewTag.appendChild(reviewTagContent);
   });

   const reviewText = document.querySelector('.input-count__input');

   function handleCount() {
      let textLength = this.value.length;

      if (textLength > 400) {
         this.value = this.value.substring(0, 400);
         textLength = 400;
      }

      textCount.textContent = `${textLength}`;
   }

   const textArea = document.querySelector('.input-count__input');
   const textCount = document.querySelector('.input-count__count');

   reviewText.textContent = selectReview.review;
   textCount.textContent = selectReview.review.length;
   textArea.addEventListener('input', handleCount);

   const uploadImg = document.querySelector('.review-upload__img');
   uploadImg.style.backgroundImage = `url(${reviewImageUrl})`;

   const uploadBtn = document.querySelector('.btn__next');

   // 버튼 클릭 시 업데이트 실행
   uploadBtn.addEventListener('click', async () => {
      try {
         const data = {
            date: selectReview.date,
            how: selectReview.how,
            delay: selectReview.delay,
            withwho: selectReview.withwho,
            keyword: selectReview.keyword,
            visit_count: selectReview.visit_count,
            review: selectReview.review,
            stores_id: selectReview.stores_id,
            users_id: selectReview.users_id,
         };

         const reviewUpdate = await pb
            .collection('review')
            .update(urlParams.get('reviewId'), data);
         console.log('Record updated successfully:', reviewUpdate);
      } catch (error) {
         console.error('Error updating record:', error);
      }
   });
})();
