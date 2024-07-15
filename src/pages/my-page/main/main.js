const myPageSection = document.querySelector('.my-page__section');
const myPageHeader = document.querySelector('.my-page__header');
const myPageFooter = document.querySelector('.my-page__footer');
const reviewContainer = document.querySelector('.review--container');
const footerButtonTop = document.querySelector('.footer--button-top');

const scrollHandler = () => {
   if (reviewContainer.scrollTop > 0) {
      myPageHeader.classList.add('hidden');
      myPageFooter.classList.add('hidden');
      reviewContainer.style.height = `40.5rem`;
      footerButtonTop.classList.remove('hidden');
   } else {
      myPageHeader.classList.remove('hidden');
      reviewContainer.style.height = `15.125rem`;
      myPageFooter.classList.remove('hidden');
      footerButtonTop.classList.add('hidden');
   }
};

const clickTopMoveHandler = () => {
   reviewContainer.scrollTo({
      top: 1,
      behavior: 'smooth',
   });
};

reviewContainer.addEventListener('scroll', scrollHandler);

footerButtonTop.addEventListener('click', clickTopMoveHandler);
