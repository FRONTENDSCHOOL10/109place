import '/src/pages/place-detail/place-detail.scss';
import pb from '/src/lib/utils/pocketbase';
import { getPbImageURL , deleteStorage, getStorage, insertBefore, insertAfter, insertFirst, insertLast } from "kind-tiger";


// 리뷰 이미지 스와이퍼
var swiper = new Swiper(".swiper", {
  slidesPerView: 1.8,
  spaceBetween: 6,
});



// 검색 -> 장소 상세
// 1. 검색에서 받은 데이터가 stores 테이블 안에 있는지 체크
//  1) 검색해서 장소 상세로 페이지 이동 시 클릭한 정보의 가게 이름과 주소 받아오기(로컬 스토리지)
//    sample) 로컬 스토리지에 가게 이름과 주소 저장. (페이지 연결 시 추후 삭제)
//            로컬 스토리지에서 가게 이름, 주소 가져오기.
//  2) 받아온 가게 이름과 주소가 모두 동일한 데이터가 테이블에 존재하는지 확인

// 2. 데이터 존재 여부에 따라 해당 방법으로 렌더링
//   1) 안에 있다면 -> 테이블에서 데이터 가져오기 -> 렌더링
//   2) 안에 없다면 -> 지도에서 데이터 가져오기 -> 테이블 저장 -> 렌더링





// 전체 로직
async function renderPlaceInfoAll(){
  const searchData = await getLocalStorageData();

  const placeData = await pb
    .collection('stores')
    .getList(1, 50, {
      filter: `name = "${searchData.name}" && address = "${searchData.address}"`,
    });


  renderPlaceInfo(placeData.items[0]);
  renderPlaceReview(placeData.items[0].id);

}


renderPlaceInfoAll();



//로컬 스토리지에서 데이터 꺼내오기
async function getLocalStorageData(){
  const name = await getStorage('home_place_name');
  const address = await getStorage('home_road_address_name');

  return {name,address};
}


//가게 이미지 경로 가져오기
async function getImgPath(placeData){
  const BASE_URL = 'https://vanilla-109place.pockethost.io';
  let placeImgData;
  let imgUrl = [];

  if(placeData.images[0]){
    placeImgData = await pb.collection('stores_images').getOne(placeData.images[0]);
  }

  for(let i=0 ; i<5 ; i++){
    if(!placeData.images[0]){
      imgUrl[i] = '../../assets/dog.png'
    }else{
      imgUrl[i] = `${BASE_URL}/api/files/${placeImgData.collectionId}/${placeImgData.id}/${placeImgData.images[i]}`
    }
  }

  return imgUrl;
}



// 가게 정보 렌더링
async function renderPlaceInfo(placeData){
  const imgUrl = await getImgPath(placeData);

  const headerTemplate =`
    <span>${placeData.name}</span>
  `


  const placeImgTemplate = `
    <section class="place-img-container">
      <div class="container container1">
        <img src="${imgUrl[0]}" alt="imgUrl"/>
      </div>

      <div class="container container2">
      
        <img src="${imgUrl[1]}" alt="" class="place-img"/>
        <img src="${imgUrl[2]}" alt="" class="place-img"/>
        <img src="${imgUrl[3]}" alt="" class="place-img"/>
        <img src="${imgUrl[4]}" alt="" class="place-img"/>
      </div>
    </section>

  `

  const placeTextTemplate =`
        <div class="place-info">
        <div class="place-info__title">
          <h1>${placeData.name}</h1>
          <span class="place-info__category">${placeData.category}</span>
        </div>
        <div class="place-info__reviews">
          <span>리뷰</span>
          <span class="place-info__reviews-count">${placeData.reviews_count}</span>
        </div>

        <div class="decorative-line--light"></div>

        <ul class="place-info__details">
          <li>
            <svg role="img" aria-label="주소 이미지" class="place-info__icon--small">
              <use href="/src/assets/stack.svg#icon_pin" />
            </svg>
            <p class="nav__text">${placeData.address}</p>
          </li>
          <li>
            <svg role="img" aria-label="시계 이미지" class="place-info__icon--small">
              <use href="/src/assets/stack.svg#icon_clock" />
            </svg>
            <p class="nav__text">영업 중</p>
            <p class="nav__text">${placeData.business_hours}에 영업 종료</p>
          </li>
          <li>
            <svg role="img" aria-label="전화기 이미지" class="place-info__icon--small">
              <use href="/src/assets/stack.svg#icon_call2" />
            </svg>
            <p class="nav__text">${placeData.phone_number}</p>
          </li>
        </ul>

        <div class="decorative-line--light"></div>
      </div>
  `

  insertAfter('button',headerTemplate);
  insertFirst('.place-information',placeImgTemplate);
  insertBefore('.action-bar',placeTextTemplate);
}


