import React, {useEffect, useRef, useState} from "react";
import useTimer from "../component/UseTimer";
import {Lrc, useRecoverAutoScrollImmediately} from "react-lrc";
import Control from "../component/Control";
import {songsdata} from "../component/audio";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Footer from "../component/Footer";
import {Breadcrumb, List, message, Modal, Segmented, Select} from "antd";
import parse from "html-react-parser";
import {useDevice} from "../hooks/useDevice";
import {useCookies} from "react-cookie";
import dayjsInstance from "../utils/dayjs";
import toLowerCamelCase from "../utils/toLowerCamelCase";
import ReactPlayer from "react-player";
import convertTimeToMilliseconds from "../utils/convertTimeToMilliseconds";
import findMillisecond from "../utils/findMillisecond";

export default function LessonDetail() {
    const {slug} = useParams();
    const {isMobile} = useDevice();
    const location = useLocation();
    const index = location?.state?.index;

    const [story, setStory] = useState("Main Story");
    const [dataPlaylist, setdataPlaylist] = useState([]);
    const [selectedPlaylist, setPlaylist] = useState([]);
    const [options, setOptions] = useState([]);
    const navigate = useNavigate();
    const [isPlaying, setisPlaying] = useState(false);
    const [currentTime, setcurrentTime] = useState(0);
    const [songs, setSongs] = useState(songsdata);
    const [currentSong, setCurrentSong] = useState(songsdata[1]);
    const [repeatMode, setRepeatMode] = useState('off');
    const [speedMode, setSpeedMode] = useState(1);
    const [soundMode, setSoundMode] = useState(1);
    const audioElem = useRef();
    const [news, setdataNews] = useState([]);
    const [dataLesson, setdataLesson] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUserTopic, setDataUserTopic] = useState({});
    const [speedFlag, setSpeedFlag] = useState(false);
    const [timestamps, setTimestamps] = useState({});
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(1);
    const [scheduleDuration, setScheduleDuration] = useState(0);
    const [scheduleId, setScheduleId] = useState();
    const [loop, setLoop] = useState(0);
    const [next, setNext] = useState(0);


    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 4,
    });
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const {
        currentMillisecond,
        setCurrentMillisecond,
        reset,
    } = useTimer(200);

    const {
        signal,
        recoverAutoScrollImmediately
    } = useRecoverAutoScrollImmediately();

    const videoPlayerRef = useRef();

    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;
        setcurrentTime(ct * 1000);

        setCurrentSong({...currentSong, "progress": ct / duration * 100, "length": duration});
    }

    const addTimestamps = async () => {
        const temp = {};
        if (dataLesson?.mainStory) {
            temp.mainStory = await dataLesson.mainStory
                .split('\n')
                .map(el => convertTimeToMilliseconds(el.slice(1, el.indexOf(']'))));
        }
        if (dataLesson?.miniStory) {
            temp.miniStory = await dataLesson.miniStory
                .split('\n')
                .map(el => convertTimeToMilliseconds(el.slice(1, el.indexOf(']'))));
        }
        if (dataLesson?.POV) {
            temp.pOV = await dataLesson.POV.split('\n').map(el =>
                convertTimeToMilliseconds(el.slice(1, el.indexOf(']'))),
            );
        }
        if (dataLesson?.comment) {
            temp.comment = await dataLesson.comment
                .split('\n')
                .map(el => convertTimeToMilliseconds(el.slice(1, el.indexOf(']'))));
        }
        if (dataLesson?.vocabulary) {
            temp.vocabulary = await dataLesson.vocabulary
                .split('\n')
                .map(el => convertTimeToMilliseconds(el.slice(1, el.indexOf(']'))));
        }
        setTimestamps(temp);
    };

    const play = () => {
        try {
            audioElem.current.play();
            setisPlaying(true);
        } catch (e) {
            console.log(e)
        }
    };
    const pause = () => {
        try {
            audioElem.current.play().then(() => {
                audioElem.current.pause();
                setisPlaying(false);
            });
        } catch (e) {
            console.log(e)
        }
    };

    const seekToNext = async () => {
        const {nextTime} = findMillisecond(
            timestamps[toLowerCamelCase(story)],
            audioElem.current?.currentTime * 1000 || 0,
        );
        audioElem.current.currentTime = nextTime / 1000;
        videoPlayerRef?.current?.seekTo(nextTime / 1000);
        setCurrent(nextTime);
        setCount(1);
    };

    const seekToBack = async () => {
        try {
            const {previousTime} = findMillisecond(
                timestamps[toLowerCamelCase(story)],
                audioElem.current?.currentTime * 1000 || 0,
            );
            console.log(previousTime);
            audioElem.current.currentTime = previousTime / 1000;
            videoPlayerRef?.current?.seekTo(previousTime / 1000);
            setCurrent(previousTime);
            setNext(currentTime);
            setCount(1);
        } catch (e) {
            console.log(e)
        }
    };
    const getNews = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog/getAll`, {params: pagination});
            setdataNews(response?.data);
        } catch (error) {
            console.error(error);
        }
    }

    const lesson = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getBySlug/` + slug)
                .then(response => setdataLesson(response.data[0]));
        } catch (error) {
            console.error(error);
        }
    }

    const playlist = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/playlist`, {
                params: {
                    page: 1,
                    pageSize: 12,
                }, headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }
            });
            const playlists = []
            response?.data.data.forEach(el => playlists.push({value: el.id, label: el.title}))
            setdataPlaylist(playlists);
        } catch (error) {
            console.error(error);
        }
    }

    const userTopic = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/usertopic`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }
            });
            setDataUserTopic(response?.data[0]);
        } catch (error) {
            console.error(error);
        }
    }

    const changeRepeatMode = async () => {
        if (repeatMode === 'off') {
            setRepeatMode('track');
        }
        if (repeatMode === 'track') {
            setRepeatMode('one');
        }
        if (repeatMode === 'one') {
            setRepeatMode('off');
        }
    };

    const changeSpeedMode = (speed) => {
        setSpeedMode(speed);
        audioElem.current.playbackRate = speed;
    };

    const changeSoundMode = async () => {
        if (soundMode === 1) {
            setSoundMode(0);
            audioElem.current.volume = 0;
        } else if (soundMode === 0) {
            setSoundMode(0.25);
            audioElem.current.volume = 0.25;
        } else if (soundMode === 0.25) {
            setSoundMode(0.5);
            audioElem.current.volume = 0.5;
        } else if (soundMode === 0.5) {
            setSoundMode(1);
            audioElem.current.volume = 1;
        }
    };

    const handleEnded = () => {
        if (repeatMode === 'track') {
            setStory(options[options.indexOf(story) + 1]);
        }

    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const addToPlaylist = async () => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/lessonplaylist`, {
                playlist_id: selectedPlaylist,
                lesson_id: dataLesson?.id,
                track: toLowerCamelCase(story),
            }, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }
            })
            .then(() => {
                message.success("Thêm vào playlist thành công!");
                setIsModalOpen(false)
            }).catch(e => {
                console.log(e);
                message.success("Thêm vào playlist thành công!");
            })
    }

    const scheduleTurnOff = timeout => {
        const timeoutId = setTimeout(async () => {
            audioElem.current.pause();
            setisPlaying(false);
            setScheduleDuration(0);
        }, timeout * 60 * 1000);
        setScheduleId(timeoutId);
    };

    const clearScheduleTurnOff = () => {
        scheduleId && clearTimeout(scheduleId);
        setScheduleDuration(0);
    };

    const handleSchedulePress = timer => {
        if (timer !== 0) {
            scheduleTurnOff(timer);
        } else {
            clearScheduleTurnOff();
        }
        play();
    };

    useEffect(() => {
        lesson();
        getNews();
        if (cookies?.user) {
            playlist();
            userTopic();
        }
    }, []);

    useEffect(() => {
        if (isPlaying) {
            try {
                audioElem.current.play();
            } catch (e) {
                console.error(e)
            }
            // setisPlaying(true);
        }
    }, [story])

    useEffect(() => {
        addTimestamps();
        const options = [];
        if (dataLesson?.mainStory) options.push('Main Story');
        if (dataLesson?.vocabulary) options.push('Vocabulary');
        if (dataLesson?.miniStory) options.push('Mini Story');
        if (dataLesson?.POV) options.push('POV');
        if (dataLesson?.comment) options.push('Comment');
        setOptions(options);
    }, [dataLesson])

    useEffect(() => {
        console.log(loop)
        if (loop > 0 && !audioElem.current.paused) {
            if (next === 0) {
                const {currentTime, nextTime} = findMillisecond(
                    timestamps[toLowerCamelCase(story)],
                    audioElem.current?.currentTime * 1000 || 0,
                );
                console.log(currentTime, nextTime)
                setCurrent(currentTime);
                setNext(nextTime);
                console.log('next===0', current, next);
            } else {
                console.log('next!==0', current, next);
                console.log(audioElem.current?.currentTime * 1000 + 200 > next)
                console.log(count === loop || current === next)
                if (audioElem.current?.currentTime * 1000 + 200 > next) {
                    if (count === loop || current === next) {
                        const {currentTime, nextTime} = findMillisecond(
                            timestamps[toLowerCamelCase(story)],
                            audioElem.current?.currentTime * 1000 + 200,
                        );
                        setCurrent(currentTime);
                        setNext(nextTime);
                        setCount(1);
                        console.log('new next', currentTime, nextTime);

                        console.log('cleared');
                    } else {

                        videoPlayerRef?.current?.seekTo(current / 1000);
                        audioElem.current.currentTime = current / 1000;
                        setCount(count + 1);
                    }
                }
            }
        }
    }, [audioElem.current?.currentTime]);

    useEffect(() => {
        if (dataUserTopic?.lesson_id) {
            if (dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD")
                && cookies?.user?.vip_expire_at !== null
                || +dataUserTopic?.lesson_id >= +dataLesson.id || +index === 0) {

            } else {
                navigate("/");
            }
        }
        if (index === undefined) navigate("/");
    }, [cookies, dataUserTopic])

    return (
        <>
            <div className="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <Breadcrumb
                    className="py-5"
                    items={[
                        {
                            title: <a href="/">Home</a>,
                        },
                        {
                            title: <a href="/topic">Topic</a>,
                        },
                        {
                            title: <a href={"/lesson/" + dataLesson?.course_slug}>{dataLesson?.course_title}</a>,
                        },
                        {
                            title: dataLesson?.title,
                        },
                    ]}
                />
                <p className="text-4xl font-semibold text-center pt-10">{dataLesson?.title}</p>
                <Segmented
                    className="my-[20px]"
                    options={options}
                    value={story}
                    onChange={(e) => {
                        setStory(e);
                        setisPlaying(false);
                    }}
                    block/>
                <div>
                    <audio
                        src={story === "Main Story"
                            ? dataLesson?.mainStoryAudio
                            : story === "Vocabulary"
                                ? dataLesson?.vocabularyAudio
                                : story === "Mini Story"
                                    ? dataLesson?.miniStoryAudio
                                    : null
                        }
                        ref={audioElem}
                        loop={repeatMode === 'one'}
                        onTimeUpdate={onPlaying}
                        onEnded={handleEnded}
                    />
                    <div
                        className='flex justify-center'>
                        {dataLesson[toLowerCamelCase(story) + 'Video'] &&
                            <ReactPlayer url={dataLesson[toLowerCamelCase(story) + 'Video']}
                                         ref={videoPlayerRef}
                                         volume={0}
                                         playing={isPlaying}/> 
                        }
                    </div>
                    {dataLesson?.mainStory && story === "Main Story" ?
                        <>
                            <Lrc
                                className="bg-red-100 p-10 h-screen"
                                lineRenderer={({active, line: {content}}) =>
                                    (
                                        active ?
                                            <>
                                                <p active={active}
                                                   className="text-orange-500 font-bold text-xl">{content}</p>
                                            </>
                                            : <p active={active}
                                                 className="text-neutral-900 font-semibold text-xl">{content}</p>
                                    )

                                }
                                currentMillisecond={currentTime}
                                // verticalSpace
                                recoverAutoScrollSingal={signal}
                                recoverAutoScrollInterval={5000}
                                lrc={dataLesson?.mainStory}
                            />
                        </>
                        : story === "Vocabulary" ?
                            <>
                                <Lrc
                                    className="bg-red-100 p-10 h-screen"
                                    lineRenderer={({active, line: {content}}) =>
                                        (
                                            active ?
                                                <>
                                                    <p active={active}
                                                       className="text-orange-500 font-bold text-xl py-1">{content}</p>
                                                </>
                                                : <p active={active}
                                                     className="text-neutral-900 font-semibold text-xl py-1">{content}</p>
                                        )

                                    }
                                    currentMillisecond={currentTime}
                                    // verticalSpace
                                    recoverAutoScrollSingal={signal}
                                    recoverAutoScrollInterval={5000}
                                    lrc={dataLesson?.vocabulary}
                                />
                            </>
                            : dataLesson?.miniStory && story === "Mini Story" ?
                                <>
                                    <Lrc
                                        className="bg-red-100 p-10 h-screen"
                                        lineRenderer={({active, line: {content}}) =>
                                            (
                                                active ?
                                                    <>
                                                        <p active={active}
                                                           className="text-orange-500 font-bold text-xl">{content}</p>
                                                    </>
                                                    : <p active={active}
                                                         className="text-neutral-900 font-semibold text-xl">{content}</p>
                                            )

                                        }
                                        currentMillisecond={currentTime}
                                        // verticalSpace
                                        recoverAutoScrollSingal={signal}
                                        recoverAutoScrollInterval={5000}
                                        lrc={dataLesson?.miniStory}
                                    />
                                </>
                                : <></>
                    }
                    <Control
                        onPlay={play}
                        onPause={pause}
                        onSeekToNext={seekToNext}
                        onSeekToBack={seekToBack}
                        onScheduleTimeOff={handleSchedulePress}
                        onLoop={setLoop}
                        loopValue={loop}
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
                        repeatMode={repeatMode}
                        changeSpeedMode={changeSpeedMode}
                        changeSoundMode={changeSoundMode}
                        speed={speedMode}
                        isPlaylist={false}
                        openModal={openModal}
                        videoPlayerRef={videoPlayerRef}
                    />
                </div>
                {/* <div className="py-10">
                    <p className="text-3xl font-semibold text-center py-10">Learning English Tutorials And Tips</p>
                    <div className="flex justify-center">
                        {!isMobile ?
                            <List
                                grid={{
                                    xs: 24,
                                    xl: 5
                                }}
                                dataSource={news?.data}
                                renderItem={(item, index) => (
                                    <div className='mx-2 mt-4 bg-white drop-shadow p-5 w-[600px]'>
                                        <a href={"/blog/" + item?.blog_slug}
                                           className='text-2xl font-bold'>{item?.blog_title}</a>
                                        <div className='flex justify-center py-5'>
                                            <img src={item?.blog_image} className=' h-[300px] rounded'/>
                                        </div>
                                        <p className='font-semibold py-5 text-slate-600 h-20 truncate'>{parse(String(item?.blog_description))}</p>
                                        <a href={"/blog/" + item?.blog_slug} className="flex justify-center">
                                            <button className='bg-[#2ca1db] px-5 py-2 my-5 text-white font-bold'>
                                                Continue Reading
                                            </button>
                                        </a>
                                    </div>
                                )}
                            />
                            :
                            <List
                                dataSource={news?.data}
                                renderItem={(item, index) => (
                                    <div className='mx-2 mt-4 bg-white drop-shadow p-5 w-[340px]'>
                                        <a href={"/blog/" + item?.blog_slug}
                                           className='text-2xl font-bold'>{item?.blog_title}</a>
                                        <div className='flex justify-center py-5'>
                                            <img src={item?.blog_image} className=' h-[200px] rounded'/>
                                        </div>
                                        <p className='font-semibold py-5 text-slate-600 h-20 truncate'>{parse(String(item?.blog_description))}</p>
                                        <a href={"/blog/" + item?.blog_slug} className="flex justify-center">
                                            <button className='bg-[#2ca1db] px-5 py-2 my-5 text-white font-bold'>
                                                Continue Reading
                                            </button>
                                        </a>
                                    </div>
                                )}
                            />
                        }
                    </div>
                </div> */}
            </div>
            <Modal
                title="Thêm vào danh sách phát"
                style={{
                    top: 50,
                }}
                open={isModalOpen}
                onOk={addToPlaylist}
                onCancel={() => setIsModalOpen(false)}
                okText="Thêm"
                cancelText="Hủy"
                okButtonProps={{className: "bg-blue-500"}}
            >
                <p>Chọn danh sách phát:</p>
                <Select
                    style={{
                        width: 200,
                    }}
                    defaultValue={"choose Playlist"}
                    onChange={(i) => setPlaylist(i)}
                    options={dataPlaylist}
                />
            </Modal>
            {Footer()}
        </>
    );
};
