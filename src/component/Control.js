
import React, { useRef } from 'react';
import play from "../component/icon/play-button-arrowhead.png"
import pause from "../component/icon/pause.png"

function Control({
  onPlay,
  onPause,
  onReset,
  current,
  setCurrent,
  recoverAutoScrollImmediately,
  isPlaying,
  setisPlaying
}) {
  const clickRef = useRef();

  const PlayPause = () => {
    if (isPlaying === true){
      onPause();
    }else {
      onPlay();
    }
    setisPlaying(!isPlaying);
  }

  // const checkWidth = (e)=>
  // {
  //   let width = clickRef.current.clientWidth;
  //   const offset = e.nativeEvent.offsetX;

  //   const divprogress = offset / width * 100;
  //   audioElem.current.currentTime = divprogress / 100 * currentSong.length;

  // }

  return (
    <center>
      {/* <div className="navigation">
        <div className="navigation_wrapper" onClick={checkWidth} ref={clickRef}>
          <div className="seek_bar" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
      </div> */}
      {isPlaying ?
        <button type="button" className='rounded-full p-4 bg-sky-600' onClick={PlayPause}>
          <img src={pause} className='w-10 h-10'/>
        </button>
        :
        <button type="button" className='mx-10 bg-sky-600 p-4 rounded-full' onClick={PlayPause}>
          <img src={play} className='w-10 h-10'/>
        </button>
      }
      <button type="button" className='bg-red-100 p-4 rounded-full' onClick={onReset}>
        reset
      </button>
      <input
        type="number"
        value={current}
        className='px-10'
        onChange={(event) => setCurrent(Number(event.target.value))}
      />
      <button type="button" onClick={recoverAutoScrollImmediately}>
        recover auto scroll immediately
      </button>
    </center>
  );
}

export default Control;
