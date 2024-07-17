import '/src/pages/review-create/img-content.scss';

import pb from '/src/lib/utils/pocketbase';

console.log(pb);

const formData = new FormData();

const fileInput = document.querySelector('.upload-button');
fileInput.addEventListener('change', function () {
   for (let file of fileInput.files) {
      console.log('file', file);
      const fd = formData.append('image', file);
      console.log('fd', fd);
   }
});
pb.collection('users').create(formData);

const textarea = document.querySelector('textarea');

const handleReview = (e) => {
   localStorage.setItem('review', e.target.value);
};

textarea.addEventListener('input', handleReview);
