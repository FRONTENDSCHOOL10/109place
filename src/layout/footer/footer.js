import css from '/src/layout/footer/footer.scss?inline';

export class Footer extends HTMLElement{
  
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <nav class="nav">
        <a href="/" class="nav__link">
          <span class="nav__icon fa-solid fa-location-dot"></span>
          <p class="nav__text">지도</p>
        </a>
        <a href="/" class="nav__link">
          <span class="nav__icon fa-solid fa-bookmark"></span>
          <p class="nav__text">저장</p>
        </a>
        <a href="/" class="nav__link">
          <span class="nav__icon fa-solid fa-user"></span>
          <p class="nav__text">MY</p>
        </a>
      </nav>
      `
  }
}

customElements.define('c-footer',Footer);