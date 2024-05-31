import React, { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "../component/UseTimer";
import cd from "../component/icon/cd.png"
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import Control from "../component/Control";
import { songsdata } from "../component/audio";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Breadcrumb, Modal, Segmented} from "antd";
import { useCookies } from "react-cookie";
import dayjsInstance from "../utils/dayjs";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {AudioFilled, AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";
import formatSecondToTime from "../utils/formatSecondToTime";
import repeatOff from "../component/icon/repeat-off.png";
import repeatTrack from "../component/icon/repeat-track.png";
import repeatOne from "../component/icon/repeat-one.png";
import back from "../component/icon/back.png";
import pause from "../component/icon/pause.png";
import play from "../component/icon/play-button-arrowhead.png";
import next from "../component/icon/next.png";
import toCamelCase from "../utils/toCamelCase";
import toLowerCamelCase from "../utils/toLowerCamelCase";

export default function Speaking() {

    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const index = location?.state?.index;

    const containerRef = useRef(null);
    const [dataLesson, setdataLesson] = useState([]);
    const [options, setOptions] = useState([]);
    const [records, setRecords] = useState([]);
    const [recordMain, setRecordMain] = useState([]);
    const [arrayMain, setArrayMain] = useState([]);
    const [indexLyric, setIndexLyric] = useState(0);
    const [recordingIndex, setRecordingIndex] = useState(-1);
    const [story, setStory] = useState("Main Story");
    const [recordingAll, setRecordingAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUserTopic, setDataUserTopic] = useState({});
    const [isModalSpeakOpen, setIsModalSpeakOpen] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const {
        transcript,
        listening,
    } = useSpeechRecognition();

    const convertString = (track) => {
        if( track ) {
            const data = track.split('\n').map(el => el.slice(el.indexOf(']')+1));
            const dataNew = [];
            for(let i = 0; i < data.length; i++) {
                    dataNew.push(data[i]);
            }
            setArrayMain(dataNew);
        }
    }

    const clickMic = async(i) => {
        setIndexLyric(i);
        setRecordingIndex(i);
        await SpeechRecognition.startListening();
    }

    const stopMic = async() => {
        setRecordingIndex(-1);
        await SpeechRecognition.stopListening();
    }

    const handleRecord = async result => {
        try {
            let point = 0;
            const text = result;
            const item = arrayMain[indexLyric].split(' ');
            item.forEach(el => {
                // eslint-disable-next-line no-unused-expressions
                text.replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '')
                    .toLowerCase()
                    .split(' ')
                    .includes(el.replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '').toLowerCase())
                    ? point++
                    : null;
            });
            point = Math.ceil((point / item.length) * 100);
            await axios.post(
                `${process.env.REACT_APP_API_URL}/record`,
                {
                    lesson_id: dataLesson.id,
                    position: indexLyric,
                    track: toLowerCamelCase(story),
                    text,
                    point,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookies?.user?.token}`,
                    },
                },
            );
            await getRecords();
        } catch (error) {
            console.error(error);
        }
        // setRecordingIndex(-1);
    };

    const lesson = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getBySlug/` + slug)
                .then(response => setdataLesson(response.data[0]));
        } catch (error) {
          console.error(error);
        }
    }
    const getRecords = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/user/record`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies?.user?.token}`,
                },
            })
                .then(response => {
                    setRecords(response.data);
                });
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

    useEffect(() => {
        const containerElement = containerRef.current;
        containerElement.scrollTop = containerElement.scrollHeight;
    }, [containerRef]);

    useEffect( () => {
        lesson();
        if (cookies?.user) {
            getRecords();
            userTopic();
        }
    }, []);

    useEffect(() => {
        if(!listening) {
            setRecordingIndex(-1);
            if (recordingAll && indexLyric < arrayMain.length - 1) {
                if (transcript !== '') {
                    handleRecord(transcript);
                    setTimeout(() => clickMic(indexLyric+1).then(), [1000]);
                } else {
                    setIsModalSpeakOpen(true)
                }
            } else if (transcript !== '') {
                handleRecord(transcript);
            }
        }
    }, [listening])

    useEffect(() => {
        convertString(story === "Main Story" ? dataLesson?.mainStory
            : story === "Vocabulary" ? dataLesson?.vocabulary
                : story === 'Mini Story' ? dataLesson?.miniStory
                    : story === 'POV' ? dataLesson?.POV
                        : dataLesson?.comment);
        const options = [];
        if (dataLesson?.mainStory) options.push('Main Story');
        if (dataLesson?.vocabulary) options.push('Vocabulary');
        if (dataLesson?.miniStory) options.push('Mini Story');
        if (dataLesson?.POV) options.push('POV');
        if (dataLesson?.comment) options.push('Comment');
        setOptions(options);
        setRecordMain(records.filter(
            rec => +rec.lesson_id === +dataLesson.id && toCamelCase(rec.track) === story,
        ))
    }, [story, dataLesson, records])


    useEffect(() => {
        if (dataUserTopic?.lesson_id) {
            if (dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD")
                && cookies?.user?.vip_expire_at !== null
                || +dataUserTopic?.lesson_id >= +dataLesson.id || +index === 0) {

            } else {
                navigate("/");
            }
        }
        if (index === undefined || !cookies?.user) navigate("/login");
    }, [cookies])

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
                onChange={(e)=>setStory(e)}
                block />
                    <div className="bg-red-100 h-screen overflow-y-scroll" ref={containerRef}>
                            {arrayMain.map((e,i) => (
                                <div key={i} className="border-b border-black p-4 w-full">
                                    <button className="w-full" onClick={() => setIndexLyric(i)}>
                                        <div className="flex flex-row justify-between">
                                            <div className="flex flex-row">
                                                {e.split(' ').map(el => (<p className="font-bold text-xl" style={{
                                                    color: recordMain.find(rec => +rec.position === i)?.text
                                                        ? recordingIndex === i
                                                            ? 'orange'
                                                            : recordMain
                                                                .find(rec => +rec.position === i)
                                                                ?.text.replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '')
                                                                .toLowerCase()
                                                                .split(' ')
                                                                .includes(
                                                                    el
                                                                        .replace(/[!@#$%^&*(),.?":{}|<>“”]/g, '')
                                                                        .toLowerCase(),
                                                                )
                                                                ? 'green'
                                                                : 'red'
                                                        : indexLyric === i
                                                            ? 'orange'
                                                            : 'black',
                                                }}>{el}&nbsp;</p>))}
                                            </div>
                                            <button disabled={recordingIndex > -1 && recordingIndex !== i} onClick={recordingIndex === -1 ? () => clickMic(i) : stopMic }>{recordingIndex > -1 && recordingIndex !== i ? <AudioMutedOutlined /> : <AudioOutlined style={{ color: recordingIndex === i ? 'red' : null}} />}</button>
                                        </div>
                                        {i === indexLyric && (
                                            <p className="w-full text-blue-500 font-bold text-xl text-left">{recordMain.find(rec => +rec.position === i)?.text}</p>
                                            // <p className="w-full text-green-600 font-bold text-xl text-left">{transcript}</p>
                                        )}
                                    </button>
                                </div>
                            ))}
                    </div>
                <div>
                    <center>
                        <div className='p-4 bg-gradient-to-r from-red-500 to-red-800 flex flex-row justify-center'>
                            <button type="button" className='mx-5 rounded-full p-4' onClick={() => indexLyric > 0 && setIndexLyric( indexLyric-1)}>
                                <img src={back} className='w-10 h-10'/>
                            </button>
                                <button type="button" className='mx-5 rounded-full p-4' style={{backgroundColor: listening ? "#EA580C" : '#60A5FA'}}
                                        onClick={() => {
                                    if (!listening) {
                                        setRecordingAll(true);
                                        clickMic(indexLyric).then();
                                    } else {
                                        setRecordingAll(false);
                                        SpeechRecognition.stopListening().then();
                                    }
                                }}>
                                    <AudioFilled style={{ fontSize: 30}} className='w-10 h-10 justify-center text-white'/>
                                </button>
                            <button type="button" className='mx-5 rounded-full p-4' onClick={() => indexLyric < arrayMain.length-1 && setIndexLyric(indexLyric+1)}>
                                <img src={next} className='w-10 h-10'/>
                            </button>
                        </div>
                    </center>
                </div>
            <Modal open={isModalSpeakOpen} onOk={()=> {
                setIsModalSpeakOpen(false)
                clickMic(indexLyric)
            }} onCancel={()=>setIsModalSpeakOpen(false)} okButtonProps={{ className: "bg-blue-500" }}>
                <p className="text-xl font-bold py-5 pt-8">Bạn có muốn tiếp tục không?</p>
            </Modal>
        </div>
    );
};
