if (!customElements.get("card-slider")) {
  class CardSlider extends HTMLElement {
    constructor() {
      super();

      const swiperOptions = JSON.parse(this.getAttribute("data-swiper-options")) || {};

      window.addEventListener("shopify:section:load", () => {
        this.initSlider(swiperOptions);
      });

      this.initSlider(swiperOptions);

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
      } else if (swiperOptions.pagination == "progressbar") {
        swiperOptions.pagination = {
          el: ".swiper-pagination",
          type: "progressbar"
        };
      } else if (swiperOptions.pagination == "bullets") {
        swiperOptions.pagination = {
          el: ".swiper-pagination",
          clickable: true
        };
      } else {
        swiperOptions.pagination = false;
      }

      if (swiperOptions.loop && swiperOptions.slideCount < 2) {
        swiperOptions.loop = false;
      }

      let sliderOptions = {
        slidesPerView: swiperOptions.slidesPerView || 1.1,
        spaceBetween: swiperOptions.spaceBetweenMobile || 16,
        resistanceRatio: 0.72,
        navigation: swiperOptions.navigation || { nextEl: ".swiper-button--next", prevEl: ".swiper-button--prev" },
        breakpoints: {
          600: {
            slidesPerView: 1, // 1 slide when width is less than 600px
            spaceBetween: swiperOptions.spaceBetweenMobile || 10
          },
          991: {
            slidesPerView: 2, // 2 slides when width is less than 991px
            spaceBetween: swiperOptions.spaceBetweenMobile || 16
          },
          1200: {
            slidesPerView: swiperOptions.slidesPerViewDesktop || 3, // More slides for larger screens
            spaceBetween: swiperOptions.spaceBetweenDesktop || 24
          }
        }
      };

      this.slider = new Swiper(this, sliderOptions);
    }
  }

  customElements.define("card-slider", CardSlider);
}
