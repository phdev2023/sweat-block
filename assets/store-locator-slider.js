if (!customElements.get("store-locator-slider")) {
  class StoreLocatorSlider extends HTMLElement {
    constructor() {
      super();
      if (Shopify.designMode) {
        window.addEventListener(
          "shopify:section:load",
          this.init.bind(this)
        );
      }
    }

    connectedCallback() {
      this.init();
    }

    init() {
      this.slider = new Swiper(this, {
        slidesPerView: 1,
        navigation: {
          nextEl: `.swiper-button--next-${this.dataset.sectionId}`,
          prevEl: `.swiper-button--prev-${this.dataset.sectionId}`
        },
        spaceBetween: parseInt(this.dataset.spaceBetween) || 12,
        breakpoints: {
          1200: {
            slidesPerView: (parseInt(this.dataset.slidesPerView) * 1.02) || 2
          },
          750: {
            slidesPerView: 2
          },
          360: {
            slidesPerView: 1.08
          }
        }
      });
    }
  }

  customElements.define("store-locator-slider", StoreLocatorSlider);
}
