import pb from '/src/lib/utils/pocketbase';

(async () => {
   const reviewList = await pb.collection('review').getList(1, 50);
   const user = await pb.collection('users').getOne(pb.authStore.model.id);
   const storeList = await pb.collection('stores').getList(1, 50);

   const BASE_URL = 'https://vanilla-109place.pockethost.io';

   const myPageProfileImg = document.querySelector(
      '.my-page__profile__section--img'
   );

   const profileImageUrl = `${BASE_URL}/api/files/users/${user.id}/${user.profile_picture}`;

   function handleCount(e) {
      const input = e.target;
      const textLength = input.value.length;
      const textCount = input.nextElementSibling.querySelector(
         '.input-count__count'
      );

      textCount.textContent = `${textLength}`;
   }

   const textArea = document.querySelectorAll('.input-count__input');
   const textUserName = document.querySelector('.user-name__input');
   textArea.forEach((item) => {
      item.addEventListener('input', handleCount);
   });

   myPageProfileImg.style.backgroundImage = `url(${profileImageUrl})`;
   textUserName.textContent = user.username;

   const headerBackBtn = document.querySelector('.profile__header--back-btn');

   const clickBackHandler = () => {
      location.href = `/src/pages/my-page/main/main.html`;
   };
   headerBackBtn.addEventListener('click', clickBackHandler);
})();
