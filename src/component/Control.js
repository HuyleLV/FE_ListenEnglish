
import React, {useRef, useState} from 'react';
import play from "../component/icon/play-button-arrowhead.png"
import pause from "../component/icon/pause.png"
import next from "../component/icon/next.png"
import back from "../component/icon/back.png"
import volumeHigh from "../component/icon/volume-high.png"
import volumeLow from "../component/icon/volume-low.png"
import volumeMedium from "../component/icon/volume-medium.png"
import volumeMute from "../component/icon/volume-mute.png"
import repeatOff from "../component/icon/repeat-off.png"
import repeatOne from "../component/icon/repeat-one.png"
import repeatTrack from "../component/icon/repeat-track.png"
import { BarsOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import formatSecondToTime from "../utils/formatSecondToTime";

function Control({
  onPlay,
  onPause,
  onReset,
  current,
  setCurrent, changeRepeatMode,
  recoverAutoScrollImmediately,
  isPlaying,
  setisPlaying,
  songs,
  setSongs,
  audioElem,
  currentSong,
  setCurrentSong,
  repeatMode,
  changeSpeedMode,
  changeSoundMode,
  isPlaylist,
  openModal
}) {
  const clickRef = useRef();
  const { lesson_id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [soundMode, setSoundMode] = useState('volume-high');


  const PlayPause = () => {
    try {
      if (isPlaying === true){
        audioElem.current.pause();
        onPause();
      }else {
        audioElem.current.play();
        onPlay();
      }
      setisPlaying(!isPlaying);
    } catch (e) {
      console.log(e)
    }
  }
  const skipForward = (time) => {
    if (time === 'forward' && audioElem.current?.currentTime){
      audioElem.current.currentTime = audioElem.current.currentTime + 10;
    }else if(time === 'backward' && audioElem.current?.currentTime) {
      audioElem.current.currentTime = audioElem.current.currentTime - 10;
    }
  }


  const createPlaylist = () => {
    const value = {
      user_id: cookies?.user?.id,

    }
  }

  const checkWidth = (e)=>
  {
    try {
      let width = clickRef.current.clientWidth;
      const offset = e.nativeEvent.offsetX;

      const divprogress = offset / width * 100;
      audioElem.current.currentTime = divprogress / 100 * currentSong.length;
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="w-full flex flex-row pt-5 px-2 bg-gradient-to-r from-red-500 to-red-800 items-center">
        <p className="w-1/12 text-2xl font-semibold text-center text-white">{formatSecondToTime(audioElem.current?.currentTime || 0)}</p>
        <div className="w-10/12 bg-gray-200 h-[6px] rounded-full cursor-pointer" onClick={checkWidth} ref={clickRef}>
          <div className="w-0 h-full bg-sky-600 rounded-[30px]" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
        <p className="w-1/12 text-2xl font-semibold text-center text-white">{formatSecondToTime(currentSong?.length || 0)}</p>
      </div>
      <center>
        <div className='p-4 bg-gradient-to-r from-red-500 to-red-800 flex flex-row justify-center'>
          <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={changeRepeatMode}>
            <img src={repeatMode === 'off' ? repeatOff : repeatMode === 'track' ? repeatTrack : repeatOne} className='w-10 h-10'/>
          </button>
          <button type="button" className='mx-5 h-auto rounded-full px-9 bg-orange-600 items-center' onClick={changeSpeedMode}>
            <p className="w-0 text-xl font-semibold flex item-center text-center justify-center text-white">{audioElem.current?.playbackRate+'X'}</p>
          </button>
          <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={() => skipForward('backward')}>
            <img src={back} className='w-10 h-10'/>
          </button>
          {isPlaying ?
            <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={PlayPause}>
              <img src={pause} className='w-10 h-10'/>
            </button>
            :
            <button type="button" className='mx-5 bg-orange-600 p-4 rounded-full' onClick={PlayPause}>
              <img src={play} className='w-10 h-10'/>
            </button>
          }
          <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={() => skipForward('forward')}>
            <img src={next} className='w-10 h-10'/>
          </button>
          <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={changeSoundMode}>
            <img src={audioElem.current?.volume === 1 ? volumeHigh : audioElem.current?.volume === 0.25 ? volumeLow : audioElem.current?.volume === 0.5 ? volumeMedium : volumeMute} className='w-10 h-10'/>
          </button>
          {!isPlaylist && <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={openModal}>
            <BarsOutlined className='w-10 h-10 flex justify-center text-white text-4xl font-bold'/>
          </button>}
        </div>
      </center>
    </>
  );
}

export default Control;
