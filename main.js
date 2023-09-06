const url = 'https://gradistore-spi.herokuapp.com/products/all';


const carouselContent = document.getElementById('carousel');

async function fetchData(urlApi) {
  const response = await fetch(urlApi);
  const data = await response.json();
  const products = data.products.nodes;
  console.log(products);
  return products;
};

(async () => {
  try {
    const allProducts = await fetchData(url);

    function generateStars(tagValue) {
      let numStars;

      switch (true) {
        case tagValue >= 0 && tagValue < 100:
          numStars = 1;      
          break;
        case tagValue >= 100 && tagValue < 200:
          numStars = 2;
          break;
        case tagValue >= 200 && tagValue < 300:
          numStars = 3;
          break;
        case tagValue >= 300 && tagValue < 400:
          numStars = 4;
          break;
        case tagValue >= 400 && tagValue <= 500:
          numStars = 5;
          break;
      };

      let showStars = "";
      for (let i = 0; i < numStars; i++) {
        showStars += `<img src="./src/images/star.png" alt="star" class="star-icon">`;
      }
      return showStars;
    };

    let view = `
    <div class="carousel">
    ${allProducts.map((product) => (`
    <div class="carousel-item">
      <div class="image-container">
        <div class="image-wrapper">
          <img src=${product.featuredImage.url} alt=${product.title} draggable="false">
          <button class="secondary-button">ADD TO CART</button>
        </div>
      </div>
        <div class="product-info">
          <h3>${product.title}</h3>
            <div class="product-detail">
              <div class="rate-container">
                <div class="stars">
                  ${generateStars(product.tags[0])}
                </div>
                <p>(${product.tags[0]})</p>
              </div>
              <div class="price-container">
                <p>€${product.prices.max.amount}</p>
                <p>€${product.prices.min.amount}</p>
              </div>
            </div>
          </div>
        </div>
    `)).join("")}
    </div>
  `;
  carouselContent.innerHTML = view

  const carouselContainer = document.querySelector(".carousel-container"); 
  const carousel = document.querySelector('.carousel');
  const leftBtn = document.querySelector(".carousel-btn-container .left-btn button");
  const rightBtn = document.querySelector(".carousel-btn-container .right-btn button");
  const arrowBtns = [leftBtn, rightBtn];
  const firtsCardWidth = carousel.querySelector(".carousel-item").offsetWidth;
  const carouselChildrens = [...carousel.children];
                  
  let isDragging = false, startX, startScrollLeft, timeoutId;

  let cardPerView = Math.round(carousel.offsetWidth / firtsCardWidth);
                  
  carouselChildrens.slice(0,cardPerView).reverse().forEach(item => {
  carousel.insertAdjacentHTML("beforeend", item.outerHTML);
  });

  carouselChildrens.slice(-cardPerView).reverse().forEach(item => {
  carousel.insertAdjacentHTML("afterbegin", item.outerHTML);
  });

  arrowBtns.forEach(btn => {
     btn.addEventListener("click", () => {
     carousel.scrollLeft += btn.id === "left" ? - firtsCardWidth : firtsCardWidth;
     })
  })

  const dragging = (e) => {
    if (!isDragging) {
        return;
    }
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };


  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");

    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging")
  }

  const autoPlay = () => {
    if (window.innerHeight < 800) {
        return;
    }
    timeoutId = setTimeout(() => carousel.scrollLeft += firtsCardWidth, 2500); 
  }
  autoPlay();

  const infinityScroll = () => {
    if (carousel.scrollLeft === 0) {
         carousel.classList.add("no-transition")
         carousel.scrollLeft = carousel.scrollWidth - ( 2 * carousel.offsetWidth);
         carousel.classList.remove("no-transition")
    } else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
         carousel.classList.add("no-transition")
         carousel.scrollLeft = carousel.offsetWidth;
         carousel.classList.remove("no-transition")
    }

    clearTimeout(timeoutId);
      if (!carouselContainer.matches(":hover")) {
            autoPlay();
      }
  }

  carousel.addEventListener("mousemove", dragging);
  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mouseup", dragStop);
  carousel.addEventListener("scroll", infinityScroll);
  carouselContainer.addEventListener("mouseenter", () => clearTimeout(timeoutId));
  carouselContainer.addEventListener("mouseleave", autoPlay);

} catch (error) {
    console.error(error);
  }
})();