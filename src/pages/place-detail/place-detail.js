import '/src/pages/place-detail/place-detail.scss';
import pb from '/src/lib/utils/pocketbase';

// 리뷰 이미지 스와이퍼
var swiper = new Swiper(".swiper", {
  slidesPerView: 1.8,
  spaceBetween: 6,
});


async function storeRender(){

  const storeData = await pb
  .collection('stores')
  .getFullList({
    sort: '-created'
  });

  console.log(storeData);
}

storeRender();



// 검색 -> 장소 상세
// 1. 검색에서 받은 데이터가 stores 테이블 안에 있는지 체크
//  1) 검색해서 장소 상세로 페이지 이동 시 클릭한 정보의 가게 이름과 주소 받아오기
//  2) 받아온 가게 이름과 주소가 모두 동일한 데이터가 테이블에 존재하는지 확인

// 2. 데이터 존재 여부에 따라 해당 방법으로 렌더링
//   1) 안에 있다면 -> 테이블에서 데이터 가져오기 -> 렌더링
//   2) 안에 없다면 -> 지도에서 데이터 가져오기 -> 테이블 저장 -> 렌더링