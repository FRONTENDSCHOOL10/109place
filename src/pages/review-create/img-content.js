import '/src/pages/review-create/img-content.scss';
import pb from '/src/lib/utils/pocketbase';

const image = new FormData();

const textarea = document.querySelector('textarea');
const fileInput = document.querySelector('.upload-button');

const handleReview = (e) => {
   console.log(e.target.value);
   localStorage.setItem('review', e.target.value);
};

fileInput.addEventListener('change', function () {
   for (let file of fileInput.files) {
      image.append('image', file);
   }
});

image.append('title', 'Hello world!');

// // set some other regular text field value
// formData.append('title', 'Hello world!');

await pb.collection('review').create(image);

textarea.addEventListener('input', handleReview);
// imageUpload.addEventListener('change', handleImg);
