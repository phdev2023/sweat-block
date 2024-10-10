if (!customElements.get("card-slider")) {
  class CardSlider extends HTMLElement {
    constructor() {
      super();

      const swiperOptions = JSON.parse(this.getAttribute("data-swiper-options")) || {};

      document.addEventListener("DOMContentLoaded", () => {
        this.initSlider(swiperOptions); // Initialize as soon as DOM is ready
      });

      if (this.classList.contains("js-testimonials")) {
        const initOrUpdateSlider = () => {
          const isMobile = window.innerWidth < mobileWidth;
          const isSlideEffect = this.slider && this.slider.params.effect === "slide";

          if ((isMobile && !isSlideEffect) || (!isMobile && isSlideEffect)) {
            this.reInitSlider(swiperOptions);
          }
        };

        initOrUpdateSlider();
        window.addEventListener("resize", initOrUpdateSlider);
      }

      window.addEventListener("resize", () => {
        if (swiperOptions.disabledOnMobile && window.innerWidth < mobileWidth) {
          if (this.slider) {
            this.slider.destroy();
          }
        } else if (!this.slider) {
          this.initSlider(swiperOptions);
        }
      });
    }

    reInitSlider(swiperOptions) {
      this.slider.destroy();
      this.initSlider(swiperOptions);
    }

    initSlider(swiperOptions) {
      const progressCircle = document.querySelector(
        `.autoplay-progress--${swiperOptions.sectionId} svg`
      );
      const progressContent = document.querySelector(
        `.autoplay-progress--${swiperOptions.sectionId} span`
      );

      if (swiperOptions.disabledOnMobile && window.innerWidth < mobileWidth) {
        return;
      }

      if (swiperOptions.pagination == "render_bullet") {
        swiperOptions.pagination = {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet: function (i, className) {
            return `<button class="${className}"><span>${i + 1}</span></button>`;
          }
        };
      }

      // Adjust other settings as per your need
      let sliderOptions = {
        slidesPerView: swiperOptions.slidesPerView || 1.1,
        spaceBetween: swiperOptions.spaceBetweenMobile || 16,
        resistanceRatio: 0.72,
        preloadImages: true, // Preload all images before swipe
        watchSlidesProgress: true, // Track progress of all slides
        autoplay: swiperOptions.autoplay || {
          delay: 5000,
          disableOnInteraction: false,
          startOnLoad: true, // Ensure autoplay starts on load
        },
        navigation: swiperOptions.navigation || { nextEl: ".swiper-button--next", prevEl: ".swiper-button--prev" },
        breakpoints: {
          480: {
            slidesPerView: "auto",
            spaceBetween: swiperOptions.spaceBetweenMobile || 2,
          },
          750: {
            slidesPerView: swiperOptions.slidesPerViewDesktop || 3,
            spaceBetween: swiperOptions.spaceBetweenDesktop || 16,
          },
        },
      };

      this.slider = new Swiper(this, sliderOptions);
    }
  }

  customElements.define("card-slider", CardSlider);
}
