import '/src/pages/review-create/tag-select.scss';
import { getNode } from 'kind-tiger';

const btnNext = getNode('.btn__next');
const reviewTags = document.querySelectorAll('.review__tag--input');

const shopName = document.querySelector('.shop-name');

const place_name = localStorage.getItem('place_name');

shopName.innerText = place_name;

const handleBtnNext = () => {
   location.href = '/src/pages/review-create/img-content.html';
};

const handleReviewTag = (e) => {
   localStorage.setItem(e.target.name, e.target.value);
};

btnNext.addEventListener('click', handleBtnNext);

reviewTags.forEach((reviewTag) => {
   reviewTag.addEventListener('input', handleReviewTag);
});
