import React from "react";
import CircleLoader from "react-spinners/CircleLoader";
import './Loading.css';

function LoadingScreen() {
  return (
    <div className="loadingspinner">
      <img className="loading-logo" src="https://res.cloudinary.com/dzixj0ktk/image/upload/v1605043517/IMG_2406_sjhx0h.png" alt="Solstice Society Logo" />
      <CircleLoader
        size={50}
        color={"#f9c947"}
      />
    <h1 className="slogan">Welcome to the Society.</h1>
    </div>
  );
}


export default LoadingScreen;
