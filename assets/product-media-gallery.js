class InstanceSwiper extends HTMLElement {
  constructor() {
    super();
    this.handle = this.getAttribute('handle');
    this.debug = false;
    if (Shopify.designMode) {
      window.addEventListener('shopify:section:load', this.init.bind(this));
    }
    window.addEventListener('resize', this.init.bind(this));
  }

  static get observedAttributes() {
    return ['handle'];
  }

  init() {
    this.options = this.setOptions();
    this.instance = new Swiper('.swiper--' + this.handle, this.options);
    this.setInteractions();
  }

  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    if (this.instance && this.instance.destroy) this.instance.destroy();
  }

  /**
   * Options before initialization
   */
  setOptions() {
    if (this.debug) console.log('setOptions');
    this._options = this.getOptionsAsJsonScripts();
    return this._options;
  }

  getOptionsAsJsonScripts() {
    if (this.debug) console.log('getOptionsAsJsonScripts');
    const jsonScriptAutomated = this.querySelector(`script#swiper--${this.handle}--automated-options`);
    const jsonScriptOverwrite = this.querySelector(`script#swiper--${this.handle}--overwrite-options`);
    let options = {};
    if (jsonScriptAutomated && jsonScriptAutomated.textContent) {
      try {
        options = { ...options, ...JSON.parse(jsonScriptAutomated.textContent) };
      } catch (error) {
        console.error('Error parsing JSON', error, jsonScriptAutomated?.textContent);
      }
    }
    if (jsonScriptOverwrite && jsonScriptOverwrite.textContent) {
      try {
        options = { ...options, ...JSON.parse(jsonScriptOverwrite.textContent) };
      } catch (error) {
        console.error('Error parsing JSON', error, jsonScriptOverwrite?.textContent);
      }
    }
    return options;
  }

  /** thumbs instance should be mounted before this instance */
  getThumbsInstance() {
    if (!this.isThumbsActive) return;
    return document.querySelector(`[handle="${this.getAttribute('thumbs')}"]`)?.instance;
  }

  /**
   * Interaction after initialization
   */
  setInteractions() {
    if (this.debug) console.log('setInteractions');
  }
}
// customElements.define('instance-swiper', InstanceSwiper);
class InstanceSwiperProductThumbs extends InstanceSwiper {
  constructor() {
    super();
  }

  setOptions() {
    super.setOptions();
    this.setCenteredSlides();
    return this._options;
  }

  setCenteredSlides() {
    if (this.handle !== 'product-thumbs') return;
    if (this.debug) console.log('setCenteredSlides');

    const afterInit = (swiper) => {
      if (swiper.activeIndex !== 0) swiper.slideTo(0);
      if (this.debug) console.log('afterInit');
      const swiperWrapper = swiper.wrapperEl;
      const observer = new MutationObserver(resetSwiperWrapperTransform);
      observer.observe(swiperWrapper, { attributes: true });
      function resetSwiperWrapperTransform() {
        if (
          swiperWrapper.hasAttribute('style') &&
          swiperWrapper.style?.transform &&
          swiperWrapper.style?.transform !== 'translate3d(0px, 0px, 0px)'
        ) {
          swiperWrapper.style.transform = 'translate3d(0px, 0px, 0px)';
          if (this.debug) console.log('swipreWrapper observer removed styles!');
        } else if (
          swiperWrapper.hasAttribute('style') &&
          swiperWrapper.style?.transform &&
          swiperWrapper.style?.transform === 'translate3d(0px, 0px, 0px)'
        ) {
          setTimeout(() => {
            if (
              swiperWrapper.hasAttribute('style') &&
              swiperWrapper.style?.transform &&
              swiperWrapper.style?.transform === 'translate3d(0px, 0px, 0px)'
            ) {
              observer.disconnect();
              if (this.debug) console.log('swipreWrapper observer disconnect!');
            }
          }, 500);
        }
      }

      /**
       * Quick fix for thumbnails dislocationing issue
       * when thumbnails are less than the height of the wrapper
       */
      const calculateAllThumbHeight = (this.querySelector(".swiper-slide").clientHeight + 16) * this.querySelectorAll(".swiper-slide").length;
      const thumbsWrapper = this.parentElement;
      function setThumbsWrapperHeightToAuto() {
        if (thumbsWrapper.offsetHeight > calculateAllThumbHeight) {
          thumbsWrapper.style.height = (calculateAllThumbHeight - 16) + "px";
        } else {
          thumbsWrapper.removeAttribute("style");
        }
      }
      window.addEventListener("resize", setThumbsWrapperHeightToAuto);
      // have to wait global.js media area height css variables to be generated
      setTimeout(() => {
        setThumbsWrapperHeightToAuto();
      }, 2500);
    };

    this._options = {
      ...this._options,
      on: {
        ...(this._options.on || {}),
        afterInit: afterInit,
      },
    };
  }

}
if (!customElements.get('swiper-product-thumbs')) {
  customElements.define('swiper-product-thumbs', InstanceSwiperProductThumbs);
}
class InstanceSwiperProductGallery extends InstanceSwiper {
  constructor() {
    super();
    this.isThumbsActive = this.hasAttribute("thumbs");
    this.isZoomActive = this.hasAttribute("zoom");
  }

  static get observedAttributes() {
    return ["thumbs", "zoom"];
  }

  setOptions() {
    super.setOptions();
    this.setThumbOptions();
    return this._options;
  }

