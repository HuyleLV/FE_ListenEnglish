import React from 'react';
import play from "../component/icon/play-button-arrowhead.png"
import pause from "../component/icon/pause.png"
import next from "../component/icon/next.png"
import back from "../component/icon/back.png"
import {Dropdown} from "antd";

function ControlListening({onPlay, onPause, setIsPlaying, isPlaying, audioElem, changeSpeedMode, active, setActive, timestamp, setTextInput, setShowAnswer}) {
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

    return (
        <div>
            <center>
                <div className='p-4 bg-gradient-to-r from-red-500 to-red-800 flex flex-row justify-center'>
                    <button type="button" className='w-32 mx-5 h-auto px-9 items-center' onClick={changeSpeedMode}
                    >
                        <p className="w-0 text-xl font-semibold flex item-center text-center justify-center text-white">{audioElem.current?.playbackRate + 'X'}</p>
                    </button>
                    <button type="button" className='mx-5 rounded-full p-4'
                            onClick={() => {
                                setActive(active - 1 < 0 ? 0 : (active - 1) % (timestamp?.length || 0));
                                setTextInput('');
                                setShowAnswer(false);
                                onPause();
                            }}>
                        <img src={back} className='w-10 h-10'/>
                    </button>
                    {isPlaying ?
                        <button type="button" className='mx-5 p-4' onClick={PlayPause}>
                            <img src={pause} className='w-10 h-10'/>
                        </button>
                        :
                        <button type="button" className='mx-5 p-4' onClick={PlayPause}>
                            <img src={play} className='w-10 h-10'/>
                        </button>
                    }
                    <button type="button" className='mx-5 rounded-full p-4' onClick={() => {
                        setActive((active + 1) % (timestamp?.length || 0));
                        setTextInput('');
                        setShowAnswer(false);
                        onPause();
                    }}>
                        <img src={next} className='w-10 h-10'/>
                    </button>
                    <Dropdown
                        className='w-32 mx-5 px-9 flex items-center cursor-pointer'
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
                        <p className='text-white text-xl font-semibold'>
                            {active + 1}/{timestamp?.length || 0}
                        </p>
                    </Dropdown>
                </div>
            </center>
        </div>
    );
}

export default ControlListening;
