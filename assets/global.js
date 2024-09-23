/* Release Theme - v1.0.6 */

const body = document.querySelector("body");
const main = document.querySelector("main");

let header = document.querySelector(
  "#header, #shopify-section-main-password-header"
);
let announcementBar = document.querySelector(".js-announcement-bar");

let heroBanner = document.querySelector(".hero-banner");

let productMedia = document.querySelector(".main-product__media"); // on pdp
let productMediaSwiper = document.querySelector(
  ".main-product__media .swiper--product-gallery"
); // on pdp

let productCardMedia = document.querySelector(".product-card__media");
let productCardCollections = document.querySelector(".product-card");

const mobileWidth = 750;
const tabletWidth = 990;
const windowDynamicEvents = ["scroll", "resize"];

// define desktop, tablet, mobile
const isDesktop = window.innerWidth > tabletWidth;
const isTablet = window.innerWidth <= tabletWidth && window.innerWidth >= mobileWidth;
const isMobile = window.innerWidth < mobileWidth;

document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(img => {
    img.addEventListener("load", function () {
      handleLazyLoadedImage(img);
    });
    if (img.complete) {
      handleLazyLoadedImage(img);
    }
  });

  function handleLazyLoadedImage(img) {
    if (!img || !img.hasAttribute("loading") || img.hasAttribute("data-smooth-lazy-disabled") || img.classList.contains("smooth-lazy-disabled")) { return; }
    const transitionDuration = 300;
    // first add opacity manually and start transition
    img.style.cssText = `opacity: 1; transition: opacity ${transitionDuration}ms ease-in-out !important;`;
    // timeout: waiting for opacity transition to finish
    setTimeout(() => {
      // then remove attributes
      img.removeAttribute("loading");
      img.removeAttribute("style");
    }, transitionDuration);
  }

  // Set observer to catch dynamicly added images with lazy loading
  function mutationCallbackForLazyLoadedImage(mutationList, observer) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            if (node.querySelector('img[loading="lazy"]')) {
              node.querySelectorAll('img[loading="lazy"]').forEach(img => {
                handleLazyLoadedImage(img);
              })
            }
          }
        })
      }
    }
  };

  const observer = new MutationObserver(mutationCallbackForLazyLoadedImage);
  observer.observe(
    document.querySelector("body"),
    { childList: true, subtree: true }
  );
  // observer.disconnect();

});

/* this script is breaking responsivity and demo store - rethink it
// maybe we can add an option to activate this script

// is mobile is true, remove all elements has class 'small-hide'
if (window.innerWidth <= mobileWidth) {
  document.querySelectorAll('.small-hide').forEach(function (el) {
    el.remove();
  });
} else {
  document.querySelectorAll('.small-up-hide').forEach(function (el) {
    el.remove();
  });
}
*/

// add loading lazy attribute to div.hero__inner > div.media > video > img
document
  .querySelectorAll(".hero__inner > .media > video > img")
  .forEach(function (el) {
    el.setAttribute("loading", "lazy");
    el.setAttribute("alt", "Video Cover");
  });

// catch all images with class 'lazyload' and add loading lazy attribute
document.querySelectorAll(".lazyload").forEach(function (el) {
  el.setAttribute("loading", "lazy");
});

windowDynamicEvents.forEach(eventType => {
  window.addEventListener(eventType, () => {
    setRootCustomProperties();
  });
});

setRootCustomProperties();

window.addEventListener("shopify:section:load", function () {
  header = document.querySelector(
    "#header, #shopify-section-main-password-header header"
  );
  announcementBar = document.querySelector(".js-announcement-bar");
  productCardMedia = document.querySelector(".product-card__media");
});

function getCoordinates(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX
  };
}

function setRootCustomProperties() {
  const setCustomProperty = (property, value) => {
    document.documentElement.style.setProperty(property, value);
  };

  // header height
  if (header) {
    let headerHeight = header.getBoundingClientRect().height.toFixed(2);
    setCustomProperty("--header-height",`${parseFloat(headerHeight)}px`);
  } else {
    setCustomProperty("--header-height", `0px`);
  }

  // announcement bar top
  if (announcementBar) {
    let announcementBarTop = Math.max(0, announcementBar.getBoundingClientRect().y + announcementBar.offsetHeight);
    setCustomProperty("--announcement-bar-top",`${parseFloat(announcementBarTop)}px`);
    setCustomProperty("--announcement-bar-height",`${parseFloat(announcementBar.offsetHeight)}px`);
  } else {
    setCustomProperty("--announcement-bar-top", `0px`);
    setCustomProperty("--announcement-bar-height", `0px`);
  }

  let cartDrawerBody = document.querySelector(".cart-drawer__body");
  if (cartDrawerBody) {
    setCustomProperty("--cart-drawer-body-width", `${parseFloat(cartDrawerBody.offsetWidth)}px`);
    setCustomProperty("--cart-drawer-body-height", `${parseFloat(cartDrawerBody.offsetHeight)}px`);
  }

  // product media width
  if (productMedia) {
    setCustomProperty("--product-media-area-width", `${parseFloat(productMedia.offsetWidth)}px`);
  }

  // set initial product media area height - start
  function setInitalProductMediaAreaHeight() {
    if (productMedia && body.classList.contains("template--product")) {
      let initialProductMediaAreaHeight = 0;
      const mainTop = getCoordinates(main).top;
      const productMediaTop = getCoordinates(productMedia).top;
      const productTopbar = document.querySelector('.product__topbar-nav');
      let productTopbarHeight = 0;
      if (productTopbar) productTopbarHeight = productTopbar.offsetHeight;
      initialProductMediaAreaHeight = window.innerHeight - Math.round(mainTop) - 2 * Math.round(productMediaTop - mainTop) + Math.round(productTopbarHeight);

      // check if any section exists before product section
      const productSectionIndex = Array.prototype.indexOf.call(main.children, document.querySelector('main section.main-product'));
      if (productSectionIndex > 0) {
        initialProductMediaAreaHeight = window.innerHeight - Math.round(mainTop) - 2 * Math.round(productMediaTop - mainTop) + Math.round(productTopbarHeight);
      }

      initialProductMediaAreaHeight = Math.round(initialProductMediaAreaHeight - 24);

      // set initial product media area height
      setCustomProperty("--product-media-area-height", initialProductMediaAreaHeight + "px");
    }
  }
  function setInitalProductMediaSwiperAreaHeight() {
    const sliderWrapper = document.querySelector('.main-product__media--slider-wrapper');
    if (!sliderWrapper) return;
    setCustomProperty(
      "--product-media-area-swiper-height",
      `${parseInt(sliderWrapper.offsetHeight)}px`
    );
  }
  document.addEventListener("DOMContentLoaded", setInitalProductMediaAreaHeight);
  window.addEventListener("resize", setInitalProductMediaAreaHeight);

  document.addEventListener("DOMContentLoaded", setInitalProductMediaSwiperAreaHeight);
  window.addEventListener("resize", setInitalProductMediaSwiperAreaHeight);
  if (Shopify.designMode) {
    // window.addEventListener('shopify:section:load', setInitalProductMediaAreaHeight);
    window.addEventListener('shopify:section:load', setInitalProductMediaSwiperAreaHeight);
  }
  // set initial product media area height - end

  if (main) {
    setCustomProperty("--main-top", `${parseFloat(getCoordinates(main).top)}px`);
  }

  if (heroBanner) {
    setCustomProperty("--hero-banner-top", `${parseFloat(getCoordinates(heroBanner).top)}px`);
    setCustomProperty("--hero-banner-bottom", `${parseFloat(getCoordinates(heroBanner).bottom)}px`);
  }


  const articleHeroMedia = document.querySelector(".js-article-hero-media");
  const articleContent = document.querySelector(".js-article-content");
  if (articleHeroMedia || articleContent) {
    // set social share sticky position according to article hero media or article content
    let socialShareStickyTop = 0;
    let socialShareStickyStart = 0;
    let headerBottom = parseInt(header.getBoundingClientRect().bottom);
    if (articleHeroMedia) {
      socialShareStickyTop = parseInt(articleHeroMedia.getBoundingClientRect().top);
      socialShareStickyStart = parseInt(articleHeroMedia.getBoundingClientRect().right);
    } else {
      socialShareStickyTop = parseInt(articleContent.getBoundingClientRect().y);
      socialShareStickyStart = parseInt(articleContent.getBoundingClientRect().right);
    }

    if (socialShareStickyTop < (0 + headerBottom)) {
      socialShareStickyTop = headerBottom;
    }

    setCustomProperty(
      "--social-share-sticky-top",
      `${socialShareStickyTop}px`
    );
    setCustomProperty(
      "--social-share-sticky-start",
      `${socialShareStickyStart}px`
    );

  }

  // transparent header menu color
  // get data-header-menu-text-color of first .hero__inner under .hero-banner element
  if (heroBanner) {
    let heroInner = heroBanner.querySelectorAll(".hero__inner");
    if (heroInner.length > 0) {
      let heroInnerFirst = heroInner[0];
      let headerMenuTextColor = heroInnerFirst.getAttribute("data-header-menu-text-color");
      if (headerMenuTextColor) {
        setCustomProperty(
          "--transparent-header-menu-text-color", `${headerMenuTextColor}`
        );
      }
    }
  } else {
    setCustomProperty(
      "--transparent-header-menu-text-color", `var(--color-background)`
    );
  }

  /* Collection Page - Start */
  /* CHECK and if not needed, remove it */
  /*
  const collectionProductCard = document.querySelector(".js-collection-grid .product-card");
  console.log(collectionProductCard);
  if (collectionProductCard) {
    const collectionProductCardHeight = collectionProductCard.offsetHeight;
    console.log(collectionProductCardHeight);
    const collectionProductCardMediaHeight = collectionProductCard.querySelector(".product-card__media").offsetHeight;
    const collectionProductCardContentHeight = collectionProductCardHeight - collectionProductCardMediaHeight;
    setCustomProperty("--collection-product-card-height", `${collectionProductCardHeight}px`);
    setCustomProperty("--collection-product-card-content-height", `${collectionProductCardContentHeight}px`);
  }
    */
  /* Collection Page - End */

  if (productCardMedia) {
    setCustomProperty(
      "--product-card-media-height",
      `${parseInt(productCardMedia.offsetHeight)}px`
    );
  }

  // scroll-position
  function scrollPositionY() {
    setCustomProperty("--window-scroll-y-position", window.scrollY);
    if (window.scrollY === 0) {
      document.body.classList.add('scroll-y-0');
    } else {
      document.body.classList.remove("scroll-y-0");
    }
  }
  scrollPositionY();
  window.addEventListener("scroll", scrollPositionY);
}

