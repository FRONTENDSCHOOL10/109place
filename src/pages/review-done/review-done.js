import '/src/pages/review-done/review-done.scss';
// import pb from '/src/lib/utils/pocketbase';
import { getStorage } from 'kind-tiger';

// 가게 이름으로 content 변경
let placeName = document.querySelector('.done__comment__text__place');
// 다른 리뷰 작성하기
let newReviewBtn = document.querySelector('#newReview');
// 방금 쓴 리뷰 보러 가기
let recentBtn = document.querySelector('#recentReview');
// x 버튼
let exitBtn = document.querySelector('#exitBtn');

async function setPlaceName() {
   placeName.textContent = await getStorage('place_name');
   placeName.setAttribute("aria-label",`${placeName.textContent}의 리뷰를 남겨주셨어요!`);
   placeName.setAttribute('aria-live', 'polite'); 
}

// 장소 정보 아이디 제거하는 함수
async function removeId() {
   localStorage.removeItem('stores_id');
}

function handleNewReview(e) {
   e.preventDefault();
   removeId();
   window.location.href = '/src/pages/review-search/review-search.html';
}
function handleRecent(e) {
   e.preventDefault();
   removeId();
   window.location.href = '/src/pages/my-page/review/review.html';
}
function handleExit(e) {
   e.preventDefault();
   removeId();
   window.location.href = '/src/pages/my-page/main/main.html';
}

setPlaceName();
newReviewBtn.addEventListener('click', handleNewReview);
recentBtn.addEventListener('click', handleRecent);
exitBtn.addEventListener('click', handleExit);
