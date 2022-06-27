$(document).ready(function () {
  $(".slickBrands").slick({
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1300,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 4
        }
      }
    ]
  });
});