// header: transparent and/or sticky
const isHeaderTransparent = header?.classList.contains("is-transparent");
const isHeaderSticky = header?.classList.contains("is-sticky");

const isCollectionPage = document.querySelector(
  ".template--collection"
);

// if header is transparent, remove is-transparent class if there is a section-page-banner or section-collection-banner
if (isHeaderTransparent) {
  const sectionPageBanner = document.querySelector(".section-page-banner");
  if (sectionPageBanner) {
    const sectionPageBannerIndex = Array.prototype.indexOf.call(main.children, sectionPageBanner);
    const sectionPageBannerMedia = sectionPageBanner?.querySelector(".media");
    if (sectionPageBanner && sectionPageBannerIndex === 0 && !sectionPageBannerMedia) {
      header.classList.remove("is-transparent");
    }

    /* CHECK and if not needed, remove it *
    const sectionPageBannerContent = sectionPageBanner?.querySelector(".content");
    if (sectionPageBannerContent) {
      sectionPageBanner.style.paddingBlockStart = `calc(${parseInt(header.offsetHeight)}px + 1.2rem)`;
    }
    */
  }

  const sectionCollectionBanner = document.querySelector(".section-collection-banner");
  if (sectionCollectionBanner) {
    const sectionCollectionBannerIndex = Array.prototype.indexOf.call(main.children, sectionCollectionBanner);
    if (sectionCollectionBannerIndex === 0) {
      const sectionCollectionBannerMedia = sectionCollectionBanner?.querySelector(".media");
      if (sectionCollectionBannerIndex === 0 && !sectionCollectionBannerMedia) {
        header.classList.remove("is-transparent");
      }

      /* CHECK and if not needed, remove it *
      const sectionCollectionBannerContent = sectionCollectionBanner?.querySelector(".content");
      if (sectionCollectionBannerContent) {
        sectionCollectionBanner.style.paddingBlockStart = `calc(${parseInt(header.offsetHeight)}px + 1.2rem)`;
      }
      */
    }
  }
}

// if announcement bar exists and is coming after from header
const isAnnouncementBarAfterHeader =
  announcementBar?.parentElement?.previousElementSibling?.classList.contains(
    "section--header"
  );

if (isAnnouncementBarAfterHeader && isHeaderTransparent) {
  let main = document.querySelector("main");
  if (main) {
    let announcementBarTop = Math.max(
      0,
      announcementBar.getBoundingClientRect().y +
        announcementBar.offsetHeight
    );
    if (isMobile) {
      main.style.marginTop = `-${parseInt(announcementBarTop)}px`;
    } else {
      main.style.marginTop = `-${parseInt(
        announcementBar.offsetHeight
      )}px`;
    }
  }
}

const bodyScroll = {
  lock(container) {
    bodyScrollLock.disableBodyScroll(container);
  },
  unlock(container) {
    bodyScrollLock.enableBodyScroll(container);
  },
  clear() {
    bodyScrollLock.clearAllBodyScrollLocks();
  }
};

const onKeyUpEscape = event => {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus({
    preventScroll: true
  });
};

const getFocusableElements = container => {
  return Array.from(
    container.querySelectorAll(
      'summary, a[href], button:enabled, [tabindex]:not([tabindex^="-"]), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe'
    )
  );
};

document
  .querySelectorAll('[id^="Details-"] summary')
  .forEach(summary => {
    summary.setAttribute("role", "button");
    summary.setAttribute(
      "aria-expanded",
      summary.parentNode.hasAttribute("open")
    );

    if (summary.nextElementSibling.getAttribute("id")) {
      summary.setAttribute(
        "aria-controls",
        summary.nextElementSibling.id
      );
    }

    summary.addEventListener("click", event => {
      event.currentTarget.setAttribute(
        "aria-expanded",
        !event.currentTarget.closest("details").hasAttribute("open")
      );
    });

    if (summary.closest("header-drawer")) return;
    summary.parentElement.addEventListener("keyup", onKeyUpEscape);
  });

const trapFocusHandlers = {};

const removeTrapFocus = (elementToFocus = null) => {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener(
    "focusout",
    trapFocusHandlers.focusout
  );
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus)
    elementToFocus.focus({
      preventScroll: true
    });
};

const trapFocus = (container, elementToFocus = container) => {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = event => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener(
      "keydown",
      trapFocusHandlers.keydown
    );
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
};

const serializeForm = form => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

const handleize = str => str.replace(/[ /_]/g, "-").toLowerCase();

const decode = str => decodeURIComponent(str).replace(/\+/g, " ");

