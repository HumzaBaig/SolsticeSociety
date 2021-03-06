import './VideoPlayer.css'
import React from "react";

const Video = () => {

  return (
    <div className="video-container" dangerouslySetInnerHTML={{ __html: `
      <video
        poster="https://res.cloudinary.com/dzixj0ktk/image/upload/q_100/v1607404547/SSBookings_Video_Poster_wzhvxl.svg"
        loop
        playsinline
        src="https://res.cloudinary.com/dzixj0ktk/video/upload/v1605808078/IMG_2968_eozlvg.mp4"
        class="video"
        onclick="this.paused?this.play():this.pause();"
      />
    ` }}>
    </div>

    // <div className="video-container">
    //   <video
    //        loop
    //        muted
    //        autoPlay
    //        playsInline
    //        src="https://res.cloudinary.com/dzixj0ktk/video/upload/ac_none,c_crop,g_center,h_352,q_100,w_300/v1605808078/IMG_2968_eozlvg.mp4"
    //        className="video"
    //      />
    // </div>
  );
}

export default Video;
