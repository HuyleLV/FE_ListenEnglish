import React, {useRef, useState} from 'react';
import play from "../component/icon/play-button-arrowhead.png"
import pause from "../component/icon/pause.png"
import next from "../component/icon/next.png"
import back from "../component/icon/back.png"
import timerIcon from "../component/icon/timer.png"
import repeatTrack from "../component/icon/repeat-track.png"
import {BarsOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import formatSecondToTime from "../utils/formatSecondToTime";
import {Dropdown} from "antd";

function Control({
                     onPlay,
                     onPause,
                     onSeekToNext,
                     onSeekToBack,
                     onScheduleTimeOff,
                     onLoop,
                     loopValue,
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
                     speed,
                     changeSoundMode,
                     isPlaylist,
                     openModal,
                     videoPlayerRef
                 }) {
    const clickRef = useRef();
    const {lesson_id} = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [soundMode, setSoundMode] = useState('volume-high');
    const navigate = useNavigate();

    const timer = [
        {
            label: '2h',
            value: 120,
        },
        {
            label: '1h 30m',
            value: 90,
        },
        {
            label: '1h',
            value: 60,
        },
        {
            label: '30m',
            value: 30,
        },
        {
            label: '15m',
            value: 15,
        },
        {
            label: 'Off',
            value: 0,
        },
    ];

    const loop = [
        {
            label: '∞',
            value: 200,
        },
        {
            label: '5',
            value: 5,
        },
        {
            label: '4',
            value: 4,
        },
        {
            label: '3',
            value: 3,
        },
        {
            label: '2',
            value: 2,
        },
        {
            label: 'Off',
            value: 0,
        },
    ];

    const speedMode = [0.5, 0.75, 1, 1.25, 1.75, 2];
    const PlayPause = () => {
        try {
            if (isPlaying === true) {
                onPause();
            } else {
                onPlay();
            }
            setisPlaying(!isPlaying);
        } catch (e) {
            console.log(e)
        }
    }
    const skipForward = (time) => {
        if (time === 'forward' && audioElem.current?.currentTime) {
            onSeekToNext();
        } else if (time === 'backward' && audioElem.current?.currentTime) {
            onSeekToBack();
        }
    }

    const checkWidth = (e) => {
        try {
            let width = clickRef.current.clientWidth;
            const offset = e.nativeEvent.offsetX;

            const divprogress = offset / width * 100;
            audioElem.current.currentTime = divprogress / 100 * currentSong.length;
            videoPlayerRef?.current?.seekTo(divprogress / 100 * currentSong.length)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="w-full flex flex-row pt-5 px-2 bg-gradient-to-r from-red-500 to-red-800 items-center">
                <p className="w-1/12 text-2xl font-semibold text-center text-white">{formatSecondToTime(audioElem.current?.currentTime || 0)}</p>
                <div className="w-10/12 bg-gray-200 h-[6px] rounded-full cursor-pointer" onClick={checkWidth}
                     ref={clickRef}>
                    <div className="w-0 h-full bg-sky-600 rounded-[30px]"
                         style={{width: `${currentSong.progress + "%"}`}}></div>
                </div>
                <p className="w-1/12 text-2xl font-semibold text-center text-white">{formatSecondToTime(currentSong?.length || 0)}</p>
            </div>
            <center>
                <div className='p-4 bg-gradient-to-r from-red-500 to-red-800 flex flex-row justify-center'>
                    <Dropdown
                        className='mx-5 h-auto rounded-full px-4 bg-orange-600 flex items-center cursor-pointer'
                        overlayStyle={{maxHeight: 400, overflow: 'auto'}}
                        menu={{
                            items: timer.map((el, i) => {
                                return {
                                    label: (<div onClick={() => {
                                        onScheduleTimeOff(el.value);
                                    }}>
                                        {el.label}
                                    </div>),
                                    key: i
                                }
                            }),
                            selectable: true,
                        }}
                    >
                        <p className='text-white text-xl font-semibold'>
                            <img src={timerIcon} className='w-10 h-10'/>
                        </p>
                    </Dropdown>
                    <Dropdown
                        className='mx-5 h-auto rounded-full px-9 bg-orange-600 flex items-center cursor-pointer'
                        overlayStyle={{maxHeight: 400, overflow: 'auto'}}
                        menu={{
                            items: speedMode.map((el, i) => {
                                return {
                                    label: (<div onClick={() => {
                                        changeSpeedMode(el);
                                    }}>
                                        {el}X
                                    </div>),
                                    key: i
                                }
                            }),
                            selectable: true,
                        }}
                    >
                        <p className="w-0 text-xl font-semibold flex item-center text-center justify-center text-white">{speed + 'X'}</p>
                    </Dropdown>
                    <button type="button" className='mx-5 rounded-full p-4 bg-orange-600'
                            onClick={() => skipForward('backward')}>
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
                    <button type="button" className='mx-5 rounded-full p-4 bg-orange-600'
                            onClick={() => skipForward('forward')}>
                        <img src={next} className='w-10 h-10'/>
                    </button>
                    <Dropdown
                        className='mx-5 h-auto rounded-full px-4 bg-orange-600 flex items-center cursor-pointer'
                        overlayStyle={{maxHeight: 400, overflow: 'auto'}}
                        menu={{
                            items: loop.map((el, i) => {
                                return {
                                    label: (<div onClick={() => {
                                        onLoop(el.value);
                                    }}>
                                        {el.label}
                                    </div>),
                                    key: i
                                }
                            }),
                            selectable: true,
                        }}
                    >
                        <p className='text-white text-xl font-semibold'>
                            <img src={repeatTrack} className='w-10 h-10'/>
                            {loopValue !== 0 && loop.find(el => el.value === loopValue).label}
                        </p>
                    </Dropdown>
                    {!isPlaylist && <button type="button" className='mx-5 rounded-full p-4 bg-orange-600'
                                            onClick={() => cookies?.user ? openModal() : navigate('/login')}>
                        <BarsOutlined className='w-10 h-10 flex justify-center text-white text-4xl font-bold'/>
                    </button>}
                </div>
            </center>
        </>
    );
}

export default Control;
