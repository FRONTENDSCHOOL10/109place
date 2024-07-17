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
  let foundData = await matchLocalWithDB(searchData);

  if(!foundData.length){
    foundData = await matchLocalWithDB(searchData);
  }

  const collectionId = foundData[0].collectionId;

  renderPlaceInfo(foundData[0]);
  renderPlaceReview(foundData[0]);

  //리뷰 통계 렌더링
  //리뷰 렌더링
}

renderPlaceInfoAll();


//로컬 스토리지에서 데이터 꺼내오기
async function getLocalStorageData(){
  const name = await getStorage('home_place_name');
  const address = await getStorage('home_road_address_name');

  return {name,address};
}


// 검색 페이지에서 검색한 가게 정보가 DB에 존재하는지 확인 (중복 체크)
async function matchLocalWithDB(searchData){
  const storeRecordData = await pb.collection('stores').getFullList();

  const foundData = storeRecordData.filter( data => data.name === searchData.name && data.address === searchData.address);

  if(!foundData.length){
    insertData(searchData);
  }

  return foundData;
}


// stores 테이블에 Data 저장하는 함수
async function insertData(searchData){
  const data = {
    "name": searchData.name,
    "address": searchData.address
  };

  await pb.collection('stores').create(data);
}


// 가게 정보 렌더링
async function renderPlaceInfo(foundData){
  const BASE_URL = 'https://vanilla-109place.pockethost.io';
  const record = await pb.collection('stores_images').getOne('83de3obrq6n5j24');


  const headerTemplate =`
    <span>${foundData.name}</span>
  `


  const placeImgTemplate = `
    <section class="place-img-container">
      <div class="container container1">
        <img src="${BASE_URL}/api/files/${record.collectionId}/${record.id}/${record.images[0]}" alt=""/>
      </div>

      <div class="container container2">
        <img src="${BASE_URL}/api/files/${record.collectionId}/${record.id}/${record.images[1]}" alt="" class="place-img"/>
        <img src="${BASE_URL}/api/files/${record.collectionId}/${record.id}/${record.images[2]}" alt="" class="place-img"/>
        <img src="${BASE_URL}/api/files/${record.collectionId}/${record.id}/${record.images[3]}" alt="" class="place-img"/>
        <img src="${BASE_URL}/api/files/${record.collectionId}/${record.id}/${record.images[4]}" alt="" class="place-img"/>
      </div>
    </section>

  `

  const placeTextTemplate =`
        <div class="place-info">
        <div class="place-info__title">
          <h1>${foundData.name}</h1>
          <span class="place-info__category">${foundData.category}</span>
        </div>
        <div class="place-info__reviews">
          <span>리뷰</span>
          <span class="place-info__reviews-count">${foundData.reviews_count}</span>
        </div>

        <div class="decorative-line--light"></div>

        <ul class="place-info__details">
          <li>
            <svg role="img" aria-label="주소 이미지" class="place-info__icon--small">
              <use href="/src/assets/stack.svg#icon_pin" />
            </svg>
            <p class="nav__text">${foundData.address}</p>
          </li>
          <li>
            <svg role="img" aria-label="시계 이미지" class="place-info__icon--small">
              <use href="/src/assets/stack.svg#icon_clock" />
            </svg>
            <p class="nav__text">영업 중</p>
            <p class="nav__text">${foundData.business_hours}에 영업 종료</p>
          </li>
          <li>
            <svg role="img" aria-label="전화기 이미지" class="place-info__icon--small">
              <use href="/src/assets/stack.svg#icon_call2" />
            </svg>
            <p class="nav__text">${foundData.phone_number}</p>
          </li>
        </ul>

        <div class="decorative-line--light"></div>
      </div>
  `

  insertAfter('button',headerTemplate);
  insertFirst('.place-information',placeImgTemplate);
  insertBefore('.action-bar',placeTextTemplate);
}






// 가게 리뷰 렌더링
async function renderPlaceReview(foundData){

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
            <div class="swiper-slide"><img src="./image-sample/image 26.png" alt="" /></div>
            <div class="swiper-slide"><img src="./image-sample/image 27.png" alt="" /></div>
            <div class="swiper-slide"><img src="./image-sample/음료.png" alt="" /></div>
            <div class="swiper-slide"><img src="./image-sample/아보카도.png" alt="" /></div>
          </div>
        </div>


        <!-- 리뷰 -->
        <div class="review-text">
          <div class="review-text__visit-detail">
            <span>예약 후 이동</span>
            <div class="dot-separator"></div>
            <span class="fixed-text">대기시간</span>
            <span>바로 입장</span>
            <div class="dot-separator"></div>
            <span>지인/동료</span>
          </div>

          <p class="review-text__content">지중해 음식을 평소에도 너무 좋아해서 자주 찾아다니는데 너무 맛있는거 있쬬~~ 아보카도 짱이에요~ 추가해서 꼭 드시고 예약하고 가면 웨이팅 없어서 좋아요!! 진짜 맛있어요! 추천ㄱㄱ</p>

          <div class="review-text__tag">
            <div class="review-tag" role="group" aria-label="재료가 신선해요">
              <p>🥦 재료가 신선해요</p>
            </div>
    
            <div class="review-tag" role="group" aria-label="양이 많아요">
              <p>🍚 양이 많아요</p>
            </div>

            <div class="review-tag" role="group" aria-label="재료가 신선해요">
              <p>🥦 재료가 신선해요</p>
            </div>
  
            <div class="review-tag" role="group" aria-label="양이 많아요">
              <p>🍚 양이 많아요</p>
            </div>

            <div class="review-tag" role="group" aria-label="재료가 신선해요">
              <p>🥦 재료가 신선해요</p>
            </div>

          </div>

        </div>

      </article>

    <div class="decorative-line--light"></div>
   `

   insertAfter('.place-reviews__header',placeReviewTemplate);
}

// insertBefore, insertAfter, insertFirst, insertLast