const getOffsetTop = element => {
  let offsetTop = 0;

  do {
    if (!isNaN(element.offsetTop)) {
      offsetTop += element.offsetTop;
    }
  } while ((element = element.offsetParent));

  return offsetTop;
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.details = this.querySelector("details");
    this.summary = this.querySelector("summary");
    this.drawer = this.querySelector(".js-drawer");
    this.btnsCloseDrawer = this.querySelectorAll(
      ".js-btn-close-drawer"
    );
    this.btnsCloseDrawer = [...this.btnsCloseDrawer].filter(
      btnCloseDrawer =>
        this.drawer === btnCloseDrawer.closest(".js-drawer")
    );
    this.elementToFocus =
      this.querySelector(".js-drawer-focus-element") ||
      this.btnsCloseDrawer[0];
    this.toggleButtons = [this.summary, ...this.btnsCloseDrawer];
    this.isParentDrawerOpen = false;
    this.predictiveSearch = this.querySelector("predictive-search");

    this.HeaderDrawer = document.querySelector("header-drawer");

    this.setInitialAccessibilityAttr();

    this.toggleButtons.forEach(toggleButton => {
      toggleButton.addEventListener("click", e => {
        e.preventDefault();

        this.toggleDrawer();
      });
    });

    this.addEventListener("keydown", e => {
      const isEscapeKey = e.key === "Escape";
      const isDrawerOpen =
        this.details.classList.contains("menu-opening");
      const nestedOpenDrawer =
        this.details.querySelector("details[open]");

      if (!isEscapeKey || nestedOpenDrawer || !isDrawerOpen) {
        return;
      }

      if (
        this.predictiveSearch &&
        this.predictiveSearch.input == document.activeElement
      ) {
        return;
      }

      this.toggleDrawer();
    });

    this.toggleTrapFocus();
  }

  toggleDrawer() {
    const isDrawerTransitioning = this.details.classList.contains(
      "drawer-transitioning"
    );

    // const isDetailsOpen = this.details.classList.contains('menu-opening');
    const isDetailsOpen = this.details.hasAttribute("open");
    const headerDiv = document.getElementById("header");
    if (!isDetailsOpen) {

      // this.closeAllOtherDrawers();

      this.details.setAttribute("open", "");
      this.toggleButtons.forEach(toggleButton => {
        toggleButton.classList.add("menu-is-open");
        toggleButton.setAttribute("aria-expanded", true);
      });
      this.details.classList.add("menu-opening");
      headerDiv.classList.add("menu-open");
      const bodyHasOverflow = body.style.overflow === "hidden";
      if (bodyHasOverflow) {
        this.parentDrawer = this.closest(".js-drawer");
        if (this.parentDrawer) {
          this.isParentDrawerOpen = true;
          this.parentDrawer.style.overflow = "hidden";
        }
      } else {
        body.style.overflow = "hidden";
        body.classList.add("drawer--is-open");
      }
      var searchInput = this.querySelector("#search-desktop");
      if (searchInput) {
        searchInput.focus();
        if (headerDiv) {
          headerDiv.classList.remove("menu-open");
        }
      }
    } else {
      this.details.classList.remove("menu-opening");
      this.toggleButtons.forEach(toggleButton => {
        toggleButton.classList.remove("menu-is-open");
        toggleButton.setAttribute("aria-expanded", false);
      });
      body.style.overflow = "";
      body.classList.remove("drawer--is-open");

      if (this.isParentDrawerOpen) {
        this.parentDrawer.style.overflow = "";
      }
      /** removing this attr witout timeout causes transition issues */
      setTimeout(() => {
        this.details.removeAttribute("open");
      }, 500);
    }

    const handleDropdownTransition = e => {
      if (
        e.target !== this.drawer ||
        e.propertyName !== "visibility"
      ) {
        return;
      }

      this.details.classList.remove("drawer-transitioning");

      if (this.elementToFocus) {
        this.elementToFocus.focus({
          preventScroll: true
        });
      }

      const isDetailsOpen = this.details.hasAttribute("open");

      if (!isDetailsOpen) {
        this.toggleButtons.forEach(toggleButton => {
          toggleButton.setAttribute("aria-expanded", false);
        });
        this.summary.focus({
          preventScroll: true
        });
      }

      if (this.isParentDrawerOpen) {
        this.parentDrawer.style.overflow = "";
        document.body.style.overflow = "";
      } else {
        document.body.style.overflow = "hidden";
      }

      e.target.removeEventListener(
        "transitionend",
        handleDropdownTransition
      );
    };

    this.drawer.addEventListener(
      "transitionstart",
      e => {
        this.details.classList.add("drawer-transitioning");
      },
      {
        once: true
      }
    );

    this.drawer.addEventListener(
      "transitionend",
      handleDropdownTransition
    );
  }

  /* probably not needed -- start */
  closeAllOtherDrawers() {
    const allDrawers = document.querySelectorAll(".js-drawer");
    allDrawers.forEach(drawer => {
      const details = drawer.closest("details");
      if (details && details !== this.details) {
        details.removeAttribute("open");
        drawer.style.overflow = "";
      }
    });

    document.body.style.overflow = "";
  }
  /* probably not needed -- end */

  instantlyHideDrawer() {
    this.toggleButtons.forEach(toggleButton => {
      toggleButton.setAttribute("aria-expanded", false);
    });
    this.details.classList.remove("menu-opening");
    this.details.removeAttribute("open");
    body.style.overflow = "";
  }

  toggleTrapFocus(container = this.drawer) {
    let isHandlingFocus = false;

    document.addEventListener("focusin", e => {
      if (isHandlingFocus) return;
      isHandlingFocus = true;

      const isDrawerOpen =
        this.details.classList.contains("menu-opening");

      if (!isDrawerOpen) {
        isHandlingFocus = false;
        return;
      }

      const openDrawer = e.target.closest(
        "details.menu-opening .js-drawer"
      );
      const nestedOpenDrawer = this.details.querySelector(
        "details.menu-opening"
      );

      if (openDrawer === this.drawer || nestedOpenDrawer) {
        isHandlingFocus = false;
        return;
      }

      e.preventDefault();

      const focusableElements = getFocusableElements(container);
      const focusedElementDOMPosition =
        container.compareDocumentPosition(e.target);

      const visibleFocusableElements = focusableElements.filter(
        focusableElement => {
          const isHidden =
            getComputedStyle(focusableElement).display === "none";

          if (isHidden) {
            return;
          }

          const isSummary = focusableElement.tagName === "SUMMARY";
          const focusableElementDetails =
            focusableElement.closest("details");
          const parentFocusableElementDetails =
            focusableElementDetails.parentElement.closest("details");
          const focusableElementDrawer =
            focusableElementDetails.querySelector(".js-drawer");
          const isThisDrawerOrDetails = focusableElementDrawer
            ? focusableElementDrawer === this.drawer
            : focusableElementDetails === this.details;

          return (
            isThisDrawerOrDetails ||
            (isSummary &&
              parentFocusableElementDetails.hasAttribute("open"))
          );
        }
      );

      const firstFocusableElement = visibleFocusableElements[0];
      const lastFocusableElement =
        visibleFocusableElements[visibleFocusableElements.length - 1];

      if (focusedElementDOMPosition >= 4) {
        firstFocusableElement.focus({
          preventScroll: true
        });
      } else {
        lastFocusableElement.focus({
          preventScroll: true
        });
      }
      isHandlingFocus = false;
    });
  }

  setInitialAccessibilityAttr() {
    const isDetailsOpen = this.details.hasAttribute("open");

    this.summary.setAttribute("role", "button");
    this.summary.setAttribute("aria-controls", this.drawer.id);
    this.summary.setAttribute("aria-expanded", isDetailsOpen);
  }
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();

    window.addEventListener("resize", e => {
      const isMobileDrawer = this.classList.contains("mobile-drawer");

      if (!isMobileDrawer) {
        return;
      }

      const isDesktop = window.innerWidth < tabletWidth;
      const isMenuOpen =
        this.details.classList.contains("menu-opening");

      if (isDesktop || !isMenuOpen) {
        return;
      }

      this.instantlyHideDrawer();
    });
  }

  instantlyHideDrawer() {
    super.instantlyHideDrawer();
  }

  toggleDrawer() {
    const isDrawerTransitioning = this.details.classList.contains(
      "drawer-transitioning"
    );

    const drawerButton = this.querySelector(".drawer__button");
    // if drawerButton has .menu-is-open class and if header has .menu-open class, drawer is open
    // so when drawerButton with .menu-is-open class is clicked, remove .menu-open class from header
    if (drawerButton.classList.contains("menu-is-open")) {
      header.classList.remove("menu-open");
      drawerButton.classList.remove("menu-is-open");
      // body scroll lock for iphones - start
      body.style.removeProperty("position");
      window.scrollTo(0, this.scrollTopValue);
    } else {
      this.scrollTopValue = window.scrollY;
      // body.style.position = "fixed"; / this causes scroll to top - buggy code
      // body scroll lock for iphones - end
      header.classList.add("menu-open");
      drawerButton.classList.add("menu-is-open");
    }

    // header.classList.toggle('menu-open');
    super.toggleDrawer();

    this.querySelectorAll(".drawer__menu-item").forEach(item => {
      item.classList.toggle("is--visible");
    });
    this.querySelectorAll(".drawer__subnav-item").forEach(item => {
      item.classList.toggle("is--visible");
    });
  }

  toggleTrapFocus() {
    super.toggleTrapFocus(this.details);
  }
}

customElements.define("header-drawer", HeaderDrawer);

class DesktopDrawer extends MenuDrawer {
  constructor() {
    super();

    window.addEventListener("resize", e => {
      const isDesktop = window.innerWidth < tabletWidth;
      const isMenuOpen =
        this.details.classList.contains("menu-opening");

      if (!isDesktop || !isMenuOpen) {
        return;
      }

      this.instantlyHideDrawer();
    });
  }
}

customElements.define("desktop-drawer", DesktopDrawer);

class SearchDrawer extends MenuDrawer {
  constructor() {
    super();

    window.addEventListener("resize", e => {
      const isMenuOpen =
        this.details.classList.contains("menu-opening");

      if (!isMenuOpen) {
        return;
      }
    });

    // get button element
    this.btn = this.querySelector(".drawer__button");
    // if this button clicked, close all other drawers
    this.btn.addEventListener("click", () => {
      const headerDrawerDetails = document.querySelector("header-drawer details");
      if (headerDrawerDetails) {
        headerDrawerDetails.removeAttribute("open");
        headerDrawerDetails.classList.remove("menu-opening");
      }
    });
  }
}
customElements.define("search-drawer", SearchDrawer);

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach(video => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach(video => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach(video => video.pause());
  document.querySelectorAll("product-model").forEach(model => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

// unpause all media
function unpauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach(video => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "playVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach(video => {
    video.contentWindow.postMessage('{"method":"play"}', "*");
  });
  // document.querySelectorAll('video').forEach(video => video.play());

  document.querySelectorAll("video").forEach(video => {
    let playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(_ => {
          // Automatic playback started!
          // Show playing UI.
          // video.play();
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
          // if paused, play
          video.play();
        });
    } else {
      // Show paused UI.
    }
  });

  document.querySelectorAll("product-model").forEach(model => {
    if (model.modelViewerUI) model.modelViewerUI.play();
  });
}

const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
};

const fetchConfig = (type = "json") => {
  return {
    method: "POST",
    headers: {
      "Content-Type": `application/${type}`,
      "Accept": `application/${type}`
    }
  };
};

class QuantityInput extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach(button =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();

    const eventTarget = event.target.name
      ? event.target
      : event.target.closest("button");

    const previousValue = this.input.value;

    eventTarget.name === "increment"
      ? this.input.stepUp()
      : this.input.stepDown();

    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define("quantity-input", QuantityInput);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;

    button.addEventListener("click", () => {
      const modal = document.querySelector(
        this.getAttribute("data-modal")
      );

      if (modal) modal.show(button);
    });
  }
}
customElements.define("modal-opener", ModalOpener);

class ModalDialog extends HTMLElement {
  constructor() {
    super();

    this.dialogHolder = this.querySelector('[role="dialog"]');
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false)
    );

    this.addEventListener("keyup", event => {
      if (event.code?.toUpperCase() === "ESCAPE" && !event.target.closest("age-verification-popup")) {
        this.hide();
      }
    });

    this.addEventListener("click", event => {
      if (event.target === this || event.target.closest("age-verification-popup, modal-dialog")) return;
      this.hide();
    });

    // Prevent closing the modal dialog when clicking inside the dialog holder
    this.dialogHolder.addEventListener("click", event => {
      event.stopPropagation();
    });
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    bodyScroll.lock(this.dialogHolder);
    this.setAttribute("open", "");
    trapFocus(this, this.dialogHolder);
    window.pauseAllMedia();
  }

  hide() {
    bodyScroll.unlock(this.dialogHolder);
    document.body.dispatchEvent(new CustomEvent("modalClosed"));
    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.unpauseAllMedia();
  }
}

customElements.define("modal-dialog", ModalDialog);

function isIOS() {
  return (
    /iPad|iPhone|iPod|iPad Simulator|iPhone Simulator|iPod Simulator/.test(
      navigator.platform
    ) ||
    (navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1)
  );
}
class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener("click", this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector(
          "template"
        ).content.firstElementChild.cloneNode(true)
      );

      this.setAttribute("loaded", true);
      const deferredElement = this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      );

      if (isIOS()) {
        deferredElement.controls = true;
      }

      deferredElement.play && deferredElement.play();

      if (focus) deferredElement.focus();
    }
  }
}

customElements.define("deferred-media", DeferredMedia);

/**
 * Additions
 */

