import pb from '/src/lib/utils/pocketbase';

const record = await pb.collection('users').getOne(pb.authStore.model.id);

const urlParams = new URLSearchParams(window.location.search);

const selectReview = await pb
   .collection('review')
   .getOne(urlParams.get('reviewId'));

console.log(selectReview);

const userName = document.querySelector('.profile__user-name');
userName.textContent = record.username;

const storeName = document.querySelector('.review-detail__store-name');
storeName.textContent = selectReview.stores_id;

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
