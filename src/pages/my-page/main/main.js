import pb from '/src/lib/utils/pocketbase';
(async () => {
   const reviewList = await pb.collection('review').getList(1, 50);
   const user = await pb.collection('users').getOne(pb.authStore.model.id);
   const storeList = await pb.collection('stores').getList(1, 50);

   const BASE_URL = 'https://vanilla-109place.pockethost.io';

   const myPageHeader = document.querySelector('.my-page__header');
   const myPageFooter = document.querySelector('.my-page__footer');
   const reviewContainer = document.querySelector('.review--container');
   const footerButtonTop = document.querySelector('.footer--button-top');
   const userName = document.querySelector('.profile__user-name');
   const profileImg = document.querySelector('.my-page__header__profile--img');
   const reviewCount = document.querySelector(
      '.my-page__section--review-count'
   );
   const profileReviewCount = document.querySelector('.profile__review-count');
   const reviewCreate = document.querySelector('.review-create');

   const profileImageUrl = `${BASE_URL}/api/files/users/${user.id}/${user.profile_picture}`;

   profileImg.src = profileImageUrl;

   userName.textContent = user.username;
   userName.addEventListener('click', () => {
      location.href = `/src/pages/my-page/profile/profile.html`;
   });
   profileImg.addEventListener('click', () => {
      location.href = `/src/pages/my-page/profile/profile.html`;
   });
   reviewCreate.addEventListener('click', () => {
      location.href = `/src/pages/review-create/date-place.html`;
   });

   const scrollHandler = () => {
      if (reviewContainer.scrollTop > 0) {
         myPageHeader.classList.add('hidden');
         myPageFooter.classList.add('hidden');
         footerButtonTop.classList.remove('hidden');

         reviewContainer.style.height = 'auto';
         reviewContainer.style.maxHeight = '29.9rem';
      } else {
         myPageHeader.classList.remove('hidden');
         myPageFooter.classList.remove('hidden');
         footerButtonTop.classList.add('hidden');

         reviewContainer.style.height = `15.125rem`;
         reviewContainer.style.maxHeight = `15.125rem`;
      }
   };

   const clickTopMoveHandler = () => {
      reviewContainer.scrollTo({
         top: 1,
         behavior: 'smooth',
      });
   };

   let reviewsLength = 0;

   const container = document.getElementById('container');

   reviewList.items.forEach((reviews) => {
      if (reviews.users_id === user.id) {
         const figure = document.createElement('figure');
         figure.className = 'review--card';
         const reviewImageUrl = `${BASE_URL}/api/files/review/${reviews.id}/${reviews.image[0]}`;
         figure.style.backgroundImage = `url(${reviewImageUrl})`;

         const figcaption = document.createElement('figcaption');
         figcaption.className = 'review--card__title';

         const locationSpan = document.createElement('span');

         const nameSpan = document.createElement('span');
         storeList.items.forEach((stores) => {
            if (reviews.stores_id === stores.id) {
               locationSpan.textContent = stores.category;
               nameSpan.textContent = stores.address;
            }
         });

         //    클릭 이벤트 추가
         figure.addEventListener('click', () => {
            location.href = `/src/pages/my-page/review/review.html?reviewId=${reviews.id}`;
         });

         figcaption.appendChild(locationSpan);
         figcaption.appendChild(nameSpan);
         figure.appendChild(figcaption);
         container.appendChild(figure);

         reviewsLength += 1;
      }
   });

   profileReviewCount.textContent = `리뷰 ${reviewsLength}`;
   reviewCount.textContent = `리뷰 ${reviewsLength}`;

   reviewContainer.addEventListener('scroll', scrollHandler);

   footerButtonTop.addEventListener('click', clickTopMoveHandler);

   //리뷰가 적을경우 리팩토링..ㄴ
})();
