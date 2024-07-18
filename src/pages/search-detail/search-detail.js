/* eslint-disable no-undef */
import '/src/pages/search-detail/search-detail.scss';
import { getStorage } from 'kind-tiger';
import pb from '/src/lib/utils/pocketbase';

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
    <p class="info__name" aria-label="이 장소의 이름:${places.place_name}">${places.place_name}</p>
    ${places.category_group_name ? `<p class="info__category"  aria-label="이 장소의 카테고리:${places.category_group_name}">${places.category_group_name}</p>` : ''}</div>
    ${places.road_address_name ? `<p class="info__address" aria-label="이 장소의 주소 : ${places.road_address_name}">${places.road_address_name}</p>` : ''}
  </div>
`;
   infoPlace.className = 'item';
   infoPlace.innerHTML = itemStr;
   infoPlace.tabIndex = 0;

   infoPlace.addEventListener('click', () => {
      saveLocal(places);
      renderPlaceInfoAll();
   });
   infoPlace.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
         saveLocal(places);
         renderPlaceInfoAll();
      }
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
   // //  지번주소
   // const addressName = place.address_name;
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
   // localStorage.setItem('address_name', JSON.stringify(addressName));
   localStorage.setItem('coor_x', JSON.stringify(coordinateX));
   localStorage.setItem('coor_y', JSON.stringify(coordinateY));
   localStorage.setItem('phone', JSON.stringify(phone));
   localStorage.setItem('category', JSON.stringify(category));
}
function handleBack(e) {
   e.preventDefault();
   const removeKey = [
      'place_name',
      'road_address_name',
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

/* -------------------------------------------- */
/* -------------------------------------------- */
/* -------------------------------------------- */

// 전체 로직
async function renderPlaceInfoAll() {
   const searchData = await getLocalStorageData();
   let foundData = await matchLocalWithDB(searchData);
   const collectionId = foundData[0].id;
   localStorage.setItem('stores_id', JSON.stringify(collectionId));
   window.location.href = '/src/pages/review-create/date-place.html';
}

//로컬 스토리지에서 데이터 꺼내오기
async function getLocalStorageData() {
   const name = await getStorage('place_name');
   const address = await getStorage('road_address_name');
   console.log(name);
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
   console.log(adderess)

   await pb.collection('stores').create(data);
}
