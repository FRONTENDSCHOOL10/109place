import '/src/pages/review-create/tag-select.scss';

import { getNode } from 'kind-tiger';

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