  setThumbOptions() {
    if (!this.isThumbsActive) return;
    if (this.debug) console.log("setThumbOptions");
    const thumbsInstance = super.getThumbsInstance();
    if (this.debug) console.log("thumbsInstance", thumbsInstance);
    this._options = {
      ...this._options,
      thumbs: {
        swiper: thumbsInstance
      }
    };
  }

  /**
   * Interaction after initialization
   */
  setInteractions() {
    this.setThumbsInteraction();
    if (this.isZoomActive) this.photoSwipeLightboxInit();
  }

  setThumbsInteraction() {
    if (!this.isThumbsActive || !this.instance) return;
    if (this.debug) console.log("setThumbsInteraction");
    const thumbsSwiper = this.options.thumbs.swiper;
    this.instance.on("slideChangeTransitionStart", function (swiper) {
      const activeIndex = swiper.activeIndex;
      const thumbsActiveIndex = thumbsSwiper.activeIndex;
      if (this.debug)
        console.log(
          "slideChangeTransitionStart",
          activeIndex,
          thumbsActiveIndex
        );
      if (activeIndex !== thumbsActiveIndex) {
        thumbsSwiper.slideTo(activeIndex);
      }
    });
  }

  photoSwipeLightboxInit() {
    const [
      zoomContainerWidth,
      zoomContainerHeight,
      closeIcon,
      prevIcon,
      nextIcon
    ] = [
      this.offsetWidth,
      this.offsetHeight,
      document.querySelector("[data-close-icon]"),
      document.querySelector("[data-prev-icon]"),
      document.querySelector("[data-next-icon]")
    ];

    function isPhone() {
      return window.innerWidth < 750;
    }

    const photoSwipeLightboxInstance = new PhotoSwipeLightbox({
      gallery: `.photoswipe-wrapper`,
      children: "a.product__gallery-toggle",
      mainClass: "pswp--product-media-gallery",

      loop: false,
      showHideAnimationType: "zoom",

      initialZoomLevel: zoomLevelObject => {
        if (isPhone()) {
          return zoomLevelObject.vFill;
        } else {
          return zoomLevelObject.fit;
        }
      },
      secondaryZoomLevel: zoomLevelObject => {
        if (isPhone()) {
          return zoomLevelObject.fit;
        } else {
          return 1;
        }
      },
      pswpModule: PhotoSwipe
    });
    photoSwipeLightboxInstance.addFilter(
      "uiElement",
      (element, data) => {
        if (data.name === "close") {
          element.innerHTML = closeIcon.innerHTML;
        } else if (data.name === "arrowPrev") {
          element.innerHTML = prevIcon.innerHTML;
        } else if (data.name === "arrowNext") {
          element.innerHTML = nextIcon.innerHTML;
        }
        return element;
      }
    );

    // html for video
    photoSwipeLightboxInstance.addFilter(
      "itemData",
      (itemData, index) => {
        if (itemData.type === "html" && itemData.element) {
          return {
            html: itemData.element.dataset.pswpHtml
          };
        }
        return itemData;
      }
    );

    photoSwipeLightboxInstance.init();

    photoSwipeLightboxInstance.on("beforeOpen", () => {
      document.body.classList.add("oveflow-hidden");
      const videos = this.querySelectorAll("video");
      Array.from(videos).forEach(video => {
        // if video is not playing, call playPromise
        // force to play
        video
          .play()
          .then(() => {
            // Automatic playback started!
            // Show playing UI.
            // video.play();
          })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
            video.pause();
          });
      });
    });

    photoSwipeLightboxInstance.on("closingAnimationStart", () => {
      document.body.classList.remove("oveflow-hidden");
    });
  }

  setActiveMedia(id) {
    const mediaFound = Array.from(
      this.querySelectorAll("[data-media-id]")
    ).find(media => Number(media.dataset.mediaId) === id);

    if (!mediaFound) return;

    if (this.instance && typeof this.instance.slideTo === 'function') {
      this.instance.slideTo(Number(mediaFound.dataset.index));
    }
  }
}
if (!customElements.get('swiper-product-gallery')) {
  customElements.define('swiper-product-gallery', InstanceSwiperProductGallery);
}


class ProductMediaInfo extends HTMLElement {
  constructor() {
    super();
    this.init();
    window.addEventListener("resize", this.init.bind(this));
    if (Shopify.designMode) {
      window.addEventListener("shopify:section:load", this.init.bind(this));
    }
  }

  init() {
    let containerOffsetWidth = document.querySelector('.main-product__media--slider').offsetWidth || 330;
    if (document.querySelector('.main-product__media--grid-item') && window.innerWidth > 750) {
      containerOffsetWidth = document.querySelector('.main-product__media--grid-item').offsetWidth;
    }
    const maxWidthForInfo = (containerOffsetWidth - 48) / 2;

    const mediaInfoTextWidth = this.querySelector('p:last-child').offsetWidth;
    const mediaInfoHidden = this.querySelector('p[aria-hidden]');

    if (mediaInfoTextWidth > maxWidthForInfo) {
      this.classList.remove('animation-stopped');
      this.style.cssText = `--marquee-speed: ${mediaInfoTextWidth / maxWidthForInfo * 8}s`;
      mediaInfoHidden.style.display = '';
    } else {
      this.classList.add('animation-stopped');
      this.style.cssText = '';
      mediaInfoHidden.style.display = 'none';
    }
  }
}

if (!customElements.get('product-media-info')) {
  customElements.define('product-media-info', ProductMediaInfo);
}


