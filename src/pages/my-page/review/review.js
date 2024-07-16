import pb from '/src/lib/utils/pocketbase';

(async () => {
   const record = await pb.collection('users').getOne(pb.authStore.model.id);

   const urlParams = new URLSearchParams(window.location.search);

   const selectReview = await pb
      .collection('review')
      .getOne(urlParams.get('reviewId'));

   const stores = await pb.collection('stores').getOne(selectReview.stores_id);

   console.log(stores);

   const userName = document.querySelector('.profile__user-name');
   userName.textContent = record.username;

   const storeName = document.querySelector('.review-detail__store-name');
   storeName.textContent = stores.name;

   const storeCategory = document.querySelector(
      '.review-detail__store-info--name'
   );
   storeCategory.textContent = stores.category;

   const storeAddress = document.querySelector(
      '.review-detail__store-info--address'
   );
   storeAddress.textContent = stores.address;

   const reviewHow = document.querySelector('.review-info--how');
   reviewHow.textContent = selectReview.how;

   const waitingTime = document.querySelector('.review-info--delay');
   waitingTime.textContent = selectReview.delay;

   const reviewWith = document.querySelector('.review-info--with');
   reviewWith.textContent =
      selectReview.with.length === 1
         ? selectReview.with[0]
         : `${selectReview.with[0]} / ${selectReview.with[1]}`;

   const reviewContent = document.querySelector('.review-detail__content');
   reviewContent.textContent = selectReview.review;
})();
