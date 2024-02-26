
import React, { useRef } from 'react';
import play from "../component/icon/play-button-arrowhead.png"
import pause from "../component/icon/pause.png"
import next from "../component/icon/next.png"
import back from "../component/icon/back.png"
import { BarsOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Control({
  onPlay,
  onPause,
  onReset,
  current,
  setCurrent,
  recoverAutoScrollImmediately,
  isPlaying,
  setisPlaying,
  songs,
  setSongs,
  audioElem,
  currentSong,
  setCurrentSong
}) {
  const clickRef = useRef();
  const { lesson_id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const PlayPause = () => {
    if (isPlaying === true){
      onPause();
    }else {
      onPlay();
    }
    setisPlaying(!isPlaying);
  }

  const createPlaylist = () => {
    const value = {
      user_id: cookies?.user?.id,
      
    }
  }

  const checkWidth = (e)=>
  {
    let width = clickRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = offset / width * 100;
    audioElem.current.currentTime = divprogress / 100 * currentSong.length;
  }

  return (
    <>
      <div className="w-full pt-5 px-2 bg-gradient-to-r from-red-500 to-red-800">
        <div className="min-w-full bg-gray-200 h-[6px] rounded-full cursor-pointer" onClick={checkWidth} ref={clickRef}>
          <div className="w-0 h-full bg-sky-600 rounded-[30px]" style={{width: `${currentSong.progress+"%"}`}}></div>
        </div>
      </div>
      <center>
        <div className='p-4 bg-gradient-to-r from-red-500 to-red-800'>
          <button type="button" className='rounded-full p-4 bg-orange-600' onClick={PlayPause}>
            <img src={back} className='w-10 h-10'/>
          </button>
          {isPlaying ?
            <button type="button" className='mx-10 rounded-full p-4 bg-orange-600' onClick={PlayPause}>
              <img src={pause} className='w-10 h-10'/>
            </button>
            :
            <button type="button" className='mx-10 bg-orange-600 p-4 rounded-full' onClick={PlayPause}>
              <img src={play} className='w-10 h-10'/>
            </button>
          }
          <button type="button" className='rounded-full p-4 bg-orange-600' onClick={PlayPause}>
            <img src={next} className='w-10 h-10'/>
          </button>
          <button type="button" className='float-right rounded-full p-4 bg-orange-600'>
            <BarsOutlined className='w-10 h-10 flex justify-center text-white text-4xl font-bold'/>
          </button>
        </div>
      </center>
    </>
  );
}

export default Control;
