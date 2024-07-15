import '/src/pages/review-create/tag-select.scss';
import { getNode } from 'kind-tiger';

//체크박스 2개 제한
const limitedCheckbox = (cls) => {
   let checkboxes = document.querySelectorAll(`.${cls}`);

   checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
         let checkedCount = Array.from(checkboxes).filter(
            (i) => i.checked
         ).length;

         if (checkedCount > 2) {
            this.checked = false;
         }
      });
   });
};
limitedCheckbox('limited-checkbox');
limitedCheckbox('limited-checkbox2');

const exit = getNode('.right-exit');
const btnNext = getNode('.btn__next');

const handleExit = () => {
   location.href = '/src/pages/homepage/homepage.html';
};
const handleBtnNext = () => {
   location.href = '/src/pages/review-create/img-content.html';
};

exit.addEventListener('click', handleExit);
btnNext.addEventListener('click', handleBtnNext);
