import css from '/src/layout/footer/footer.scss?inline';

export class Footer extends HTMLElement{
  
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <nav class="nav">
        <a href="/" class="nav__link">
          <svg class="nav__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.9571 3.63733L3.9571 7.91511C3.36259 8.27842 3 8.92494 3 9.62167V19.5C3 20.6046 3.89543 21.5 5 21.5H7.66667C8.40305 21.5 9 20.903 9 20.1667V16.5C9 14.8431 10.3431 13.5 12 13.5C13.6569 13.5 15 14.8431 15 16.5V20.1667C15 20.903 15.597 21.5 16.3333 21.5H19C20.1046 21.5 21 20.6046 21 19.5V9.62167C21 8.92494 20.6374 8.27842 20.0429 7.91511L13.0429 3.63733C12.4027 3.24608 11.5973 3.24608 10.9571 3.63733Z" stroke="#8E8E8E" stroke-width="1.5"></path>
          </svg>
          <span class="nav__text">홈</span>
        </a>
        <a href="/" class="nav__link">
          <svg class="nav__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
          <p class="nav__text">저장</p>
        </a>
        <a href="/" class="nav__link">
        <svg class="nav__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="5.25" stroke="#8E8E8E" stroke-width="1.5"></circle>
          <path d="M20 21.5C20 17.0817 16.4183 13.5 12 13.5C7.58172 13.5 4 17.0817 4 21.5" stroke="#8E8E8E" stroke-width="1.5" stroke-linecap="round"></path>
        </svg>
          <p class="nav__text">MY</p>
        </a>
      </nav>
      `
  }
}

customElements.define('c-footer',Footer);