function getData() {

  const c = {
    dom: {
      search_btn: 'js-search-btn',
      search_input: 'search-nav__input',
      results: 'search-results',
      previous_btn: 'js-previous',
      next_btn: 'js-next', 
      page_num: 'pagination-btns__page-number',
      pagination_btns: 'pagination-btns',
      search_info_results_text: 'search-info__results-text',
      cart_count: 'search-nav__cart-count',
      add_to_cart: 'js-atc',
      hero: 'hero',
      search_nav_link: 'search-nav__link',
      search_container: 'search-container',
    },
    cls: {
      hide: 'hide',
      hidden: 'hidden',
    }
  }

  // Global variables
  const $searchBtn = document.querySelector(`.${c.dom.search_btn}`);
  const $searchInput = document.querySelector(`.${c.dom.search_input}`);
  const $results = document.querySelector(`.${c.dom.results}`);
  const $resultsText = document.querySelector(`.${c.dom.search_info_results_text}`);
  const $cartCount = document.querySelector(`.${c.dom.cart_count}`);
  const $paginationBtns = document.querySelectorAll(`.${c.dom.pagination_btns}`);
  const $hero = document.querySelector(`.${c.dom.hero}`);
  const $searchNavLink = document.querySelector(`.${c.dom.search_nav_link}`);
  const $searchContainer = document.querySelector(`.${c.dom.search_container}`);

  // page number and results per page
  let pageNumber = 1;
  const resultsPerPage = 25;

  /**
   * Init
   */
  function init() {
    addEvents();
  }

  /**
   * Add events
   */
  function addEvents() {
    $searchBtn.addEventListener('click', () => {
      pageNumber = 1;
      fetchResult(pageNumber, resultsPerPage);
    });

    $searchInput.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        pageNumber = 1;
        fetchResult(pageNumber, resultsPerPage);
      }
    });

    // add hidden class to search container
    $searchNavLink.addEventListener('click', () => {
      $searchContainer.classList.add(c.cls.hidden);
    })
  }

  /**
   * Fetch results
   */
  function fetchResult(pageNumber, resultsPerPage) {
    // remove hidden class on search container
    $searchContainer.classList.remove(c.cls.hidden);

    const queryParam = $searchInput.value;
    if (queryParam === '') return;
    const ssid = 'scmq7n';
    const url = `https://${ssid}.a.searchspring.io/api/search/search.json?q=${queryParam}&resultsPerPage=${resultsPerPage}&resultsFormat=native&page=${pageNumber}&siteId=${ssid}`

    // fetch data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // pagination 
        pagination(data, queryParam);
        // hide hero section
        $hero.innerHTML = '';
        // product results
        const productResults = data.results;
        // clear results
        $results.innerHTML = '';
        // display results
        productResults.map((product) => createSearchItem(product));
      })
      .catch(error => console.log(error));
  }

  /**
   * Pagination
   */
  function pagination(data, queryParam) {
    // pagination buttons
    paginationBtns(data);

    // display results text
    $resultsText.innerHTML = `Showing search results for "${queryParam}" (${data.pagination.end} of ${data.pagination.totalResults})`;
  }

  /**
   * Pagination buttons
   */
  function paginationBtns(data) {
    // display pagination buttons
    $paginationBtns.forEach((item) => {
      item.innerHTML =  `
        <p class="pagination-btns__page-number"></p>
        <div class="pagination-btns__wrapper">
          <button class="pagination-btns__previous primary-btn js-previous">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff"
              class="w-6 h-6 arrow">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button class="pagination-btns__next primary-btn js-next">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff"
              class="w-6 h-6 arrow">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      `;

      // next button
      const nextButton = item.querySelector(`.${c.dom.next_btn}`);
      nextButton.addEventListener('click', () => {
        window.scrollTo({top: 0});
        pageNumber = pageNumber + 1;
        fetchResult(pageNumber, resultsPerPage)
      });

      // hide next button if page number is greater than total pages
      if (pageNumber >= data.pagination.totalPages) {
        nextButton.classList.add(c.cls.hide);
      } else {
        nextButton.classList.remove(c.cls.hide);
      };

      // previous button
      const prevButton = item.querySelector(`.${c.dom.previous_btn}`);
      prevButton.addEventListener('click', () => {
        window.scrollTo({top: 0});
        pageNumber = pageNumber - 1;
        fetchResult(pageNumber, resultsPerPage)
      });

      // hide previous button if page number is 1
      if (pageNumber <= 1) {
        prevButton.classList.add(c.cls.hide);
      } else {
        prevButton.classList.remove(c.cls.hide);
      };

      // display page number
      const pageNum = item.querySelector(`.${c.dom.page_num}`);
      pageNum.innerHTML = `Page ${pageNumber} of ${data.pagination.totalPages}`;
    })
  }

  /**
   * Create search item
   */
  function createSearchItem(product) {
    $results.innerHTML += `
      <div class="search-results__item">
        <div class="search-results__image-wrapper">
          <div class="search-results__ratio">
            <img 
              class="search-results__image search-results__ratio-content lazyload" 
              loading="lazy"
              src="${product.thumbnailImageUrl}" onError="this.onerror=null;this.src='https://fakeimg.pl/257x400/e0e0e0/0d0d0d?text=No+image';"
              alt="${product.name}"
            />
          </div>
        </div>
        <div class="search-results__info">
          <p class="search-results__name">${product.name}</p>
          <div class="search-results__container">
            <div class="search-results__price-wrapper">
              ${product.msrp > product.price ? `<p class="search-results__msrp">$${product.msrp}</p>` : ''}
              <p class="search-results__price">$${product.price}</p>
            </div>
            <div class=""search-results__atc-wrapper>
              <button class="search-results__atc js-atc" type="button">Quick Add</button>
            </div
          </div>
        </div>
      </div>
    `;

    // update cart count
    updateCartCount();
  }

  /**
   * Update cart count
   */
  function updateCartCount() {
    const $addToCart = document.querySelectorAll(`.${c.dom.add_to_cart}`);
    if (!$addToCart) return;

    $addToCart.forEach((item) => {
      item.addEventListener('click', () => {
        const cartCountNum = parseInt($cartCount.innerHTML);
        $cartCount.innerHTML = cartCountNum + 1;
      })
    })
  }

  return init();
}

export default getData;