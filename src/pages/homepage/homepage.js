/* eslint-disable no-undef */
import '/src/pages/homepage/homepage.scss';
import { noNullParse } from '/src/lib/utils/getNoNullParse';

const resetBtn = document.querySelector('button');

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
const imageSize = new kakao.maps.Size(64, 69);
const imageOption = { offset: new kakao.maps.Point(32, 69) };
const markerImage = new kakao.maps.MarkerImage(
   imageSrc,
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

   // function handleMarker() {
   //    console.log('click');
   //    // window.location.href = '/src/pages/place-detail/place-detail.html'; // 상세 페이지 URL로 변경
   // }
   // kakao.maps.event.addListener(marker, 'click', handleMarker);
   customOverlay.setMap(map);
}

/* -------------------- [ 지도 위치 초기화 버튼 ] -------------------- */
function handleReset(e) {
   e.preventDefault();
   map.setCenter(new kakao.maps.LatLng(defaultY, defaultX));
}

resetBtn.addEventListener('click', handleReset);
const placeDetail = document.querySelector('.info');
function handleDetail() {
   window.location.href = '/src/pages/place-detail/place-detail.html'; // 상세 페이지 URL로 변경
}
placeDetail.addEventListener('click', handleDetail);
