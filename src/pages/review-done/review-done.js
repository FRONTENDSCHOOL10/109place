import '/src/pages/review-done/review-done.scss';
import pb from '/src/lib/utils/pocketbase';
import { getStorage } from 'kind-tiger';

// 가게 이름으로 content 변경
let placeName = document.querySelector('.done__comment__text__place');

// let recentBtn = document.querySelector('#recentReview');

async function setPlaceName() {
   placeName.textContent = await getStorage('place_name');
}
setPlaceName();

/* ------------------아래 정리할 부분임 -------------------------- */
// console.log(placeName.textContent)

// 지금 로그인한 유저 정보
// const userInfo = await pb.collection('users').getOne(pb.authStore.model.id);
// const userId = userInfo.id;

// // 제일 최근 리뷰 가져오기
// const selectReview = await pb.collection('review').getList(1, 1, {
//    sort: '-created',
//    filter: `users_id="${userId}"`,
// });
// // console.log(selectReview);
// // console.log(selectReview.items[0].stores_id);
// function handleRecent() {
//    window.location.href = '/src/pages/my-page/review/review.html';
// }

// recentBtn.addEventListener('click', handleRecent);
/* -------------------------------------------- */
