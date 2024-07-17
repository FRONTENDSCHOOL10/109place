import '/src/pages/login/login.scss';
import pb from '/src/lib/utils/pocketbase';

const loginBtn = document.querySelector('.btn__login');

function handleLoginError(error) {
   let message = '';

   if (error.status === 400) {
      message = '아이디 또는 비밀번호를 확인해주세요.';
   }

   alert(message);
}
async function handleLogin(e) {
   e.preventDefault();
   //  입력한 아이디, 패스워드 불러옴
   const userId = document.querySelector('#userid').value;
   const userPw = document.querySelector('#userpw').value;
   // 입력한 아이디, 패스워드로 인증 요청하고 성공했으면 alert 띄우고 홈페이지로 이동
   // 실패시 에러메시지 표시
   await pb
      .collection('users')
      .authWithPassword(userId, userPw)
      .then(() => {
         alert('🐾 로그인 되었습니다 🐾');
         console.log(pb.authStore.isValid);
         console.log(pb.authStore.token);
         console.log(pb.authStore.model.id);
         //  홈페이지로 이동
         location.href = '/src/pages/homepage/homepage.html';
      })
      .catch((error) => {
         console.log(error.data);
         handleLoginError(error);
      });
}
loginBtn.addEventListener('click', handleLogin);
