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
})();
