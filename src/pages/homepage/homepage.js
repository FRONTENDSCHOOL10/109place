/* eslint-disable no-undef */
import '/src/pages/homepage/homepage.scss';
import { noNullParse } from '/src/lib/utils/getNoNullParse';
import pb from '/src/lib/utils/pocketbase.js';

// 원위치 버튼
const resetBtn = document.querySelector('.map__control--reset');
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
  <div class="info">
    <div class="info__semi">
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

/* -- [ 지금 로그인 한 아이디가 가지고 있는 리뷰 적은 장소 표시하기 ] -- */

// 지금 로그인된 정보 불러오기
// 로그인된 정보에서 user id 가져오기
// 가져온 아이디로 이 아이디가 관계형 값으로 있는 리뷰 가져오기
// 그 리뷰 필드 안에서 stores_id 가져오기
// stores_id 가 아이디인 stores 필드에서 address 가져오기
// address 로 주소 검색해서 store data 에서 x, y 가져오기
//

function getUserEmail() {
   const user = pb.authStore.model;
   return user;
}
async function getUserIdByEmail(email) {
   const user = await pb
      .collection('users')
      .getFirstListItem(`email="${email}"`);
   return user ? user.id : null;
}

async function getStoreDetails(storeId) {
   try {
      const store = await pb.collection('stores').getOne(storeId);
      return store;
   } catch (error) {
      console.error(`Error fetching store details for ID ${storeId}:`, error);
      return null;
   }
}

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

      var geocoder = new kakao.maps.services.Geocoder();

      storeAddresses.forEach((place) => {
         geocoder.addressSearch(place, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
               var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

               var marker = new kakao.maps.Marker({
                  map: map,
                  image: markerImageReview,
                  position: coords,
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
