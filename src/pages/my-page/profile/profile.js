import pb from '/src/lib/utils/pocketbase';

(async () => {
   const user = await pb.collection('users').getOne(pb.authStore.model.id);

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
      count.textContent = `${textLength}`;
   }

   const count = document.querySelector('.input-count__count');
   const textAreas = document.querySelectorAll('.input-count__input');
   const textUserName = document.querySelector('.user-name__input');
   const textUserInfo = document.querySelector('.user-info__input');

   textAreas.forEach((item) => {
      item.addEventListener('input', handleCount);
   });

   myPageProfileImg.style.backgroundImage = `url(${profileImageUrl})`;
   textUserName.value = user.username;
   textUserInfo.value = user.self_introduction;

   const userInfoChange = async () => {
      const data = {
         username: textUserName.value,
         emailVisibility: user.emailVisibility,
         password: user.password,
         passwordConfirm: user.passwordConfirm,
         oldPassword: user.oldPassword,
         self_introduction: textUserInfo.value,
         number_of_reviews: user.number_of_reviews,
      };

      const record = await pb.collection('users').update(user.id, data);
      location.href = `/src/pages/my-page/main/main.html`;
   };

   const profileSubmitBtn = document.querySelector('.profile-submit');
   profileSubmitBtn.addEventListener('click', userInfoChange);

   const headerBackBtn = document.querySelector('.profile__header--back-btn');
   const clickBackHandler = () => {
      location.href = `/src/pages/my-page/main/main.html`;
   };
   headerBackBtn.addEventListener('click', clickBackHandler);

   // 탈퇴하기 누르면 회원 탈퇴
   const leaveButton = document.querySelector('.leave-button');
   leaveButton.addEventListener('click', async () => {
      await pb.collection('users').delete(user.id);
      location.href = `/src/pages/my-page/login/login.html`;
   });
})();
