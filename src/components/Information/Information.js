import './Information.css';
import React from 'react';
import ImageSliderSecond from '../ImageSlider/ImageSliderSecond';

const InformationSection = () => {
  return (
    <>
      <h2 className="cta-text left-text">Specifications:</h2>
      <ImageSliderSecond />
      <div className="info-container">
        <p className="info-text left-text">
          47ft x 14ft (50 with the swim platform) flybridge - year 2002, 660 hsp, Carver 410 sport sedan.
        </p>
        <p className="info-text left-text">
          50ft carver in beautiful condition with all of the features needed plus:
        </p>
        <ul className="info-text">
          <li>Loud PA system setup with large subwoofer</li>
          <li>LED light setup</li>
          <li>Full bar setup</li>
          <li>Towels, coolers, cups, plates, ice all provided</li>
          <li>Powerful humidifiers for indoor smoking</li>
          <li>Large 8-person lounge island with canopy</li>
          <li>Large gangplank</li>
          <li>Floating beer pong</li>
          <li>Floating hammock chairs</li>
          <li>Floating unicorn</li>
          <li>2 large stand-inside, walk-on-water floating balls</li>
        </ul>
        <p className="info-text left-text">
          All features EXCLUSIVE to this carver only!
        </p>
        <p className="info-text left-text">
          Boat comes with full service (3 crew members, 1 airplane steward) to accommodate you so you won’ t have to worry about anything but having a great time aboard!
        </p>
        <p className="info-text left-text">
          * Tips are appreciated, but not mandatory *
        </p>
      </div>
      <br />
      <br />
    </>
  );
}

export default InformationSection;
