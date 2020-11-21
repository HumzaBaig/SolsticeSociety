import React from "react";
import Slider from "react-slick";
import './ImageSlider.css';

const ImageSlider = () => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      <div>
        <video autoPlay muted className="slider-image">
          <source src="https://res.cloudinary.com/dzixj0ktk/video/upload/v1605808078/IMG_2968_eozlvg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
        </video>
      </div>
      <div>
        <img
          className="slider-image"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286529/yacht-pic_lc1fu1.jpg"
          alt="First Picture of Yacht"/>
      </div>
      <div>
        <img
          className="slider-image"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286527/yacht-pic-2_tgdw1v.jpg"
          alt="Second Picture of Yacht"/>
      </div>
      <div>
        <img
          className="slider-image"
        src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286527/yacht-pic-3_osi9vb.jpg"
        alt="Third Picture of Yacht"/>
      </div>
      <div>
        <img
          className="slider-image"
          src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605286528/yacht-pic-9_anzbio.jpg"
          alt="Nineth Picture of Yacht"/>
      </div>
    </Slider>
  );
}

export default ImageSlider;
