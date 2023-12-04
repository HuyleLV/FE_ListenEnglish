import { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "../component/UseTimer";
import cd from "../component/icon/cd.png"
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import Control from "../component/Control";

export default function LessonDetail() {

    const [isPlaying, setisPlaying] = useState(false);
    const [currentTime, setcurrentTime] = useState(0);
    const audioElem = useRef();

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
        console.log(ct)

        // setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration });
    }

    useEffect(() => {
        if (isPlaying) {
            audioElem.current.play();
        } else {
            audioElem.current.pause();
        }
    }, [isPlaying])

    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl text-center py-10">Lear read English</p>
            <div>
                <audio
                    src="https://6a63fca904fd268f15f7-d5770ffdd579eb31eaa89faeffc55fe7.ssl.cf1.rackcdn.com/LE_listening_A2_Morning_briefing.mp3"
                    ref={audioElem}
                    onTimeUpdate={onPlaying}
                    controls
                />
                <Control
                    onPlay={play}
                    onPause={pause}
                    onReset={reset}
                    current={currentTime}
                    setCurrent={setcurrentTime}
                    recoverAutoScrollImmediately={recoverAutoScrollImmediately}
                    isPlaying={isPlaying}
                    setisPlaying={setisPlaying}
                />
                <Lrc
                    lineRenderer={({ active, line: { content } }) =>
                        (
                            active ? <p active={active} className="text-green-600 font-bold">{content}</p>
                                : <p active={active} className="text-neutral-900">{content}</p>
                        )

                    }
                    currentMillisecond={currentTime}
                    verticalSpace
                    recoverAutoScrollSingal={signal}
                    recoverAutoScrollInterval={5000}
                    lrc={
                        `[00:08.00]Hi, everyone.
[00:10.23]I know you're all busy so I'll keep this briefing quick.
[00:16.17]I have some important information about a change in the management team.
[00:19.75]As you already know, our head of department, James Watson, is leaving his position at the end of this week.
[00:23.37]His replacement is starting at the end of the next month.`
                    }
                />
            </div>
        </div>
    );
};