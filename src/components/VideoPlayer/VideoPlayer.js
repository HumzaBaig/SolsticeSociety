import './VideoPlayer.css'
import React from "react";

const Video = () => {

  return (
    <div className="video-container" dangerouslySetInnerHTML={{ __html: `
      <video
        loop
        muted
        autoplay
        playsinline
        src="https://res.cloudinary.com/dzixj0ktk/video/upload/ac_none/v1605808078/IMG_2968_eozlvg.mp4"
        class="video"
      />
    ` }}>
    </div>
  );
}

export default Video;
