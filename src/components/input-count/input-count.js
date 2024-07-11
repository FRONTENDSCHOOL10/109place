import '/src/components/input-count/input-count.scss';

function handleCount() {
   let textLength = this.value.length;

   if (textLength > 400) {
      this.value = this.value.substring(0, 400);
      textLength = 400;
   }
   textCount.textContent = `${textLength}/400`;
}

const textArea = document.querySelector('.input-count__input');
const textCount = document.querySelector('.input-count__count');

textArea.addEventListener('input', handleCount);
