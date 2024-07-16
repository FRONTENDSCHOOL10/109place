/* eslint-disable no-undef */

import '/src/pages/home-search/home-search.scss';
/* -------------------------------------------- */

// 1. 누른 곳 좌표 나와야됨
// 2. 그 좌표 가지고 홈페이지에서 마커 표시
// 3. 홈페이지 -> 로컬 스토리지에 있는 home_search_x, home_search_y 이용해서 포커스 이동, 거기에 마커 표시!

/* -------------------------------------------- */

// 검색 객체
const searchPlace = new kakao.maps.services.Places();
// 검색 버튼
const searchBtn = document.querySelector('#searchForm');
// 뒤로가기 버튼
const backBtn = document.querySelector('.header__back');

function handleSearch(e) {
   e.preventDefault();
   searchPlaces();
}

function searchPlaces() {
   var keyword = document.getElementById('searchInput').value;
   searchPlace.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status) {
   if (status === kakao.maps.services.Status.OK) {
      // data 안에 뭐 들었는지 확인하려고
      // console.log(data);
      displayPlaces(data);
   } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('🔍 검색 결과가 존재하지 않습니다.');
      return;
   } else if (status === kakao.maps.services.Status.ERROR) {
      alert('❗️ 검색 결과 중 오류가 발생했습니다.');
      return;
   }
}

function displayPlaces(places) {
   let lisePlace = document.getElementById('placesList');
   let fragment = document.createDocumentFragment();

   removeAllChild(lisePlace);
   for (let i = 0; i < places.length; i++) {
      let itemEl = getListItem(i, places[i]);
      fragment.appendChild(itemEl);
   }

   lisePlace.appendChild(fragment);
}

function getListItem(index, places) {
   let infoPlace = document.createElement('li');
   let itemStr = `
  <div class="info">
  <div class="info__container">
    <p class="info__name">${places.place_name}</p>
    ${places.category_group_name ? `<p class="info__category">${places.category_group_name}</p>` : ''}</div>
    ${places.road_address_name ? `<p class="info__address">${places.road_address_name}</p>` : ''}
  </div>
`;
   infoPlace.className = 'item';
   infoPlace.innerHTML = itemStr;

   infoPlace.addEventListener('click', () => {
      saveLocal(places);
   });
   return infoPlace;
}

function removeAllChild(infoPlace) {
   while (infoPlace.hasChildNodes()) {
      infoPlace.removeChild(infoPlace.lastChild);
   }
}
function saveLocal(place) {
   // 장소이름
   const placeName = place.place_name;
   //  도로명주소
   const roadAddressName = place.road_address_name;
   //  지번주소
   const addressName = place.address_name;
   // x 좌표
   const coordinateX = place.x;
   //  y 좌표
   const coordinateY = place.y;
   //  전화번호
   const phone = place.phone;
   // 카테고리
   const category = place.category_group_name;
   localStorage.setItem('place_name', JSON.stringify(placeName));
   localStorage.setItem('road_address_name', JSON.stringify(roadAddressName));
   localStorage.setItem('address_name', JSON.stringify(addressName));
   localStorage.setItem('coor_x', JSON.stringify(coordinateX));
   localStorage.setItem('coor_y', JSON.stringify(coordinateY));
   localStorage.setItem('phone', JSON.stringify(phone));
   localStorage.setItem('category', JSON.stringify(category));
   window.location.href = '/src/pages/review-create/date-place.html';
}
function handleBack(e) {
   e.preventDefault();
   const removeKey = [
      'place_name',
      'road_address_name',
      'address_name',
      'coor_x',
      'coor_y',
      'phone',
      'category',
   ];
   removeKey.forEach((key) => localStorage.removeItem(key));

   window.location.href = '/src/pages/review-search/review-search.html';
}
searchBtn.addEventListener('submit', handleSearch);
backBtn.addEventListener('click', handleBack);