class LocalizationForm extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector("form");
    this.localizationInputElements = this.querySelectorAll(
      '[name="country_code"], [name="language_code"]'
    );

    this.localizationInputElements.forEach(inputElement => {
      inputElement.addEventListener("input", () => {
        this.form.submit();
      });
    });
  }
}

customElements.define("localization-form", LocalizationForm);

class AccordionDefault extends HTMLElement {
  constructor() {
    super();

    this.hideMultiple = this.hasAttribute("data-hide-multiple");
    this.summaryElements = this.querySelectorAll("summary");

    this.setInitialAccessibilityAttr();

    this.addEventListener("click", e => {
      let isBtn = e.target.classList.contains("js-btn");

      if (!isBtn) {
        isBtn = e.target.closest("summary.js-btn");
      }

      if (!isBtn) return;

      e.preventDefault();

      this.toggleDropdown(
        e.target.classList.contains("js-btn")
          ? e.target
          : e.target.closest("summary")
      );
      this.collapseInactiveItems();
    });

    this.addEventListener("keydown", e => {
      const isEscapeKey = e.key === "Escape";

      if (!isEscapeKey) {
        return;
      }

      const closestOpenDetails = document.activeElement.closest(
        "details.is-active"
      );

      if (!closestOpenDetails) {
        return;
      }

      const btn = closestOpenDetails.querySelector("summary");

      if (this.closest('menu-drawer').classList.contains('facets__drawer')) {
        this.closest('menu-drawer').toggleDrawer();
        return;
      }

      this.toggleDropdown(btn);
      this.collapseInactiveItems();
    });
  }

  collapseInactiveItems() {
    if (!this.hideMultiple) return;
    const allSummaryElements = document.querySelectorAll(
      "accordion-default summary"
    );
    allSummaryElements.forEach(summary => {
      const accordionDefault = summary.closest("accordion-default");
      accordionDefault.toggleDropdown(summary, true);
    });
  }

  toggleDropdown(btn, forceClose) {
    const dropdown = btn.nextElementSibling;
    const isDropdownTransitioning = dropdown.classList.contains(
      "is-transitioning"
    );

    if (isDropdownTransitioning) {
      return;
    }

    const details = btn.parentElement;

    if (forceClose) {
      details.classList.remove("is-active");
      details.removeAttribute("open");
      btn.setAttribute("aria-expanded", false);
      dropdown.style.height = "0px";
      return;
    }

    details.classList.toggle("is-active");

    const isDetailsActive = details.classList.contains("is-active");

    btn.setAttribute("aria-expanded", isDetailsActive);

    if (isDetailsActive) {
      details.setAttribute("open", "");

      dropdown.style.height = `${dropdown.scrollHeight}px`;
    } else {
      dropdown.style.height = `${dropdown.scrollHeight}px`;

      setTimeout(() => {
        dropdown.style.height = "0px";
      }, 0);
    }

    dropdown.classList.add("is-transitioning");
    dropdown.addEventListener(
      "transitionend",
      handleHeightTransition
    );

    function handleHeightTransition(e) {
      dropdown.removeEventListener(
        "transitionend",
        handleHeightTransition
      );
      dropdown.classList.remove("is-transitioning");

      if (isDetailsActive) {
        dropdown.style.height = "auto";
        return;
      }

      details.removeAttribute("open");
      btn.focus();
    }
  }

  setInitialAccessibilityAttr() {
    this.summaryElements.forEach(summaryElement => {
      const detailsElement = summaryElement.parentElement;
      const dropdown = summaryElement.nextElementSibling;
      const isDetailsOpen = detailsElement.hasAttribute("open");

      summaryElement.setAttribute("role", "button");
      summaryElement.setAttribute("aria-controls", dropdown.id);
      summaryElement.setAttribute("aria-expanded", isDetailsOpen);
    });
  }
}

customElements.define("accordion-default", AccordionDefault);

const nav = document.querySelector(".js-nav");

nav?.addEventListener("click", function (e) {
  const isHoverDisabled = matchMedia("(hover: none)").matches;
  const isLink = e.target.classList.contains("js-nav-link");

  if (!isHoverDisabled || !isLink) {
    return;
  }

  const link = e.target;
  const linkItem = link.parentElement;
  const linksList = linkItem.parentElement;
  const activeLinkItem = linksList.querySelector(
    ".js-nav-item.is-active"
  );
  const hasDropdown = linkItem.classList.contains("has-dropdown");

  if (activeLinkItem !== linkItem) {
    activeLinkItem?.classList.remove("is-active");
  }

  if (!hasDropdown) {
    return;
  }

  e.preventDefault();

  linkItem.classList.toggle("is-active");
});

document.addEventListener("click", function (e) {
  const targetActiveLinkItem = e.target.closest(
    ".js-nav-item.is-active"
  );

  if (targetActiveLinkItem) {
    return;
  }

  const activeLinkItems = document.querySelectorAll(
    ".js-nav-item.is-active"
  );

  if (activeLinkItems.length == 0) {
    return;
  }

  activeLinkItems.forEach(activeLinkItem => {
    activeLinkItem.classList.remove("is-active");
  });
});

let navItems = document.querySelectorAll(
  ".js-nav-item.has-dropdown:not(.dropdown)"
);

window.addEventListener("shopify:section:load", function () {
  navItems = document.querySelectorAll(
    ".js-nav-item.has-dropdown:not(.dropdown)"
  );
});

["DOMContentLoaded", "resize"].forEach(eventType => {
  window.addEventListener(eventType, () => {
    navItems = document.querySelectorAll(
      ".js-nav-item.has-dropdown:not(.dropdown)"
    );
    navItems.forEach(navItem => {
      const dropdown = navItem.querySelector(".js-dropdown");

      if (!dropdown) {
        return;
      }

      const { y, height } = navItem.getBoundingClientRect();
      const itemTop = y + height;
      const dropdownY = dropdown.getBoundingClientRect().y;
      const isSameOffset = itemTop === dropdownY;

      if (isSameOffset) {
        return;
      }

      const difference = Math.round(dropdownY - itemTop);

      navItem.style.setProperty("--after-height", `${difference}px`);
    });
  });
});

// Add is scrolled class for header when transparent and sticky are enabled

let hero =
  document.querySelector(".hero-banner") ||
  document.querySelector("main section");

window.addEventListener("shopify:section:load", function () {
  hero =
    document.querySelector(".hero-banner") ||
    document.querySelector("main section");
});

toggleHeaderIsScrolled();

windowDynamicEvents.forEach(eventType => {
  window.addEventListener(eventType, function () {
    toggleHeaderIsScrolled();
  });
});

function updateAnnouncementBarTop() {
  if (announcementBar) {
    let announcementBarTop = Math.max(0, announcementBar.getBoundingClientRect().y + announcementBar.offsetHeight);
    document.documentElement.style.setProperty("--announcement-bar-top", `${parseFloat(announcementBarTop)}px`);
  }
}
window.addEventListener("scroll", updateAnnouncementBarTop);
window.addEventListener("load", updateAnnouncementBarTop);

function toggleHeaderIsScrolled() {
  if (!header || !hero) return;

  if (announcementBar && !isElementInViewport(announcementBar)) {
    document.documentElement.style.setProperty("--announcement-bar-top", `0px`);
  }

  const isHeaderSticky = header.classList.contains("is-sticky");

  if (!isHeaderTransparent || !isHeaderSticky) {
    return;
  }

  const { height, y } = hero.getBoundingClientRect();
  const isHeroInViewport = y + height - header.clientHeight > 0;

  /*
  isHeroInViewport
    ? header.classList.remove('is-scrolled')
    : header.classList.add('is-scrolled');
  */

  /* header is not transparent anymore when announcement bar is not in viewport */
  y < 0
    ? header.classList.add("is-scrolled")
    : header.classList.remove("is-scrolled");
}

function isElementInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}


const megaMenu = document.querySelectorAll(
  ".header__nav-item.megamenu"
);

if (isHeaderTransparent && megaMenu.length > 0) {
  const headerHeight = parseFloat(header.getBoundingClientRect().height);

  let isDropdownOpen = false;
  let isStillTransparent = header.classList.contains("is-transparent");

  megaMenu.forEach(link => {
    const dropdown = link;

    const handleMouseEnter = () => {
      if (isStillTransparent) {
        isDropdownOpen = true;
        // add margin top to main
        main.style.marginTop = `-${headerHeight}px`;
        header.classList.remove("is-transparent");
      }
    };

    const handleMouseLeaveLink = () => {
      isDropdownOpen = false;
    };

    const handleMouseLeaveDropdown = () => {
      if (!isDropdownOpen) {
        header.classList.add("is-transparent");
        main.style.marginTop = "";
      }
    };

    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeaveLink);
    dropdown.addEventListener("mouseleave", handleMouseLeaveDropdown);
  });
}

// Animations

const animationObserverOptions = {
  rootMargin: "-100px"
};

const animationObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("animation-init");
    entry.target.addEventListener(
      "animationend",
      () => {
        entry.target.classList.add("animation-none");
      },
      {
        once: true
      }
    );
    animationObserver.unobserve(entry.target);
  });
}, animationObserverOptions);

observeAnimationElements();

window.addEventListener("shopify:section:load", () => {
  observeAnimationElements();
});

function observeAnimationElements() {
  const animationElements = document.querySelectorAll(
    '[class*="js-animation-"]'
  );

  animationElements.forEach(animationElement => {
    animationObserver.observe(animationElement);
  });
}

function preventDefault(event) {
  event.preventDefault();
}

// DropdownInput

class DropdownInput extends HTMLElement {
  constructor() {
    super();
    this.select = this.querySelector("select");
    this.dropdown = null;
    this.buttons = null;
    this.detailsTemplate = this.querySelector(
      'template[data-name="details"]'
    );
    this.optionTemplate = this.querySelector(
      'template[data-name="option"]'
    );
    if (!this.select) return;
  }

