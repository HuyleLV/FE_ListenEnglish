import React, {useEffect, useRef, useState} from 'react';
import play from "../component/icon/play.svg"
import pause from "../component/icon/pause.svg"
import next from "../component/icon/next.svg"
import back from "../component/icon/back.svg"
import {Dropdown} from "antd";
import {SPEED_MODE} from "../mocks";
import findMillisecond from "../utils/findMillisecond";

function ControlListening({onPlay, onPause, setIsPlaying, isPlaying, audioElem, changeSpeedMode, speed, active, setActive, timestamp, setTextInput, setShowAnswer, data}) {
    const [width, setWidth] = useState(0);
    const PlayPause = async () => {
        try {
            if (isPlaying === true) {
                onPause();
            } else {
                onPlay(active);
            }
            setIsPlaying(!isPlaying);
        } catch (e) {
            console.log(e)
        }
    }
    const clickRef = useRef();

    const checkWidth = (e) => {
        try {
            let width = clickRef.current.clientWidth;
            const offset = e.nativeEvent.offsetX;

            const divprogress = offset / width * 100; //30% duration 10s
            const {currentTime, nextTime} = findMillisecond(
                timestamp || [],
                audioElem.current?.currentTime * 1000 || 0,
            );
            audioElem.current.currentTime = divprogress / 100 * (nextTime - currentTime) / 1000 + currentTime / 1000;
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const {currentTime, nextTime} = findMillisecond(
            timestamp || [],
            audioElem.current?.currentTime * 1000 || 0,
        );
        const progress = audioElem?.current ? (audioElem.current.currentTime - currentTime / 1000) / ((nextTime - currentTime) / 1000) * 100 : 0;
        setWidth(progress);
    }, [active, audioElem?.current?.currentTime])


    return (
        <div>
            <div>
                <div className='flex'>
                    <button type="button" className='p-4'
                            onClick={() => {
                                setActive(active - 1 < 0 ? 0 : (active - 1) % (timestamp?.length || 0));
                                setTextInput('');
                                setShowAnswer(false);
                                onPause();
                            }}>
                        <img src={back} className='w-5 h-5'/>
                    </button>
                    <Dropdown
                        className='flex items-center cursor-pointer'
                        overlayStyle={{maxHeight: 400, overflow: 'auto'}}
                        menu={{
                            items: timestamp?.map((el, i) => {
                                return {
                                    label: (<div onClick={() => {
                                        setActive(i);
                                        setTextInput('');
                                        setShowAnswer(false);
                                        onPause();
                                    }}>
                                        {i + 1}
                                    </div>),
                                    key: i
                                }
                            }),
                            selectable: true,
                        }}
                    >
                        <p className='text-xl font-semibold'>
                            {active + 1}/{timestamp?.length || 0}
                        </p>
                    </Dropdown>
                    <button type="button" className='p-4' onClick={() => {
                        setActive((active + 1) % (timestamp?.length || 0));
                        setTextInput('');
                        setShowAnswer(false);
                        onPause();
                    }}>
                        <img src={next} className='w-5 h-5'/>
                    </button>
                </div>
                <div className='flex justify-center'>
                    <button type="button" className='mr-4' onClick={PlayPause}>
                        <div className='p-4 rounded border'>
                            <img src={isPlaying ? pause : play} className='w-3'/>
                        </div>
                    </button>
                    <div className="w-64 flex px-2 items-center justify-center">
                        <div className="w-full bg-gray-200 h-[6px] rounded-full cursor-pointer" onClick={checkWidth}
                             ref={clickRef}>
                            <div className="w-0 h-full bg-sky-600 rounded-[30px]"
                                 style={{width: `${width + "%"}`}}></div>
                        </div>
                    </div>
                    <Dropdown
                        className='mx-5 flex items-center cursor-pointer'
                        overlayStyle={{maxHeight: 400, overflow: 'auto'}}
                        menu={{
                            items: SPEED_MODE.map((el, i) => {
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
                        <div>
                            <div className='py-2 px-4 rounded border'>
                                <p className="text-xs">{speed + 'X'}</p>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

export default ControlListening;
