import React from "react";
import CircleLoader from "react-spinners/CircleLoader";
import './Loading.css';

const LoadingScreen = () => {
  return (
    <div className="loadingspinner">
      <img className="loading-logo" src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605043517/IMG_2406_sjhx0h.png" alt="Solstice Society Logo" />
      <CircleLoader
        size={50}
        color={"#f9c947"}
      />
      <div className="slogan-holder">
        <h2 className="mini-slogan">Welcome to</h2>
        <h1 className="large-slogan">THE SOCIETY</h1>
      </div>
    </div>
  );
}


export default LoadingScreen;
