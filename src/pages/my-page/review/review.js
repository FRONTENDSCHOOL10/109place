import pb from '/src/lib/utils/pocketbase';

(async () => {
   const record = await pb.collection('users').getOne(pb.authStore.model.id);

   const urlParams = new URLSearchParams(window.location.search);

   const selectReview = await pb
      .collection('review')
      .getOne(urlParams.get('reviewId'));

   const stores = await pb.collection('stores').getOne(selectReview.stores_id);

   const BASE_URL = 'https://vanilla-109place.pockethost.io';

   const reviewImageUrl = `${BASE_URL}/api/files/review/${selectReview.id}/${selectReview.image[0]}`;

   const reviewDetailFicture = document.querySelector(
      '.review__detail--ficture'
   );

   const userName = document.querySelector('.profile__user-name');
   const storeName = document.querySelector('.review-detail__store-name');

   const storeAddress = document.querySelector(
      '.review-detail__store-info--address'
   );

   const storeCategory = document.querySelector(
      '.review-detail__store-info--name'
   );
   const reviewHow = document.querySelector('.review-info--how');
   const waitingTime = document.querySelector('.review-info--delay');
   const reviewWith = document.querySelector('.review-info--with');

   const reviewContent = document.querySelector('.review-detail__content');

   reviewDetailFicture.style.backgroundImage = `url(${reviewImageUrl})`;

   userName.textContent = record.username;

   storeName.textContent = stores.name;
   storeCategory.textContent = stores.category;
   storeAddress.textContent = stores.address;

   reviewHow.textContent = selectReview.how;

   waitingTime.textContent = selectReview.delay;

   reviewWith.textContent =
      selectReview.with.length === 1
         ? selectReview.with[0]
         : `${selectReview.with[0]} / ${selectReview.with[1]}`;

   reviewContent.textContent = selectReview.review;

   selectReview.keyword.forEach((key) => {
      const reviewTagContainer = document.querySelector(
         '.review-tag-container'
      );
      console.log(key);
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
})();
