import React, { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "../component/UseTimer";
import cd from "../component/icon/cd.png"
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import Control from "../component/Control";
import { songsdata } from "../component/audio";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Footer from "../component/Footer";
import {Breadcrumb, Col, List, message, Modal, Row, Select} from "antd";
import parse from "html-react-parser";
import { useDevice } from "../hooks/useDevice";
import { useCookies } from "react-cookie";
import dayjsInstance from "../utils/dayjs";
import { Segmented } from 'antd';
import toCamelCase from "../utils/toCamelCase";
import toLowerCamelCase from "../utils/toLowerCamelCase";

export default function LessonDetail() {

    const { slug } = useParams();
    const { isMobile } = useDevice();
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

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 4,
      });
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const {
        currentMillisecond,
        setCurrentMillisecond,
        reset,
        play,
        pause
    } = useTimer(200);

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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/playlist`, {params: {
            page: 1,
            pageSize: 12,
          }, headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }});
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

    const changeSpeedMode = () => {
        const playbackRate = audioElem.current?.playbackRate;
        if (speedMode !== 2 && playbackRate !== undefined) {
            if (playbackRate === 0.5) {
                setSpeedMode(speedMode+0.5);
                audioElem.current.playbackRate = audioElem.current.playbackRate + 0.5;
            } else {
                setSpeedMode(speedMode+0.25);
                audioElem.current.playbackRate = audioElem.current.playbackRate + 0.25;
            }
        } else if (playbackRate !== undefined) {
            setSpeedMode(0.5);
            audioElem.current.playbackRate = 0.5;
        }
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
        if(repeatMode === 'track') {
            setStory(options[options.indexOf(story)+1]);
        };
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

    // useEffect(() => {
    //     if (isPlaying) {
    //         audioElem.current.play();
    //     } else {
    //         audioElem.current.pause();
    //     }
    // }, [isPlaying, dataLesson])

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
            }catch (e) {
                console.error(e)
            }
            // setisPlaying(true);
        }
    }, [story])

    useEffect(() => {
        const options = [];
        if (dataLesson?.mainStory) options.push('Main Story');
        if (dataLesson?.vocabulary) options.push('Vocabulary');
        if (dataLesson?.miniStory) options.push('Mini Story');
        if (dataLesson?.POV) options.push('POV');
        if (dataLesson?.comment) options.push('Comment');
        setOptions(options);
    }, [dataLesson])

    useEffect(() => {
        if (dataUserTopic?.lesson_id) {
            if(dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD")
                && cookies?.user?.vip_expire_at !== null
                || +dataUserTopic?.lesson_id >= +dataLesson.id || +index === 0){

            } else {
                navigate("/");
            }
        }
        if (index === undefined) navigate("/");
    }, [cookies, dataUserTopic])

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
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
                            title: <a href={"/lesson/" + dataLesson?.topic_slug}>{dataLesson?.topic_title}</a>,
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
                    onChange={(e)=> {
                        setStory(e);
                        setisPlaying(false);
                    }}
                    block />
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
                    {dataLesson?.mainStory && story === "Main Story"  ?
                        <>
                            <Lrc
                                className="bg-red-100 p-10 h-screen"
                                lineRenderer={({ active, line: { content } }) =>
                                    (
                                        active ?
                                            <>
                                                <p active={active} className="text-orange-500 font-bold text-xl">{content}</p>
                                            </>
                                            : <p active={active} className="text-neutral-900 font-semibold text-xl">{content}</p>
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
                                lineRenderer={({ active, line: { content } }) =>
                                    (
                                        active ?
                                            <>
                                                <p active={active} className="text-orange-500 font-bold text-xl">{content}</p>
                                            </>
                                            : <p active={active} className="text-neutral-900 font-semibold text-xl">{content}</p>
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
                                lineRenderer={({ active, line: { content } }) =>
                                    (
                                        active ?
                                            <>
                                                <p active={active} className="text-orange-500 font-bold text-xl">{content}</p>
                                            </>
                                            : <p active={active} className="text-neutral-900 font-semibold text-xl">{content}</p>
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
                        onReset={reset}
                        current={currentTime}
                        setCurrent={setcurrentTime}
                        changeRepeatMode={changeRepeatMode}
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
                        isPlaylist={false}
                        openModal={openModal}
                    />
                </div>
                <div className="py-10">
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
                                        <a href={"/blog/" + item?.blog_slug} className='text-2xl font-bold'>{item?.blog_title}</a>
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
                                        <a href={"/blog/" + item?.blog_slug} className='text-2xl font-bold'>{item?.blog_title}</a>
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
                </div>
            </div>
            <Modal
                title="Thêm vào danh sách phát"
                style={{
                    top: 50,
                }}
                open={isModalOpen}
                onOk={addToPlaylist}
                onCancel={()=>setIsModalOpen(false)}
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
                    onChange={(i)=>setPlaylist(i)}
                    options={dataPlaylist}
                />
            </Modal>
            {Footer()}
        </>
    );
};
