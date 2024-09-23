if (!customElements.get('trust-indicators-slider')) {
  class TrustIndicatorsSlider extends HTMLElement {
    constructor() {
      super();

      const swiperOptions = JSON.parse(this.getAttribute('data-swiper-options')) || {};

      this.initSlider(swiperOptions);
    }

    initSlider(swiperOptions) {
      this.slider = new Swiper(this, {
        slidesPerView: 1,

        pagination: {
          el: ".swiper-pagination"
        },

        autoplay: swiperOptions.autoplay || false,

        spaceBetween: swiperOptions.spaceBetweenMobile || 2,
        breakpoints: {
          750: {
            enabled: true,
            spaceBetween: swiperOptions.spaceBetweenDesktop || 2,
            slidesPerView: 3,
            loop: false
          },
          990: {
            enabled: true,
            spaceBetween: swiperOptions.spaceBetweenDesktop || 2,
            slidesPerView: swiperOptions.slidesPerView || 3,
            loop: false
          }
        }
      });
    }
  }

  customElements.define('trust-indicators-slider', TrustIndicatorsSlider);
}
