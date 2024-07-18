/* eslint-disable no-undef */
import '/src/pages/homepage/homepage.scss';
import { noNullParse } from '/src/lib/utils/getNoNullParse';
import pb from '/src/lib/utils/pocketbase.js';
import { needPlaceInfo } from '/src/lib/utils/Map/searchPlace';
import { getStorage } from 'kind-tiger';

// 원위치 버튼
const resetBtn = document.querySelector('.map__control--reset');
const goStartBtn = document.querySelector('.homepage__gostart');
/* ------------------- [ 지도 생성 ] ------------------ */
const defaultX = 126.9790586047037;
const defaultY = 37.57089677546261;
const container = document.getElementById('map');
const options = {
   center: new kakao.maps.LatLng(defaultY, defaultX),
   level: 3, // 지도의 레벨(확대, 축소 정도)
};
const map = new kakao.maps.Map(container, options);

/* ------------------- [ 마커 표시 ] ------------------ */
const imageSrc = '/src/assets/marker_search.svg';
const reviewImgSrc = '/src/assets/marker_review.svg';
const imageSize = new kakao.maps.Size(64, 69);
const imageOption = { offset: new kakao.maps.Point(32, 69) };
const markerImage = new kakao.maps.MarkerImage(
   imageSrc,
   imageSize,
   imageOption
);
const markerImageReview = new kakao.maps.MarkerImage(
   reviewImgSrc,
   imageSize,
   imageOption
);
/* -------------- [ 좌표 주소 가져오기 ] -------------- */
if (localStorage.getItem('home_place_name')) {
   const local = noNullParse([
      'home_search_x',
      'home_search_y',
      'home_place_name',
      'home_road_address_name',
      'home_category',
   ]);

   map.setCenter(
      new kakao.maps.LatLng(local.home_search_y, local.home_search_x)
   );

   const info = `
  <div class="info" tabindex='3'>
    <div class="info__semi" >
      <p class="info__name">${local.home_place_name}</p>
      ${local.home_category ? `<p class="info__category">${local.home_category}</p>` : ''}
    </div>
    ${local.home_road_address_name ? `<p class="info__address">${local.home_road_address_name}</p>` : ''}
  </div>
`;

   displayMarker(local, info);

   // 장소 상세 창으로 갈 버튼
   const placeDetail = document.querySelector('.info');

   placeDetail.addEventListener('click', handleDetail);

   // 엔터치면 들어갈 수 있게
   placeDetail.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
         window.location.href = '/src/pages/place-detail/place-detail.html';
      }
   });
}

function displayMarker(place, info) {
   const markerPosition = new kakao.maps.LatLng(
      place.home_search_y,
      place.home_search_x
   );
   const marker = new kakao.maps.Marker({
      map: map,
      image: markerImage,
      position: markerPosition,
   });

   // 커스텀 오버레이 생성
   const customOverlay = new kakao.maps.CustomOverlay({
      position: markerPosition,
      content: info,
      yAnchor: 1,
   });
   customOverlay.setMap(map);
}

/* -------------------- [ 지도 위치 초기화 버튼 ] -------------------- */
function handleReset(e) {
   e.preventDefault();
   map.setCenter(new kakao.maps.LatLng(defaultY, defaultX));
}
function handleDetail() {
   window.location.href = '/src/pages/place-detail/place-detail.html'; // 상세 페이지 URL로 변경
}
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMLEFT);

resetBtn.addEventListener('click', handleReset);

/* ---------- [ 지금 로그인 한 아이디가 가지고 있는 리뷰 적은 장소 표시하기 ] ---------- */

// 지금 로그인된 정보 불러오기
// 로그인된 정보에서 user id 가져오기
// 가져온 아이디로 이 아이디가 관계형 값으로 있는 리뷰 가져오기
// 그 리뷰 필드 안에서 stores_id 가져오기
// stores_id 가 아이디인 stores 필드에서 address 가져오기
// address 로 주소 검색해서 store data 에서 x, y 가져오기

// 로그인 된 유저 정보
function getUserEmail() {
   const user = pb.authStore.model;
   return user;
}

// 이메일로 유저 아이디 가져오기
async function getUserIdByEmail(email) {
   const user = await pb
      .collection('users')
      .getFirstListItem(`email="${email}"`);
   return user ? user.id : null;
}
// 가게 아이디로 가게 정보 가져오기
async function getStoreDetails(storeId) {
   try {
      const store = await pb.collection('stores').getOne(storeId);
      return store;
   } catch (error) {
      console.error(`Error fetching store details for ID ${storeId}:`, error);
      return null;
   }
}

