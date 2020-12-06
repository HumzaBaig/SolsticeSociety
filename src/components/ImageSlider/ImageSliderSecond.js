import React from "react";
import Slider from "react-slick";
import './ImageSliderSecond.css';

const ImageSliderSecond = () => {
  var settings = {
    dots: false,
    arrows: true,
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
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286529/yacht-pic_lc1fu1.jpg"
          alt="Eagle-eye from the side point of view of the yacht off the coast of miami"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286527/yacht-pic-2_tgdw1v.jpg"
          alt="Picture of the yacht from the back moving towards the beautiful sunset in miami"/>
      </div>
      <div>
        <img
          className="slider-image-second"
        src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286527/yacht-pic-3_osi9vb.jpg"
        alt="Picture of the back-side of the yacht, showing stairs, doorway, and the deck"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-4_bqrdgl.jpg"
          alt="Picture of the nice brown leather couch in the main room of the yacht"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286527/yacht-pic-5_t2hktk.jpg"
          alt="Picture of the main room with the leather couch, nice plush carpet, fridge, and more"/>
      </div>
      <div>
        <img
          className="slider-image-second"
        src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-6_yndqda.jpg"
        alt="The kitchen which resides in the main room of the yacht"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-7_j2du0r.jpg"
          alt="Image of the massive, well-kept and sanitized bed after every trip"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286529/yacht-pic-8_ifbgb2.jpg"
          alt="Nice dining/drinking area inside the yacht with plush blue pillows."/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-9_anzbio.jpg"
          alt="top-view of the yacht in water"/>
      </div>
      <div>
        <img
          className="slider-image-second"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1607111760/yacht-pic-10_dhh00o.jpg"
          alt="Side-profile view of the yacht"/>
      </div>
    </Slider>
  );
}

export default ImageSliderSecond;
