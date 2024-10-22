import css from '/src/layout/footer/footer.scss?inline';

export class Footer extends HTMLElement{
  
  constructor(){
    super();
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML = `
      <style>${css}</style>

      <nav class="nav">
        <a href="/src/pages/homepage/homepage.html" class="nav__link">
          <svg role="img" aria-label="홈 이미지" class="nav__icon nav__home">
            <use href="/src/assets/stack.svg#icon_navigation_home_before" />
          </svg>
          <p class="nav__text">홈</p>
        </a>
        <a href="/src/pages/saved-places/saved-places.html" class="nav__link">
          <svg role="img" aria-label="저장 이미지" class="nav__icon nav__bookmark">
            <use href="/src/assets/stack.svg#icon_navigation_bookmark_before" />
          </svg>
          <p class="nav__text">저장</p>
        </a>
        <a href="/src/pages/my-page/main/main.html" class="nav__link">
          <svg role="img" aria-label="마이 페이지 이미지" class="nav__icon nav__profile">
            <use href="/src/assets/stack.svg#icon_navigation_profile_before"/>
          </svg>
          <p class="nav__text">MY</p>
        </a>
      </nav>
      `

      this.activeLink();
  }


  activeLink(){
    const links = this.shadowRoot.querySelectorAll('.nav__link');
    const activeLink = window.location.pathname;

    links.forEach(link => {
      if(link.getAttribute('href') === activeLink){
        link.classList.add('active');
      }
    });
  }

}

customElements.define('c-footer',Footer);