//리뷰를 쓴 user의 닉네임 가져오기
async function foundReviewer(item){
  const reviewer = await pb.collection('users').getOne(item.users_id);

  return reviewer;
}


// 가게 리뷰 렌더링
async function renderPlaceReview(placeId){

  const reviewData = await pb
  .collection('review')
  .getList(1, 50, {
    filter: `stores_id = "${placeId}"`,
  });

  let reviewer;
  let imgUrl;

  // for(let item of reviewData.items){
  //   reviewer = await pb.collection('users').getOne(item.users_id);
  //   console.log(reviewer);
  // }

  
  await reviewData.items.forEach(item => {
    
    const placeReviewTemplate = `
      <article class="place-reviews__content">

          <!-- 리뷰 작성자 정보 -->
          <figure class="user-profile">
            <a href="/src/pages/my-page/main/main.html">
              <img src="./image-sample/아보카도.png" alt="리뷰 작성자 프로필 이미지" />

              <div>
                <figcaption aria-label="리뷰 작성자">백구하나</figcaption>
                <p>리뷰 60</p>
              </div>
            </a>
          </figure>

          <!-- 리뷰 사진 (스와이퍼) -->
          <div class="riview-img swiper">
            <div class="swiper-wrapper">

            </div>
          </div>


          <!-- 리뷰 -->
          <div class="review-text">
            <div class="review-text__visit-detail">
              <span>${item.how}</span>
              <div class="dot-separator"></div>
              <span class="fixed-text">대기시간</span>
              <span>${item.delay}</span>
              <div class="dot-separator"></div>
              <span>${item.withwho}</span>
            </div>

            <p class="review-text__content">${item.review}<</p>

            <div class="review-text__tag">

            </div>

          </div>

        </article>

      <div class="decorative-line--light"></div>
    `



    insertAfter('.place-reviews__header',placeReviewTemplate);


    // 리뷰 사진 템플릿
    item.image.forEach(img=>{
      imgUrl = `https://vanilla-109place.pockethost.io/api/files/${item.collectionId}/${item.id}/${img}`

      const placeReviewImgTemplate=`
        <div class="swiper-slide"><img src="${imgUrl}" alt="" /></div>
      `

      insertLast('.swiper-wrapper',placeReviewImgTemplate);
    })


     // 리뷰 태그 템플릿
    item.keyword.forEach(tag=>{
      const tagText = {
        '재료' : '🥦 재료가 신선해요',
        '양' : '🍚 양이 많아요',
        '음식' : '😋 음식이 맛있어요',
        '가성비' : '👍 가성비가 좋아요',
        '메뉴' : '🍷 특별한 메뉴가 있어요'
      };

      const placeReviewTagTemplate=`
        <div class="review-tag" role="group" aria-label="리뷰태그">
          <p>${tagText[tag]}</p>
        </div>
      `

      insertLast('.review-text__tag',placeReviewTagTemplate);
    })

  });


}

// insertBefore, insertAfter, insertFirst, insertLast

