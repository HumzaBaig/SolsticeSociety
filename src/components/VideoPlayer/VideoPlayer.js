import './VideoPlayer.css'
import React from "react";

const Video = () => {

  return (
    // <div className="video-container" dangerouslySetInnerHTML={{ __html: `
    //   <video
    //     loop
    //     muted
    //     autoplay
    //     playsinline
    //     src="https://res.cloudinary.com/dzixj0ktk/video/upload/ac_none,c_crop,g_center,h_352,q_100,w_300/v1605808078/IMG_2968_eozlvg.mp4"
    //     class="video"
    //   />
    // ` }}>
    // </div>

    <div className="video-container">
      <video
           loop
           muted
           autoPlay
           playsInline
           src="https://res.cloudinary.com/dzixj0ktk/video/upload/v1605808078/IMG_2968_eozlvg.mp4"
           className="video"
         />
    </div>
  );
}

export default Video;
