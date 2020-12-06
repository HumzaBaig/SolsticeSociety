import  React, { useState } from  'react'
import  Lottie  from  'lottie-web-react'

const  renderer ='svg'
const  rendererSettings = {
  preserveAspectRatio:  'xMinYMin slice',
}

const Animation = (props) => {
const [playingState, setPlayingState] = useState('play')
const [autoplay, setAutoplay] = useState(false)
const [loop, setLoop] = useState(false)
const [path, setPath] = useState(props.path)
const [speed, setSpeed] = useState(.75)
const [direction, setDirection] = useState(1)

return (
  <Lottie
    options={{
      renderer:  renderer,
      loop:  loop,
      autoplay:  autoplay,
      path:  path,
      rendererSettings:  rendererSettings
    }}
    playingState={playingState}
    speed={speed}
    direction={direction}
  />
)
}
export  default  Animation