  connectedCallback() {
    this.init();
  }

  init() {
    this.select.classList.add("hidden");
    this.appendTemplate();
  }

  appendTemplate() {
    const detailsTemplate =
      this.detailsTemplate.content.firstElementChild.cloneNode(true);
    const optionTemplate = this.optionTemplate.content;
    const options = Array.from(this.select.options);
    if (options.length === 0) return;
    const selectedOption = options.find(option => option.selected);
    detailsTemplate.querySelector("[data-label]").textContent =
      selectedOption.label;

    options.forEach(option => {
      const html = optionTemplate.cloneNode(true);
      const button = html.querySelector("button");
      const li = html.querySelector("li");

      button.setAttribute("data-value", option.value);
      button.textContent = option.label;
      button.toggleAttribute("disabled", option.disabled);
      li.classList.toggle("is-active", option.selected);
      detailsTemplate.querySelector("[data-options]").append(html);
    });

    this.append(detailsTemplate);
    this.dropdown = this.querySelector("details");
    this.buttons = this.dropdown.querySelectorAll("button");
    this.setHandlers();
  }

  update() {
    this.dropdown = null;
    this.buttons = null;
    this.querySelector("details")?.remove();
    this.appendTemplate();
  }

  setHandlers() {
    this.querySelector("summary").addEventListener(
      "click",
      this.onSummaryClick.bind(this)
    );
    this.buttons.forEach((button, index) => {
      button.addEventListener("click", event =>
        this.onOptionSelect(event, index)
      );
    });
  }

  onOptionSelect(event, index) {
    event.preventDefault();
    Array.from(this.select.options).forEach(option =>
      option.removeAttribute("selected")
    );

    this.select.options[index].setAttribute("selected", "selected");
    this.select.value = event.target.dataset.value;
    this.select.dispatchEvent(new Event("change", { bubbles: true }));
    this.querySelector("[data-label]").textContent =
      this.select.options[index].label;
    this.setSelectedOption(event.target);

    // when option is selected, update the dropdown
    this.update();
  }

  setSelectedOption(buttonOption) {
    const buttonEl = buttonOption;
    this.buttons.forEach(button => {
      button.parentElement.classList.remove("is-active");
    });
    buttonEl.parentElement.classList.add("is-active");
    this.select.dispatchEvent(new Event("change"));
    this.select.closest("form")?.dispatchEvent(new Event("input"));
    this.close(
      undefined,
      this.dropdown.querySelector("summary"),
      this.dropdown
    );
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute("open");

    isOpen
      ? this.close(event, summaryElement, detailsElement)
      : this.open(summaryElement, detailsElement);
  }

  open(summaryElement, detailsElement) {
    setTimeout(() => {
      detailsElement.classList.add("is-open");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(detailsElement, summaryElement);
  }

  close(event, summaryElement, detailsElement) {
    if (event) {
      event.preventDefault();
    }

    detailsElement.classList.remove("is-open");
    removeTrapFocus(summaryElement);
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = time => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      elapsedTime < 300 // Increase for animation duration if necessary
        ? window.requestAnimationFrame(handleAnimation)
        : detailsElement.removeAttribute("open");
    };

    window.requestAnimationFrame(handleAnimation);
  }
}
customElements.define("dropdown-input", DropdownInput);

// Countdown Timer
class CountdownTimer extends HTMLElement {
  constructor() {
    super();

    const timezone = this.dataset.timezone,
      date = this.dataset.date.split("-").filter(function (el) { return el != ""; }),
      day = parseInt(date[0]),
      month = parseInt(date[1]),
      year = parseInt(date[2]);

    let time = this.dataset.time,
      tarhour,
      tarmin;

    if (time != null) {
      time = time.split(":");
      tarhour = parseInt(time[0]);
      tarmin = parseInt(time[1]);
    }

    // Set the date we're counting down to
    let date_string =
      month +
      "/" +
      day +
      "/" +
      year +
      " " +
      tarhour +
      ":" +
      tarmin +
      " GMT" +
      timezone;
    // Time without timezone
    this.countDownDate = new Date(
      year,
      month - 1,
      day,
      tarhour,
      tarmin,
      0,
      0
    ).getTime();

    // Time with timezone
    this.countDownDate = new Date(date_string).getTime();
  }

  convertDateForIos(date) {
    var arr = date.split(/[- :]/);
    date = new Date(
      arr[0],
      arr[1] - 1,
      arr[2],
      arr[3],
      arr[4],
      arr[5]
    );
    return date;
  }
  connectedCallback() {
    let _this = this;
    let timer_layout = _this.dataset.timerLayout;
    let timer_ended_message = _this.dataset.endMessage;

    const updateTime = function () {
      // Get todays date and time
      const now = new Date().getTime();

      // Find the distance between now an the count down date
      const distance = _this.countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let countdownTimerColumns = _this.querySelector(
        ".countdown-timer__columns"
      );
      let countdownTimerMessage = _this.querySelector(
        ".countdown-timer__message"
      );

      // set .countdown-timer__column-number blocks
      let daysBlock = _this.querySelector(
        ".days .countdown-timer__column-number"
      );
      let hoursBlock = _this.querySelector(
        ".hours .countdown-timer__column-number"
      );
      let minutesBlock = _this.querySelector(
        ".minutes .countdown-timer__column-number"
      );
      let secondsBlock = _this.querySelector(
        ".seconds .countdown-timer__column-number"
      );

      if (distance < 0) {
        if (daysBlock) daysBlock.innerHTML = 0;
        if (hoursBlock) hoursBlock.innerHTML = 0;
        if (minutesBlock) minutesBlock.innerHTML = 0;
        if (secondsBlock) secondsBlock.innerHTML = 0;

        _this.classList.add("loading-effect");

        // update data-is-ended attribute
        _this.setAttribute("data-is-ended", "true");

        // if data-timer-layout is not '1', hide the countdown
        if (timer_layout !== "1") {
          // if the countdown is over, show the message and hide the countdown
          if (countdownTimerColumns)
            countdownTimerColumns.classList.add("hidden");
          if (countdownTimerMessage)
            countdownTimerMessage.classList.remove("hidden");
        }

        if (timer_layout === "1") {
          // change nearest .callout-banner__content-heading text with timer is ended message
          let calloutBannerContentHeading = _this
            .closest(".callout-banner")?.querySelector(".callout-banner__content-heading");
          if (calloutBannerContentHeading)
            calloutBannerContentHeading.innerHTML =
              _this.dataset.endMessage;
        }
      } else {
        requestAnimationFrame(updateTime);

        if (daysBlock)
          daysBlock.innerHTML = CountdownTimer.addZero(days);
        if (hoursBlock)
          hoursBlock.innerHTML = CountdownTimer.addZero(hours);
        if (minutesBlock)
          minutesBlock.innerHTML = CountdownTimer.addZero(minutes);
        if (secondsBlock)
          secondsBlock.innerHTML = CountdownTimer.addZero(seconds);

        // if days is 0, remove the days block
        if (days === 0) {
          if (daysBlock)
            daysBlock.parentElement.parentElement.remove();
        }

        _this.classList.remove("loading-effect");
      }
    };
    requestAnimationFrame(updateTime);
  }
  static addZero(x) {
    return x < 10 && x >= 0 ? "0" + x : x;
  }
}
customElements.define("countdown-timer", CountdownTimer);

if (!customElements.get("text-truncator")) {
  class TextTruncator extends HTMLElement {
    constructor() {
      super();
      this.initElements();
    }

    connectedCallback() {
      this.setupTextTruncation();
      // Uncomment the following line to enable resizing functionality
      // window.addEventListener('resize', this.setupTextTruncation.bind(this));
    }

    initElements() {
      this.textTruncatorButton = this.querySelector(".text-truncator__button");
      this.textTruncatorButtonText = this.textTruncatorButton?.querySelector(".text-truncator__button-text");
      this.textTruncatorIconPlus = this.textTruncatorButton?.querySelector(".icon-plus");
      this.textTruncatorIconMinus = this.textTruncatorButton?.querySelector(".icon-minus");
    }

    setupTextTruncation() {
      const textTruncator = this.querySelector(".text-truncator");
      textTruncator.style.display = "block"; // show the block initially

      const { lineHeight, lineCount, maxLineCount } = this.calculateLineCounts(textTruncator);

      if (lineCount > maxLineCount) {
        this.applyTextTruncation(textTruncator, lineHeight, maxLineCount);
        this.setupButton(textTruncator);
      } else {
        this.removeTextTruncation(textTruncator);
      }
    }

    calculateLineCounts(element) {
      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
      const lineCount = Math.floor(element.clientHeight / lineHeight);
      const maxLineCount = parseInt(this.dataset.maxLineCount);

      return { lineHeight, lineCount, maxLineCount };
    }

    applyTextTruncation(element, lineHeight, maxLineCount) {
      element.classList.add("text-truncator--hidden");

      const maxHeight = `${lineHeight * maxLineCount}px`;
      const style = document.createElement("style");
      style.innerHTML = `.text-truncator--hidden { max-height: ${maxHeight}; }`;
      document.head.appendChild(style);
      if (this.textTruncatorButton) {
        this.textTruncatorButton.style.display = "";
      }
    }

    removeTextTruncation(element) {
      element.classList.remove("text-truncator--hidden");

      if (this.textTruncatorButton) {
        this.textTruncatorButton.style.display = "none";
      }
    }

    setupButton(textTruncator) {
      if (this.textTruncatorButton) {
        this.textTruncatorButtonText.innerHTML = `<span>${this.dataset.readMore}</span>`;
        this.toggleIcons("plus");
        this.textTruncatorButton.addEventListener("click", (event) => {
          event.preventDefault();
          this.toggleTextTruncation(textTruncator);
        });
      }
    }

    toggleTextTruncation(textTruncator) {
      const paragraphs = textTruncator.querySelectorAll("p");
      const isHidden = textTruncator.classList.contains("text-truncator--hidden");

      paragraphs.forEach((paragraph, index) => {
        paragraph.style.marginTop = isHidden && index !== 0 ? "1rem" : "";
      });

      textTruncator.classList.toggle("text-truncator--hidden");
      this.textTruncatorButtonText.innerHTML = `<span>${isHidden ? this.dataset.readLess : this.dataset.readMore}</span>`;
      this.toggleIcons(isHidden ? "minus" : "plus");

      // on mobile, if the text is expanded, set max-height to 4rem
      if (isHidden && window.innerWidth < 768) {
        textTruncator.style.overflow = "scroll";
      } else {
        textTruncator.style.maxHeight = "";
        textTruncator.style.overflow = "";
      }
    }

    toggleIcons(iconType) {
      this.textTruncatorIconPlus.style.display = iconType === "plus" ? "inline-block" : "none";
      this.textTruncatorIconMinus.style.display = iconType === "minus" ? "inline-block" : "none";
    }
  }
  customElements.define("text-truncator", TextTruncator);
}

class BackToTop extends HTMLElement {
  constructor() {
    super();
    this.vertical_offset_for_trigger = window.innerHeight * 0.5;
    this.addEventListener("click", this.scrollToTop.bind(this));
  }

