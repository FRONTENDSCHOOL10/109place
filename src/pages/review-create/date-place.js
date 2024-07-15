/* eslint-disable no-undef */
import '/src/pages/review-create/date-place.scss';

// 지도 api
let container = document.getElementById('map');
let options = {
   // 앞 페이지에서 선택한 장소 lat,lng 넣어주기
   center: new kakao.maps.LatLng(33.450701, 126.570667),
   level: 3,
};

let map = new kakao.maps.Map(container, options);

const goBack = document.querySelector('.go-back');
const exit = document.querySelector('.right-exit');
const datePicker = document.querySelector('.date-picker');
const dateInput = document.querySelector('.date-input--off');
const btnNext = document.querySelector('.btn__next');
const date = document.querySelector('#date-input');

const handleGoBack = () => {
   location.href = '/src/pages/search-detail/search-detail.html';
};

const handleExit = () => {
   location.href = '/src/pages/homepage/homepage.html';
};

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

goBack.addEventListener('click', handleGoBack);
exit.addEventListener('click', handleExit);
datePicker.addEventListener('click', handleDatePicker);
date.addEventListener('input', handleDate);
btnNext.addEventListener('click', handleBtnNext);
