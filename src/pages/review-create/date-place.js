import '/src/pages/review-create/date-place.scss';

const goBack = document.querySelector('.go-back');
const exit = document.querySelector('.right-exit');
const datePicker = document.querySelector('.date-picker');
const dateInput = document.querySelector('.date-input--off');

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

goBack.addEventListener('click', handleGoBack);
exit.addEventListener('click', handleExit);
datePicker.addEventListener('click', handleDatePicker);