// 유저 아이디가 연동되어 있는 리뷰 필드에서 그 리뷰랑 연결된 가게 아이디 가져오기
async function getStoresId(userId) {
   try {
      const reviews = await pb.collection('review').getFullList({
         filter: `users_id="${userId}"`,
      });
      const storesIds = reviews.map((review) => review.stores_id);
      const uniqueStoreIds = [...new Set(storesIds)];
      const storeDetailsPromises = uniqueStoreIds.map((storeId) =>
         getStoreDetails(storeId)
      );
      const storeDetails = await Promise.all(storeDetailsPromises);

      const storeAddresses = storeDetails
         .filter((store) => store !== null)
         .map((store) => store.address || 'Unknown');

      return storeAddresses;
   } catch (error) {
      console.log('Error', error);
   }
}

async function initializeMap() {
   try {
      const user = getUserEmail();
      const userId = await getUserIdByEmail(user.email);

      if (!userId) {
         console.error('User ID not found.');
         return;
      }

      const storeAddresses = await getStoresId(userId);
      let geocoder = new kakao.maps.services.Geocoder();

      storeAddresses.forEach((place) => {
         geocoder.addressSearch(place, async function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
               // let sample = await searchPlaceNoName(place);
               // console.log(sample);
               // 리뷰 쓴 장소 이름, 주소, 카테고리 가져오기
               let reviewPlaceInfo = await needPlaceInfo(place);
               const markerPosition = new kakao.maps.LatLng(
                  reviewPlaceInfo.y,
                  reviewPlaceInfo.x
               );
               const marker = new kakao.maps.Marker({
                  map: map,
                  image: markerImageReview,
                  position: markerPosition,
               });
               displayMarker(result);

               // 일단 이름만 보이게!
               const info = `
                  <div class="info info__review">
                     <div class="info__semi">
                        <p class="info__name">${reviewPlaceInfo.place_name}</p>
                     </div>
                  </div>
`;
               const customOverlay = new kakao.maps.CustomOverlay({
                  position: markerPosition,
                  content: info,
                  yAnchor: 1,
               });
               kakao.maps.event.addListener(marker, 'click', () => {
                  customOverlay.setMap(map); // 오버레이 표시

                  // 5초 후에 오버레이 숨기기
                  setTimeout(() => {
                     customOverlay.setMap(null);
                  }, 2000); // 5000 밀리초 = 5초
               });
            }
         });
      });
   } catch (error) {
      console.error('Error initializing map:', error);
   }
}

// 초기화 함수 호출
initializeMap();

/* -------------------------------------------- */
/* -------------------------------------------- */
/* -------------------------------------------- */

// 전체 로직
async function renderPlaceInfoAll() {
   const searchData = await getLocalStorageData();
   let foundData = await matchLocalWithDB(searchData);
}

renderPlaceInfoAll();

//로컬 스토리지에서 데이터 꺼내오기
async function getLocalStorageData() {
   const name = await getStorage('home_place_name');
   const address = await getStorage('home_road_address_name');

   return { name, address };
}

// 검색 페이지에서 검색한 가게 정보가 DB에 존재하는지 확인 (중복 체크)
async function matchLocalWithDB(searchData) {
   const storeRecordData = await pb.collection('stores').getFullList();

   const foundData = storeRecordData.filter(
      (data) =>
         data.name === searchData.name && data.address === searchData.address
   );

   if (!foundData.length) {
      insertData(searchData);
   }
   return foundData;
}

// stores 테이블에 Data 저장하는 함수
async function insertData(searchData) {
   const data = {
      name: searchData.name,
      address: searchData.address,
   };

   await pb.collection('stores').create(data);
}

// 임시 로그아웃 버튼 - 인증상태 삭제하면서 로컬에 있던거 지우기.
// 원래는 제일 시작페이지로 이동하게끔.
function handleGoStart() {
   localStorage.removeItem('pocketbase_auth');
   localStorage.clear();
   alert('로그아웃되었습니다. \n시작페이지로 이동합니다! 🐕');
   location.href = '/index.html';
}
goStartBtn.addEventListener('click', handleGoStart);
document.addEventListener('keydown', function (event) {
   if (event.key === 'Enter') {
      handleGoStart();
   }
});
