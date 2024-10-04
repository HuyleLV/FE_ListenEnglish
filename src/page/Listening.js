import React, {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Breadcrumb, Button, Form, Progress, Segmented} from "antd";
import {useCookies} from "react-cookie";
import dayjsInstance from "../utils/dayjs";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import {AudioFilled, EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {songsdata} from "../component/audio";
import convertTimeToMilliseconds from "../utils/convertTimeToMilliseconds";
import toLowerCamelCase from "../utils/toLowerCamelCase";
import ControlListening from "../component/ControlListening";
import {createUserListening, getUserListening} from "../apis/userListening";
import {ModalListeningSetting} from "../component/Listening/Modal";

export default function Listening() {

    const {slug} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const index = location?.state?.index;
    const [form] = Form.useForm();
    const audioElem = useRef();


    const [dataLesson, setdataLesson] = useState({});
    const [options, setOptions] = useState([]);
    const [story, setStory] = useState("Main Story");
    const [dataUserListening, setDataUserListening] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [isPlaying, setisPlaying] = useState(false);
    const [currentTime, setcurrentTime] = useState(0);
    const [currentSong, setCurrentSong] = useState(songsdata[1]);
    const [speedMode, setSpeedMode] = useState(1);
    const [speedFlag, setSpeedFlag] = useState(false);
    const [active, setActive] = useState(0);
    const [timestamps, setTimestamps] = useState({});
    const [duration, setDuration] = useState(0);
    const [count, setCount] = useState(1);
    const [replay, setReplay] = useState(1);
    const [timeReplay, setTimeReplay] = useState(0.5);
    const [timeoutPlay, setTimeoutPlay] = useState(null);
    const [lyric, setLyric] = useState([]);


    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const {
        transcript,
        listening,
    } = useSpeechRecognition();

    useEffect(() => {
        lesson();
        userListening();
    }, []);

    useEffect(() => {
        if (dataUserListening?.lesson_id) {
            if (dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD")
                && cookies?.user?.vip_expire_at !== null
                || +dataUserListening?.lesson_id >= +dataLesson.id || +index === 0) {

            } else {
                navigate("/");
            }
        }
        if (index === undefined || !cookies?.user) navigate("/login");
    }, [cookies])

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
        try {
            if (duration > 0 && count <= replay) {
                const timeoutPlayId = setTimeout(() => {
                    audioElem.current.play().then(() => {
                        audioElem.current.pause();
                    });


                    if (count === replay) {
                        setisPlaying(false);
                        setDuration(0);
                        setCount(1);
                    } else {
                        const timeout = setTimeout(async () => {
                            console.log('timeout');
                            await play(active);
                            setCount(count + 1);
                            clearTimeout(timeout);
                        }, timeReplay * 1000);
                    }
                    clearTimeout(timeoutPlayId);
                }, duration * 1000 / speedMode);
                setTimeoutPlay(timeoutPlayId);
            }
        } catch (e) {
            console.log(e)
        }
    }, [duration, count]);

    useEffect(() => {
        form.resetFields();
    }, [active])

    useEffect(() => {
        handleLyric(toLowerCamelCase(story));
    }, [story, dataLesson])

    useEffect(() => {
        if (!listening) {
            form.setFieldsValue({
                text: transcript
            });
        }
    }, [listening])

    const handleLyric = (track) => {
        const startIndex = dataLesson[track]?.indexOf(']') + 1 || 0;
        const lyric = dataLesson[track]?.split('\n')
            .map(el => el.slice(startIndex));
        setLyric(lyric);
    }
    const lesson = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getBySlug/` + slug)
                .then(response => setdataLesson(response.data[0]));
        } catch (error) {
            console.error(error);
        }
    }

    const userListening = async () => {
        const response = await getUserListening(cookies?.user?.token);
        setDataUserListening(response);
    }

    const onSubmit = async (values) => {
        if (values.text && values.text !== '') {
            await createUserListening({
                lesson_id: dataLesson.id,
                position: active,
                track: toLowerCamelCase(story),
                lyric: lyric[active],
                text: values.text,
            }, cookies?.user?.token)
            console.log(JSON.stringify({
                lesson_id: dataLesson.id,
                position: active,
                track: toLowerCamelCase(story),
                lyric: lyric[active],
                text: values.text,
            }))
            await userListening();
        }
        setShowAnswer(!showAnswer)
        await stopMic();
    }

    const onPlaying = () => {
        const duration = audioElem.current.duration;
        const ct = audioElem.current.currentTime;
        setcurrentTime(ct * 1000);

        setCurrentSong({...currentSong, "progress": ct / duration * 100, "length": duration});
    }

    const changeSpeedMode = () => {
        const playbackRate = audioElem.current?.playbackRate;
        if (playbackRate) {
            if (!speedFlag || speedMode === 2) {
                setSpeedFlag(true);
                setSpeedMode(0.5);
                audioElem.current.playbackRate = 0.5;
            } else {
                audioElem.current.playbackRate = speedMode + 0.25;
                setSpeedMode(speedMode + 0.25);
            }
        }
    };

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

    const play = async index => {
        try {
            audioElem.current.currentTime =
                timestamps[toLowerCamelCase(story)][index] / 1000;
            audioElem.current.play();
            const endTime = timestamps[toLowerCamelCase(story)][index + 1] / 1000 ? timestamps[toLowerCamelCase(story)][index + 1] / 1000 : active + 1 === timestamps[toLowerCamelCase(story)].length
                ? audioElem.current.duration
                : 0;
            const duration =
                endTime - timestamps[toLowerCamelCase(story)][index] / 1000;

            setDuration(duration);
        } catch (e) {
            console.log(e)
        }
    };

    const pause = () => {
        try {
            audioElem.current.play().then(() => {
                audioElem.current.pause();
                setisPlaying(false);
                setDuration(0);
                setCount(1);
                clearTimeout(timeoutPlay);
            });
        } catch (e) {
            console.log(e)
        }
    };

    const handleChangeStory = (e) => {
        setStory(e);
        setActive(0);
        setisPlaying(false)
    }

    const clickMic = async () => {
        await SpeechRecognition.startListening();
    }

    const stopMic = async () => {
        await SpeechRecognition.stopListening();
    }


    return (
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
                onChange={(e) => handleChangeStory(e)}
                block/>
            <div className="bg-white drop-shadow px-10 pb-10 flex flex-col items-center">
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
                    onTimeUpdate={onPlaying}
                />
                <div className='w-full flex justify-end'>

                    <ModalListeningSetting replay={replay} timeReplay={timeReplay} setReplay={setReplay} setTimeReplay={setTimeReplay}/>
                </div>
                <div className='h-20'>
                    {showAnswer && (
                        <Progress className="flex justify-center font-bold" size={64} type="circle" percent={dataUserListening
                            ?.filter(el => el.track === toLowerCamelCase(story))
                            ?.find(el => el.position === active)?.point || 0}
                        />
                    )}
                </div>
                <Form
                    layout={"vertical"}
                    className='w-1/2'
                    colon={false}
                    form={form}
                    onFinishFailed={(e) => console.log(e)}
                    onFinish={onSubmit}
                >
                    <Form.Item
                        name="text"
                    >
                        <TextArea
                            placeholder="Type what you hear..."
                            autoSize={{minRows: 3, maxRows: 6}}
                            size='large'
                            iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                        />
                    </Form.Item>
                    <div className='h-32'>
                        {showAnswer && (
                            <>
                                <p className="font-bold text-xl"
                                   style={{color: 'green'}}>
                                    {dataUserListening
                                        ?.filter(el => el.track === toLowerCamelCase(story))
                                        ?.find(el => el.position === active)?.text}
                                </p>
                                <div>
                                    {lyric && lyric[active]?.split(' ')?.map((word, i) => {
                                        return (
                                            <span className="font-bold text-xl"
                                                  key={i}
                                                  style={{
                                                      color: dataUserListening
                                                          ?.filter(el => el.track === toLowerCamelCase(story))
                                                          ?.find(lis => +lis.position === active)
                                                          ?.text.replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '')
                                                          .toLowerCase()
                                                          .split(' ')
                                                          .includes(
                                                              word
                                                                  .replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '')
                                                                  .toLowerCase(),
                                                          )
                                                          ? 'green'
                                                          : 'red',
                                                  }}>
                                                {word + ' '}
                                            </span>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                    <div className='flex justify-center'>
                        {!showAnswer && (
                            <div className='flex'>
                                <div className='mx-5 p-4'></div>
                                <Button type={"primary"} htmlType={"submit"} size='large' className="bg-blue-500 mt-4">
                                    Check
                                </Button>
                                <button type="button" className='mx-5 p-4'
                                        onClick={!listening ? clickMic : stopMic}
                                >
                                    <AudioFilled style={{fontSize: 30}} className='w-10 h-10 justify-center' style={{color: listening ? "#EA580C" : 'black'}}/>
                                </button>
                            </div>
                        )}
                    </div>
                </Form>
                {showAnswer && (
                    <div className='p-4 mx-5'>
                        <Button size='large' onClick={() => setShowAnswer(false)}>
                            Hide answer
                        </Button>
                    </div>
                )}
            </div>
            <ControlListening
                onPlay={play}
                onPause={pause}
                isPlaying={isPlaying}
                setIsPlaying={setisPlaying}
                audioElem={audioElem}
                changeSpeedMode={changeSpeedMode}
                active={active}
                setActive={setActive}
                timestamp={timestamps[toLowerCamelCase(story)]}
                setTextInput={setTextInput}
                setShowAnswer={setShowAnswer}
            />
        </div>
    );
};
