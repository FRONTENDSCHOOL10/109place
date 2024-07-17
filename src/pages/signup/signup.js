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

   // 아이디 유효성 검사
   function isValidId(id) {
      const idRegex = /^[a-zA-Z0-9]{3,10}$/;
      const isIdOk = idRegex.test(id);
      const idError = document.querySelector('#id-type-error');
      if (!isIdOk) {
         idError.classList.remove('hidden');
      } else {
         idError.classList.add('hidden');
      }
      return isIdOk;
   }

   // 이메일 유효성 검사
   function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailOk = emailRegex.test(email);
      const emailError = document.querySelector('#email-type-error');
      if (!isEmailOk) {
         emailError.classList.remove('hidden');
      } else {
         emailError.classList.add('hidden');
      }
   }

   // 비밀번호 유효성 검사
   function isValidPassword(password) {
      const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
      return passwordRegex.test(password);
   }

   // 비밀번호 확인란과 비밀번호 일치 여부 검사
   function checkPasswordMatch() {
      if (userCheckPw.value !== '' && userPw.value !== userCheckPw.value) {
         $('#checkpw-error').classList.remove('hidden');
         return false;
      } else {
         $('#checkpw-error').classList.add('hidden');
         return true;
      }
   }

   // 아이디와 이메일 중복 여부 확인 및 HTML 요소의 에러 메시지 처리
   async function isDuplicateIdOrEmail(id, email) {
      // HTML 요소 선택
      const idErrorElement = document.getElementById('id-duplicate-error');
      const emailErrorElement = document.getElementById(
         'email-duplicate-error'
      );

      // 아이디와 이메일 중복 검사
      const filterId = `username='${id}'`;
      const filterEmail = `email='${email}'`;

      try {
         // 아이디로 필터링된 사용자 목록 가져오기
         const usersById = await pb.collection('users').getFullList({
            filter: filterId,
         });

         // 이메일로 필터링된 사용자 목록 가져오기
         const usersByEmail = await pb.collection('users').getFullList({
            filter: filterEmail,
         });

         // 중복 여부 확인
         const idDuplicate = usersById.length > 0;
         const emailDuplicate = usersByEmail.length > 0;

         // 중복된 경우 에러 메시지 표시
         if (idDuplicate) {
            idErrorElement.classList.remove('hidden');
         } else {
            idErrorElement.classList.add('hidden');
         }

         if (emailDuplicate) {
            emailErrorElement.classList.remove('hidden');
         } else {
            emailErrorElement.classList.add('hidden');
         }
         return idDuplicate && emailDuplicate;
      } catch (error) {
         console.error('중복 검사 중 오류 발생:', error);
      }
   }

   // 검증 및 버튼 활성화/비활성화
   async function validation() {
      const isIdValid = isValidId(userId.value);
      const isEmailValid = isValidEmail(userEmail.value);
      const isPasswordValid = isValidPassword(userPw.value);
      const isPasswordsMatch = checkPasswordMatch();

      // 중복 여부 확인
      const isDuplicate = await isDuplicateIdOrEmail(
         userId.value,
         userEmail.value
      );
      console.log(isDuplicate);

      // 버튼 활성화/비활성화
      if (
         isIdValid &&
         isEmailValid &&
         isPasswordValid &&
         isPasswordsMatch &&
         userCheckPw.value !== '' &&
         !isDuplicate
      ) {
         signupBtn.removeAttribute('disabled');
         signupBtn.classList.remove('btn-p--disabled');
         signupBtn.classList.add('btn-p--default');
      } else {
         signupBtn.setAttribute('disabled', true);
         signupBtn.classList.add('btn-p--disabled');
         signupBtn.classList.remove('btn-p--default');
      }
   }

   // 포커스 아웃 이벤트를 통해 검증 수행
   userId.addEventListener('blur', validation);
   userEmail.addEventListener('blur', validation);
   userPw.addEventListener('blur', validation);
   userCheckPw.addEventListener('blur', validation);

   // 회원가입 처리
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

   // 회원가입 버튼 클릭 시 처리
   signupBtn.addEventListener('click', handleSignup);
}

register();
