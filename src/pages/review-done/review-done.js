import '/src/pages/review-done/review-done.scss';
import pb from '/src/lib/utils/pocketbase';

let placeName = document.querySelector('.done__comment__text__place');

// 지금 로그인한 유저 정보
// 제일 최근 리뷰 가져오기
const userInfo = await pb.collection('users').getOne(pb.authStore.model.id);
const userId = userInfo.id;

console.log(userId);

const selectReview = await pb.collection('review').getList(1, 1,{
  sort: '-created',
  filter: `users_id="${userId}"`,
});

console.log(selectReview.items[0].stores_id);
