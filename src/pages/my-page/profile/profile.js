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
   const textUserName = document.querySelector('.user-name__input');
   textArea.addEventListener('input', handleCount);

   myPageProfileImg.style.backgroundImage = `url(${profileImageUrl})`;
   textUserName.textContent = user.username;
})();
