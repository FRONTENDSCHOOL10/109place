import '/src/pages/signup/signup.scss';
import { getNode as $ } from 'kind-tiger';
import pb from '/src/lib/utils/pocketbase';

/* -------------------------------------------- */
//todo 1. 아이디 조건 : 최소 영문 3자 이상
//todo 2. 비밀번호 조건 : 특수문자 포함 최소 8자
//todo 3. 이메일 비밀번호가 모두 입력되고 조건을 만족해야 회원가입 버튼 활성화
//todo 4. 이메일로 중복 유저 있는지 확인 ( + 근데 아이디도 중복 확인해야 할 것 같음. - 중복 시 label 안에 span 교체하기 아님 추가하기 )
//* 회원가입 버튼이 뜨려면 : 전부 입력되었는가? -> 아이디가 중복되지 않는가? -> 이메일이 중복되지 않는가? -> 비밀번호와 비밀번호의 확인이 동일한가?
/* -------------------------------------------- */

function register() {
   const userId = $('#userid');
   const userPw = $('#userpw');
   const userEmail = $('#useremail');
   const userCheckPw = $('#usercheckpw');
   const signupBtn = $('.btn__signup');
   function isValidId(id) {
      return id.length >= 3;
   }
   function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   }
   function isValidPassword(password) {
      const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
      return passwordRegex.test(password);
   }
   function checkPasswordMatch() {
      if (
         userCheckPw.value !== '' &&
         userPw.value !== userCheckPw.value
         //  비밀번화 확인란에 포커스 & 확인란이 비지 않았음 & 확인란과 비밀번호가 불일치 -> 에러메시지 일어나야함 -> false
      ) {
         // 불일치 -> hidden 지워서 에러메시지 띄우기
         $('#checkpw-error').classList.remove('hidden');
         return false;
      } else {
         // 일치 에러메시지 숨기기
         $('#checkpw-error').classList.add('hidden');
         return true;
      }
   }
   function validation() {
      const isIdValid = isValidId(userId.value);
      const isEmailValid = isValidEmail(userEmail.value);
      const isPasswordValid = isValidPassword(userPw.value);
      const isPasswordsMatch = checkPasswordMatch();
      // 아이디 양식 맞음 & 이메일 양식 맞음 & 비밀번호 양식 맞음 & 비밀번호, 비밀번호 확인란 일치함
      if (
         isIdValid &&
         isEmailValid &&
         isPasswordValid &&
         isPasswordsMatch &&
         userCheckPw.value !== ''
      ) {
         signupBtn.removeAttribute('disabled');
         //  활성화
         signupBtn.classList.remove('btn-p--disabled');
         signupBtn.classList.add('btn-p--default');
      } else {
         signupBtn.setAttribute('disabled', true);
         //  비활성화
         signupBtn.classList.add('btn-p--disabled');
         signupBtn.classList.remove('btn-p--default');
      }
   }
   async function handleSignup(e) {
      e.preventDefault();
      const id = userId.value;
      const email = userEmail.value;
      const password = userPw.value;
      const checkPassword = userCheckPw.value;
      const data = {
         username: id,
         email,
         emailVisibility: true,
         password,
         passwordConfirm: checkPassword,
      };

      await pb
         .collection('users')
         .create(data)
         .then(() => {
            alert(
               '🐶 회원 가입이 완료되었습니다! 로그인 페이지로 이동합니다! 🐶'
            );
            location.href = '/src/pages/login/login.html';
         })
         .catch((error) => {
            alert('🐾 회원 가입에 실패했습니다. 다시 시도해주세요. 🐾' + error);
            console.log(error);
         });
   }

   userId.addEventListener('input', validation);
   userPw.addEventListener('input', validation);
   userEmail.addEventListener('input', validation);
   userCheckPw.addEventListener('input', validation);
   signupBtn.addEventListener('click', handleSignup);
}
register();
