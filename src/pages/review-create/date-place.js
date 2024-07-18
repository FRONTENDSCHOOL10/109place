/* eslint-disable no-undef */
import '/src/pages/review-create/date-place.scss';

//지도 api

const address = localStorage.getItem('home_address_name');

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
   mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
   };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
geocoder.addressSearch(address, function (result, status) {
   // 정상적으로 검색이 완료됐으면
   if (status === kakao.maps.services.Status.OK) {
      var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      // 결과값으로 받은 위치를 마커로 표시합니다
      var marker = new kakao.maps.Marker({
         map: map,
         position: coords,
      });

      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
   }
});

const datePicker = document.querySelector('.date-picker');
const dateInput = document.querySelector('.date-input--off');
const btnNext = document.querySelector('.btn__next');
const date = document.querySelector('#date-input');
const shopName = document.querySelector('.shop-name');

const place_name = localStorage.getItem('home_place_name');

shopName.innerText = place_name;

const handleDatePicker = () => {
   dateInput.classList.add('date-input--on');
   datePicker.classList.add('date-label--off');
   datePicker.innerText = '';
};

const handleDate = (e) => {
   date.value = e.target.value;
   localStorage.setItem('date', date.value);
};

const handleBtnNext = () => {
   location.href = '/src/pages/review-create/tag-select.html';
};

datePicker.addEventListener('click', handleDatePicker);
date.addEventListener('input', handleDate);
btnNext.addEventListener('click', handleBtnNext);
