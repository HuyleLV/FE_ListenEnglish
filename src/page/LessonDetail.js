import { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "../component/UseTimer";
import cd from "../component/icon/cd.png"
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import Control from "../component/Control";
import { songsdata } from "../component/audio";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LessonDetail() {

    const { lesson_id } = useParams();
    const [isPlaying, setisPlaying] = useState(false);
    const [currentTime, setcurrentTime] = useState(0);
    const [songs, setSongs] = useState(songsdata);
    const [currentSong, setCurrentSong] = useState(songsdata[1]);
    const audioElem = useRef();
    
    const [dataLesson, setdataLesson] = useState([]);

    const {
      currentMillisecond,
      setCurrentMillisecond,
      reset,
      play,
      pause
    } = useTimer(4);

    const {
      signal,
      recoverAutoScrollImmediately
    } = useRecoverAutoScrollImmediately();

    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;
        setcurrentTime(ct * 1000);

        setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration });
    }

    const lesson = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getDetail/` + lesson_id)
                .then(response => setdataLesson(response.data[0]));
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        lesson();
        if (isPlaying) {
            audioElem.current.play();
        } else {
            audioElem.current.pause();
        }
    }, [isPlaying, dataLesson])

    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl text-center py-10">{dataLesson.title}</p>
            <div>
                <audio
                    src={dataLesson.mainStoryAudio}
                    ref={audioElem}
                    onTimeUpdate={onPlaying}
                />
                {dataLesson.mainStory   ?
                    <>
                        <Lrc
                            className="bg-sky-200 p-10"
                            lineRenderer={({ active, line: { content } }) =>
                                (
                                    active ? 
                                        <>
                                            <p active={active} className="text-green-600 font-bold text-xl">{content}</p>
                                        </>
                                        : <p active={active} className="text-neutral-900 font-semibold text-xl">{content}</p>
                                )

                            }
                            currentMillisecond={currentTime}
                            verticalSpace
                            recoverAutoScrollSingal={signal}
                            recoverAutoScrollInterval={5000}
                            lrc={dataLesson.mainStory}
                        />
                    </>
                    : <></>
                }
                <Control 
                    onPlay={play}
                    onPause={pause}
                    onReset={reset}
                    current={currentTime}
                    setCurrent={setcurrentTime}
                    recoverAutoScrollImmediately={recoverAutoScrollImmediately}
                    isPlaying={isPlaying}
                    setisPlaying={setisPlaying}
                    songs={songs} 
                    setSongs={setSongs}
                    audioElem={audioElem}
                    currentSong={currentSong} 
                    setCurrentSong={setCurrentSong}
                />
            </div>
        </div>
    );
};