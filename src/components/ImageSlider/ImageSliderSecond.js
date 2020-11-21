import React from "react";
import Slider from "react-slick";
import './ImageSliderSecond.css';

const ImageSliderSecond = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-4_bqrdgl.jpg"
          alt="Fourth Picture of Yacht"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286527/yacht-pic-5_t2hktk.jpg"
          alt="Fifth Picture of Yacht"/>
      </div>
      <div>
        <img
          className="slider-image-second"
        src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-6_yndqda.jpg"
        alt="Sixth Picture of Yacht"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-7_j2du0r.jpg"
          alt="Seventh Picture of Yacht"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286529/yacht-pic-8_ifbgb2.jpg"
          alt="Eighth Picture of Yacht"/>
      </div>
    </Slider>
  );
}

export default ImageSliderSecond;