  scrollToTop() {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  }

  connectedCallback() {
    window.addEventListener("scroll", () => this.handleScroll(), {
      passive: true
    });
  }

  handleScroll() {
    const top = window.pageYOffset;
    if (top > this.vertical_offset_for_trigger) {
      this.classList.remove("hide");
    } else {
      this.classList.add("hide");
    }
  }
}

customElements.define("back-to-top", BackToTop);

const submenuButtons = document.querySelectorAll(
  ".drawer__submenu-btn"
);

submenuButtons.forEach(button => {
  button.addEventListener("click", function () {
    const parentDiv = button.parentElement;
    const isActive = parentDiv.classList.contains("is-active");

    // Etkin öğeyi doğrula
    const submenuSecond = parentDiv.querySelector(
      ".drawer__submenu-second"
    );
    if (submenuSecond) {
      submenuSecond.style.height = isActive ? "0px" : "auto";
    }

    const submenuItems = document.querySelectorAll(
      ".drawer__submenu-first-item"
    );
    submenuItems.forEach(item => {
      item.classList.remove("is-active");
      const submenu = item.querySelector(".drawer__submenu-second");
      if (submenu) {
        submenu.style.height = "0px";
      }
    });

    if (!isActive) {
      parentDiv.classList.add("is-active");
      const submenuSec = parentDiv.querySelector(
        ".drawer__submenu-second"
      );
      if (submenuSec) {
        submenuSec.style.height = "auto";
      }
    }
  });
});

/* constants */
const PUB_SUB_EVENTS = {
  cartUpdate: "cart-update",
  quantityUpdate: "quantity-update",
  variantChange: "variant-change",
  cartError: "cart-error"
};

document.addEventListener("DOMContentLoaded", function () {
  var menuLinks = document.querySelectorAll("button.menu-link");

  // Handle menu link click
  menuLinks.forEach(function (menuLink) {
    menuLink.addEventListener("click", function () {
      var activeMenuLink = document.querySelector(".menu-panel.is-active");
      var isNested = activeMenuLink?.hasAttribute("data-menu-nested");
      var targetRef = menuLink.dataset.ref;
      var targetPanel = document.querySelector(
        'div.menu-panel[data-menu="' + targetRef + '"]'
      );

      // Remove "is-active" class from all menu panels
      var allPanels = document.querySelectorAll(".menu-panel");

      if (targetPanel) {
        allPanels.forEach(function (panel) {
          if (panel.classList.contains("is-active")) {
            panel.classList.remove("is-active");
            panel.classList.add("was-active");
          }
        });

        // Add "is-active" class to the target menu panel
        targetPanel.classList.add("is-active");
        if (isNested) {
          targetPanel.classList.add("is-instant");
        }

        setTimeout(() => {
          allPanels.forEach(function (panel) {
            panel.classList.remove("was-active");
            targetPanel.classList.remove("is-instant");
          });
        }, 100);
      } else {
        allPanels.forEach(function (panel) {
          panel.classList.remove("is-active");
        });
      }
    });
  });

  var faqPage = document.querySelector('.template--faq');

  if(faqPage) {
    var accordions = document.querySelectorAll(".accordion__section");
    accordions.forEach(function (accordion) {
      accordion.addEventListener("click", function () {
        var headerHeight = document.querySelector(".header").offsetHeight;
        var bodyHeight = this.offsetHeight;
        var accordionTop = accordion.getBoundingClientRect().top;
        var scrollTo = accordionTop - headerHeight - bodyHeight;

        if (scrollTo < 0) {
          scrollTo = 0;
        }
        if (accordionTop > headerHeight) {
          scrollTo = window.scrollY;
        }

        window.scrollTo({
          top: scrollTo,
          behavior: "smooth"
        });
      });
    });
  }
});

/* swiper - hide swiper buttons element if both next and prev buttons are disabled */
document.addEventListener("DOMContentLoaded", function () {
  const allSwiperButtons = document.querySelectorAll(".swiper-buttons");
  allSwiperButtons.forEach(function (swiperButtons) {
    const prevButton = swiperButtons.querySelector("[class^='swiper-button--prev'], [class*=' swiper-button--prev']");
    const nextButton = swiperButtons.querySelector("[class^='swiper-button--next'], [class*=' swiper-button--next']");
    if (prevButton && nextButton && prevButton.classList.contains("swiper-button-disabled") && nextButton.classList.contains("swiper-button-disabled")) {
      swiperButtons.style.display = "none";
    }

    // get grand parent child of swiper-buttons
    const grandParent = swiperButtons.parentElement.parentElement;
    // if grand parent has class of section__foot and this section__foot has no a.button set margin-block-start to 0
    if (grandParent.classList.contains("section__foot") && !grandParent.querySelector("a.button")) {
      grandParent.style.marginBlockStart = "0";
    }
  });
});


if (!customElements.get("product-card")) {
  class ProductCard extends HTMLElement {
    constructor() {
      super();
      this.isQuickCart = this.classList.contains("product-card--quick-cart");
      this.init();
    }

    init() {
      this.initForm();
      this.initVariants();
      if (
        this.querySelector(".product-card__media") &&
        this.querySelector(".product-card__media").classList.contains(
          "product-card__media--hoverable"
        )
      ) {
        this.secondImgHoverStates();
      }

      // if quick-cart-drawer does not exists, remove trigger buttons
      if (!document.querySelector("quick-cart-drawer")) {
        this.querySelector(".quick-cart-drawer__trigger")?.remove();
      }
    }

    /**
     * Add to Cart Form
     */
    initForm() {
      /** Variables */
      this.cart = document.querySelector("cart-notification") || document.querySelector("cart-drawer");
      this.addToCartForm = this.querySelector(
        "form.product-card__add-to-cart--form"
      );
      if (this.addToCartForm) {
        this.addToCartForm.removeAttribute("method");
        this.addToCartForm.removeAttribute("action");
      }
      this.submitButton = this.querySelector('button[type="submit"]');
      /** Event Listeners */
      if (this.addToCartForm) {
        this.addToCartForm.addEventListener(
          "submit",
          this.submitAddToCartForm.bind(this)
        );
      }
    }

    submitAddToCartForm(event) {
      event.preventDefault();

      this.submitButton.setAttribute("disabled", "");
      this.submitButton.classList.add("add-to-cart--is-disabled");

      const config = fetchConfig('javascript');
      config.headers["X-Requested-With"] = "XMLHttpRequest";
      delete config.headers["Content-Type"];

      const formData = new FormData(event.target);
      if (this.cart) {
        formData.append(
          "sections",
          this.cart
            .getSectionsToRender()
            .map(section => section.section)
        );
        formData.append("sections_url", window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then(response => response.json())
        .then(response => {
          if (response.errors) {
            this.handleErrorMessage(response.errors);
            return;
          }

          if (this.cart) {
            this.cart.renderContents(response);
          }

          // update cart counter or cart-count-badge
          const cartDrawerCounter = document.querySelector(".cart-drawer__title-counter");
          const cartCounter = document.querySelector('#cart-counter');

          fetch("/cart.json", {
            method: "GET",
            headers: {
              Accept: "application/json"
            }
          })
            .then(response => response.json())
            .then(
              data => {
                if (cartDrawerCounter) {
                  cartDrawerCounter.innerHTML = data.item_count;
                }
                if (cartCounter) {
                  const cartCountBadge = cartCounter.querySelector(".cart-count-badge");
                  if (cartCountBadge) {
                    cartCountBadge.innerHTML = data.item_count;
                  } else {
                    const newCartCountBadge = document.createElement("span");
                    newCartCountBadge.classList.add("cart-count-badge");
                    newCartCountBadge.innerHTML = data.item_count;
                    cartCounter.appendChild(newCartCountBadge);
                  }
                }
              }
            );
        })
        .catch(error => {
          // console.error(error);
        })
        .finally(() => {
          this.submitButton.removeAttribute("disabled");
          this.submitButton.classList.remove(
            "add-to-cart--is-disabled"
          );

          const quickCartDrawer = this.closest("quick-cart-drawer");
          if (quickCartDrawer) {
            quickCartDrawer.close();
          }
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.querySelector(
        ".product-form__error-message-wrapper"
      );
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessageWrapper.querySelector(
        ".product-form__error-message"
      );

      this.errorMessageWrapper.toggleAttribute(
        "hidden",
        !errorMessage
      );

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }

      setTimeout(() => {
        this.resetErrorMessage();
      }, 5000);
    }

    resetErrorMessage() {
      if (!this.errorMessageWrapper) return;
      this.errorMessageWrapper.toggleAttribute("hidden", true);
      this.errorMessageWrapper.textContent = "";
    }

    /**
     * Product Variants
     */
    initVariants() {
      this.getVariantsData();

      /** Event Listeners */
      this.querySelectorAll(".button--variant input").forEach(
        variantButton => {
          variantButton.addEventListener(
            "click",
            this.onClickOptionRadioInputs.bind(this)
          );
        }
      );

      /** Initial Checked Options */
      let initialCheckedOptions = [];
      this.querySelectorAll(".variant-option-radio-input").forEach(
        radioInput => {
          if (radioInput.checked) {
            initialCheckedOptions.push(radioInput.value);
          }
        }
      );
      if (initialCheckedOptions.length === 0) {
        this.querySelector(".variant-option-radio-input")?.click();
      }
      if (this.isQuickCart) {
        this.updateVariantStatuses();
      }

      const { currentVariantId } = this.findCurrentVariantFromOptionRadioInputs();
      if (!this.querySelector('.product-card__media')?.dataset.updateMedia) {
        this.updateMediaForVariant(currentVariantId);
      }
      this.setCartButtonState();
    }

    updateVariantStatuses() {
      const selectedOptionOneVariants = this.variantsObj?.filter(
        variant =>
          this.querySelector(":checked").value === variant.option1
      );

      const inputWrappers = [
        ...this.querySelectorAll(".product-card__variants--option")
      ];

      inputWrappers.forEach((option, index) => {
        if (index === 0) return;
        const optionInputs = [
          ...option.querySelectorAll('input[type="radio"]')
        ];
        const previousOptionSelected =
          inputWrappers[index - 1].querySelector(":checked").value;
        const availableOptionInputsValue = selectedOptionOneVariants
          ?.filter(
            variant =>
              variant.available &&
              variant[`option${index}`] === previousOptionSelected
          )
          .map(variantOption => variantOption[`option${index + 1}`]);

        this.setInputAvailability(
          optionInputs,
          availableOptionInputsValue
        );
      });
    }

    setInputAvailability(elementList, availableValuesList) {
      elementList.forEach(element => {
        const value = element.getAttribute("value");
        const availableElement = availableValuesList.includes(value);
        element
          .closest("li")
          .classList.toggle("disabled", !availableElement);
        element.toggleAttribute("disabled", !availableElement);
      });
    }

    onClickOptionRadioInputs(event) {
      const {
        currentVariantId,
        currentCheckedOptions,
        currentVariantMediaId
      } = this.findCurrentVariantFromOptionRadioInputs();

      this.clearRadioInputStates(event);

      if (currentCheckedOptions.includes(event.target.value)) {
        event.target.setAttribute("checked", "");
        event.target.closest("li").classList.add("checked");

        if (this.isQuickCart) {
          this.updateVariantStatuses();
        }
        this.disableAddToCartButons();

        // call to update price when variant is changed
        this.updatePriceForVariant(currentVariantId);

        // call to update discount badge when variant is changed
        this.updateDiscountBadgeForVariant(currentVariantId);
      }

      // update form input variant-id
      this.updateFormVariantIdInput();

      // update product image shown
      let allVariantIdsWithImageAvailable = [];
      this.querySelectorAll("[data-product-images]").forEach(el => {
        el.getAttribute("data-product-images")
          .split(",")
          .forEach(v => {
            allVariantIdsWithImageAvailable.push(v);
          });
      });
      if (
        allVariantIdsWithImageAvailable.includes(
          currentVariantId.toString()
        )
      ) {
        this.updateMediaForVariant(currentVariantId);
      }

      if (this.isQuickCart && currentVariantMediaId) {
        document
          .querySelector("quick-cart-drawer")
          .setActiveMedia(currentVariantMediaId);
      }

      // update product link
      this.querySelectorAll("[data-product-link]").forEach(
        linkItem => {
          const currentLink = linkItem.getAttribute("href");
          if (currentVariantId) {
            const newLink =
              currentLink.split("?variant=")[0] +
              "?variant=" +
              currentVariantId;
            linkItem.setAttribute("href", newLink);
          }
        }
      );
    }

    setCartButtonState() {
      const { currentVariantAvailable } =
        this.findCurrentVariantFromOptionRadioInputs();
      if (!currentVariantAvailable) return;
      this.submitButton?.toggleAttribute(
        "disabled",
        !currentVariantAvailable
      );
    }

    updateMediaForVariant(currentVariantId) {
      if (!currentVariantId) return;
      this.querySelectorAll("[data-product-images]").forEach(el => {
        el.classList.toggle(
          "hidden",
          !el
            .getAttribute("data-product-images")
            .includes(currentVariantId)
        );
      });
    }

    updateFormVariantIdInput() {
      const { currentVariantId } =
        this.findCurrentVariantFromOptionRadioInputs();
      if (currentVariantId) {
        this.querySelector('input[name="id"]').value =
          currentVariantId;
      }
    }

    updatePriceForVariant(variantId) {
      // Assuming the variantsObj contains the variant data, including price
      const selectedVariant = this.variantsObj?.find(variant => variant.id === variantId);

      if (selectedVariant) {

        let priceContainer = this.querySelector('.price__container');
        // if priceContainer does not exist, check previous element
        if (!priceContainer) {
          const previousElement = this.previousElementSibling;
          if (previousElement) {
            // check if previous element has class of price__container
            priceContainer = previousElement.querySelector('.price__container');
          }
        }

        if (!priceContainer) return;
        const moneyFormat = priceContainer.dataset.moneyFormat;
        const price = formatPrice(moneyFormat, selectedVariant.price / 100);
        const compare_at_price = formatPrice(moneyFormat, selectedVariant.compare_at_price / 100);
        const labelPriceRegular = priceContainer.dataset.labelPriceRegular;
        const labelPriceSale = priceContainer.dataset.labelPriceSale;

        if (compare_at_price > price) {
          // generate html block and append to price container
          const priceHtml = `
            <div class="price__sale">
              <div class="price__sale-inner">
                <span class="visually-hidden">${labelPriceSale}</span>
                <s>${compare_at_price}</s>
                <ins>
                  <span class="visually-hidden">${labelPriceRegular}</span>
                  ${price}
                </ins>
              </div>
            </div>
          `;
          priceContainer.innerHTML = priceHtml;
        } else {
          // generate html block and append to price container
          const priceHtml = `
            <div class="price__sale">
              <div class="price__sale-inner">
                <span class="visually-hidden">${labelPriceRegular}</span>
                ${price}
              </div>
            </div>
          `;
          priceContainer.innerHTML = priceHtml;
        }
      }
    }

    updateDiscountBadgeForVariant(variantId) {
      const selectedVariant = this.variantsObj?.find(variant => variant.id === variantId);
      if (selectedVariant) {
        let discountBadge = this.querySelector(".product-card__badge--discount");
        // if discountBadge does not exist, check previous element
        if (!discountBadge) {
          const previousElement = this.previousElementSibling;
          if (previousElement) {
            // check if previous element has class of product-card__badge--discount
            discountBadge = previousElement.querySelector(".product-card__badge--discount");
          }
        }

        if (discountBadge) {
          if (selectedVariant.compare_at_price > selectedVariant.price) {
            discountBadge.classList.remove("hidden");
            const percentageElement = discountBadge.querySelector(".percentage");
            // calculate discount percentage
            const discountPercentage = Math.round(
              ((selectedVariant.compare_at_price - selectedVariant.price) / selectedVariant.compare_at_price) * 100
            );
            // update discount percentage
            percentageElement.textContent = discountPercentage;
          } else {
            discountBadge.classList.add("hidden");
          }
        }

      }
    }

    disableCheckedVariantOptions() {
      this.querySelectorAll(
        ".variant-option-radio-input[checked]"
      ).forEach(variantBtn => {
        if (this.isQuickCart) {
          variantBtn.setAttribute("disabled", "");
          variantBtn.closest("li").classList.add("disabled");
        } else {
          variantBtn.removeAttribute("disabled");
        }
      });
    }

    disableAddToCartButons() {
      const { currentVariantAvailable } =
        this.findCurrentVariantFromOptionRadioInputs();
      const submitBtn = this.querySelector(
        ".product-card__add-to-cart--form button[type='submit']"
      );

      if (
        submitBtn &&
        !submitBtn.classList.contains(
          "product-card__add-to-cart--button"
        )
      ) {
        if (!currentVariantAvailable) {
          submitBtn.setAttribute("disabled", "");
        } else {
          submitBtn.removeAttribute("disabled");
        }
      }
    }

    clearRadioInputStates(event) {
      event.target
        .closest(".product-card__variants--option")
        .querySelectorAll(".variant-option-radio-input")
        .forEach(radioInput => {
          radioInput.removeAttribute("checked");
          radioInput.closest("li").classList.remove("checked");
        });
    }

    findCurrentVariantFromOptionRadioInputs() {
      let currentVariantAvailable = null;
      let currentVariantId = "";
      let currentVariantMediaId = "";
      let currentCheckedOptions = [];

      this.querySelectorAll(
        ".product-card__variants--option"
      ).forEach(item => {
        if (!item.classList.contains("hidden-variant")) {
          item
            .querySelectorAll('input[type="radio"]')
            .forEach(radioInput => {
              if (radioInput.checked) {
                currentCheckedOptions.push(radioInput.value);
              }
            });
        } else {
          // hidden variant (size or etc) always uses the first option
          currentCheckedOptions.push(
            item.querySelector('input[type="radio"]').value
          );
        }
      });

      this.variantsObj?.forEach(item => {
        if (item.options.join() === currentCheckedOptions.join() || item.options.length === 1 && currentCheckedOptions.length === 0) {
          currentVariantId = item.id;
          currentVariantAvailable = item.available;
          currentVariantMediaId = item.featured_media?.id || null;
        }
      });

      return {
        currentVariantAvailable,
        currentVariantId,
        currentCheckedOptions,
        currentVariantMediaId
      };
    }

    findAndDisableAllUnavailableOptionsForSelectedVariant(
      selectedOption
    ) {
      let selectedOptionName = "";
      if (selectedOption) {
        selectedOptionName = selectedOption.value;
      } else {
        selectedOptionName = this.querySelectorAll(
          ".variant-option-radio-input"
        )[0].value;
      }

      const { currentCheckedOptions } =
        this.findCurrentVariantFromOptionRadioInputs();
      const optionIndex =
        currentCheckedOptions.indexOf(selectedOptionName) + 1;

      this.variantsObj.forEach(item => {
        if (
          item[`option${optionIndex}`] === selectedOptionName &&
          !item.available
        ) {
          [1, 2, 3].forEach(i => {
            if (i !== optionIndex && item[`option${i}`]) {
              const itemToDisable = this.querySelector(
                `.variant-option-radio-input[value="${
                  item[`option${i}`]
                }"]`
              );
              // itemToDisable.setAttribute("disabled", "");
              itemToDisable.closest("li").classList.add("disabled");
            }
          });
        }
      });
    }

    getVariantsData() {
      const variantsObj = JSON.parse(
        this.querySelector("[data-product-variants-json]")
          ? this.querySelector("[data-product-variants-json]")
              .textContent
          : "[]"
      );
      if (variantsObj && Object.keys(variantsObj).length === 0)
        return false;
      this.variantsObj = variantsObj;
      return variantsObj;
    }

    /** Additional event listerner for styling on hovering mutliple nested items */
    secondImgHoverStates() {
      const hoverableItem = this.querySelector(
        ".product-card__actions"
      );

      if (!hoverableItem || window.innerWidth < 750) { return; }

      hoverableItem.addEventListener("mouseenter", () =>
        hoverableItem.classList.add("is--hovering")
      );
      hoverableItem.addEventListener("mouseleave", () =>
        hoverableItem.classList.remove("is--hovering")
      );
    }
  }
  customElements.define("product-card", ProductCard);
}

async function updateFreeShipping() {
  const conversionRate = Shopify.currency.rate;
  const {
    cart_free_shipping_text: freeShippingTextDefault,
    cart_free_shipping_text_success: freeShippingTextSuccessDefault,
    cart_free_shipping_threshold: freeShippingThreshold,
    money_format: moneyFormat
  } = window.theme.settings;

  const freeShippingElements = document.querySelectorAll("shipping-bar");

  try {
    const response = await fetch("/cart.js");
    const { total_price, item_count } = await response.json();

    const visibility = item_count == 0 ? "hidden" : "visible";
    freeShippingElements.forEach(
      el => (el.style.visibility = visibility)
    );

    const newShippingThreshold = Math.round(freeShippingThreshold * conversionRate);
    const newRemainingAmount = newShippingThreshold - total_price;

    freeShippingElements.forEach(freeShipping => {
      const freeShippingTextElement = freeShipping.querySelector(".progress-bar__text");
      const progressBarInner = freeShipping.querySelector("[data-progress-line]");
      if (total_price >= newShippingThreshold) {
        freeShippingTextElement.innerHTML = freeShippingTextSuccessDefault;
        progressBarInner.style.width = "100%";
      } else {
        const moneyMatch = freeShippingTextDefault.match(/<span class="money">(.*)<\/span>/);
        if (moneyMatch) {
          const newFreeShippingText = freeShippingTextDefault.replace(
            moneyMatch[1], `${formatPrice(moneyFormat, newRemainingAmount / 100)}`
          );
          freeShippingTextElement.innerHTML = newFreeShippingText;
        }
        progressBarInner.style.width = `calc(${(total_price / newShippingThreshold) * 100}% + 2px)`;
      }
    });
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

function formatPrice(moneyString, amount) {
  // convert amount to 00.00 format
  amount = amount.toFixed(2);

  const money_format = /{{(.*?)}}/;

  let money_format_option = "";
  if (moneyString.match(money_format)) {
    money_format_option = moneyString.match(money_format)[1];
  } else {
    console.error("No match found");
  }

  let newValue = "";
  switch (money_format_option) {
    case "amount":
      newValue = moneyString.replace(
        money_format,
        Intl.NumberFormat(Shopify.locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount)
      );
      break;
    case "amount_with_comma_separator":
      newValue = moneyString.replace(
        money_format,
        amount.toString().replace(".", ",")
      );
      break;
    case "amount_no_decimals":
      newValue = moneyString.replace(
        money_format,
        Math.round(amount)
      );
      break;
    case "amount_no_decimals_with_comma_separator":
      newValue = moneyString.replace(
        money_format,
        Intl.NumberFormat(Shopify.locale)
          .format(Math.round(amount))
          .toString()
          .replace(".", ",")
      );
      break;
    default:
      newValue = moneyString.replace(money_format, amount);
      break;
  }

  return newValue;
}

class SwiperComponent extends HTMLElement {
  constructor() {
    super();
    this.swiperOptions = JSON.parse(this.getAttribute("data-swiper-options")) || {};
    this.swiperInitialized = false; // Prevent multiple initializations
  }

  connectedCallback() {
    // Use a proper load event depending on the environment
    if (Shopify.designMode) {
      window.addEventListener("shopify:section:load", () => {
        this.init();
      });
      window.addEventListener("shopify:section:select", () => {
        this.init();
      });
    } else {
      window.addEventListener("load", () => {
        this.init();
      });
    }
  }

  init() {
    // Prevent multiple initializations
    if (this.swiperInitialized) return;
    this.swiperInitialized = true;

    const swiperOptions = this.swiperOptions;

    const option = {
      slideshowId: swiperOptions.swiperId || "",
      slideCount: swiperOptions.slideCount || 1,
      slidesPerView: swiperOptions.slidesPerView || "auto",
      slidesPerViewDesktop:
        swiperOptions.slidesPerViewDesktop ||
        swiperOptions.slidesPerView ||
        4,
      slidesPerViewTablet:
        swiperOptions.slidesPerViewTablet ||
        swiperOptions.slidesPerViewDesktop ||
        swiperOptions.slidesPerView ||
        3,
      spaceBetween: swiperOptions.spaceBetweenMobile || 0,
      spaceBetweenDesktop:
        swiperOptions.spaceBetweenDesktop ||
        swiperOptions.spaceBetween ||
        0,
      spaceBetweenTablet:
        swiperOptions.spaceBetweenTablet ||
        swiperOptions.spaceBetweenDesktop ||
        swiperOptions.spaceBetweenMobile ||
        0
    };

    this.swiperOptions = {
      a11y: false,
      allowTouchMove: option.slideCount > 1 ? true : false,
      loop: swiperOptions.loop || false,
      rewind: swiperOptions.rewind || false,
      followFinger: swiperOptions.followFinger || false,
      slidesPerView: option.slidesPerView,
      spaceBetween: option.spaceBetween,
      breakpoints: {
        750: {
          allowTouchMove:
            option.slideCount > option.slidesPerViewTablet
              ? true
              : false,
          slidesPerView: option.slidesPerViewTablet,
          spaceBetween: option.spaceBetweenTablet
        },
        990: {
          allowTouchMove:
            option.slideCount > option.slidesPerViewDesktop
              ? true
              : false,
          slidesPerView: option.slidesPerViewDesktop,
          spaceBetween: option.spaceBetweenDesktop
        }
      }
    };

    if (swiperOptions.navigation) {
      this.swiperOptions.navigation = {
        ...swiperOptions.navigation
      };
    }

    if (swiperOptions.effect == "fade") {
      this.swiperOptions.effect = "fade";
      this.swiperOptions.fadeEffect = {
        crossFade: true
      };
    }

    if (swiperOptions.pagination == "custom_bullet") {
      this.swiperOptions.pagination = {
        el: swiperOptions.paginationElement,
        clickable: true,
        renderBullet: function (i, className) {
          return `
          <button class="${className}">
            <span></span>
          </button>
          `;
        }
      };
    } else {
      this.swiperOptions.pagination = {
        el: ".swiper-pagination",
        clickable: true
      };
    }

    if (swiperOptions.autoplay) {
      this.swiperOptions.autoplay = {
        ...swiperOptions.autoplay
      };

      if (swiperOptions.autoplayProgress) {
        const progressCircle = this.querySelector(
          `.autoplay-progress--${swiperOptions.swiperId} svg`
        );
        const progressContent = this.querySelector(
          `.autoplay-progress--${swiperOptions.swiperId} span`
        );

        this.swiperOptions.on = {
          autoplayTimeLeft(s, time, progress) {
            progressCircle.style.setProperty(
              "--progress",
              1 - progress
            );
            progressContent.textContent = `${Math.ceil(time / 1000)}`;
          }
        };
      }
    }

    this.swiper = new Swiper(this, this.swiperOptions);
  }
}
customElements.define("swiper-component", SwiperComponent);

// header cards text size classes
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.header .header__nav--group-card')?.forEach(el => {
    el?.querySelectorAll('.header__nav-links-item--card')?.forEach(link => {
      const textSize = Math.round(el.offsetWidth / link?.offsetWidth);
      link?.classList.add(`header__nav-links-item--card-text-${textSize}`);
    });
  });
});
