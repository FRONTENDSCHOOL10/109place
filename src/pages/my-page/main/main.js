import pb from '/src/lib/utils/pocketbase';

const reviewList = await pb.collection('review').getList(1, 50);
const record = await pb.collection('users').getOne(pb.authStore.model.id);

const myPageHeader = document.querySelector('.my-page__header');
const myPageFooter = document.querySelector('.my-page__footer');
const reviewContainer = document.querySelector('.review--container');
const footerButtonTop = document.querySelector('.footer--button-top');
const userName = document.querySelector('.profile__user-name');
const profileImg = document.querySelector('.my-page__header__profile--img');
const reviewCount = document.querySelector('.my-page__section--review-count');

profileImg.src = record.profile_picture;
userName.textContent = record.username;
userName.addEventListener('click', () => {
   location.href = `/src/pages/my-page/profile/profile.html`;
});

const scrollHandler = () => {
   if (reviewContainer.scrollTop > 0) {
      myPageHeader.classList.add('hidden');
      myPageFooter.classList.add('hidden');
      reviewContainer.style.height = `40.5rem`;
      footerButtonTop.classList.remove('hidden');
   } else {
      myPageHeader.classList.remove('hidden');
      reviewContainer.style.height = `15.125rem`;
      myPageFooter.classList.remove('hidden');
      footerButtonTop.classList.add('hidden');
   }
};

const clickTopMoveHandler = () => {
   reviewContainer.scrollTo({
      top: 1,
      behavior: 'smooth',
   });
};

const container = document.getElementById('container');

reviewCount.textContent = `리뷰 ${reviewList.items.length}`;

reviewList.items.forEach((reviews) => {
   const figure = document.createElement('figure');
   figure.className = 'review--card';
   figure.style.backgroundImage = `url(${reviews.image[0]})`;
   const figcaption = document.createElement('figcaption');
   figcaption.className = 'review--card__title';

   const locationSpan = document.createElement('span');
   locationSpan.textContent = reviews.review;

   const nameSpan = document.createElement('span');
   nameSpan.textContent = reviews.stores_id;

   //    클릭 이벤트 추가
   figure.addEventListener('click', () => {
      location.href = `/src/pages/my-page/review/review.html?reviewId=${reviews.id}`;
   });

   figcaption.appendChild(locationSpan);
   figcaption.appendChild(nameSpan);
   figure.appendChild(figcaption);
   container.appendChild(figure);
});

reviewContainer.addEventListener('scroll', scrollHandler);

footerButtonTop.addEventListener('click', clickTopMoveHandler);

//리뷰가 적을경우 리팩토링..ㄴ
