import React, { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "../component/UseTimer";
import cd from "../component/icon/cd.png"
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import Control from "../component/Control";
import { songsdata } from "../component/audio";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {Breadcrumb, Segmented} from "antd";
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
import volumeHigh from "../component/icon/volume-high.png";
import volumeLow from "../component/icon/volume-low.png";
import volumeMedium from "../component/icon/volume-medium.png";
import volumeMute from "../component/icon/volume-mute.png";
import toCamelCase from "../utils/toCamelCase";

export default function Speaking() {

    const { slug } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [dataLesson, setdataLesson] = useState([]);
    const [records, setRecords] = useState([]);
    const [recordMain, setRecordMain] = useState([]);
    const [arrayMain, setArrayMain] = useState([]);
    const [indexLyric, setIndexLyric] = useState(0);
    const [recordingIndex, setRecordingIndex] = useState(-1);
    const [story, setStory] = useState("Main Story");
    const [recordingAll, setRecordingAll] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
    } = useSpeechRecognition();

    const convertString = (track) => {
        if( track ) {
            const data = track.replaceAll("]"," <br> ").replaceAll("["," <br> ").split(" <br> ");
            const dataNew = [];
            for(let i = 1; i <= data.length; i++) {
                if(i % 2 == 0){
                    dataNew.push(data[i]);
                }
            }
            setArrayMain(dataNew);
        }
    }

    const clickMic = async(i) => {
        setIndexLyric(i);
        setRecordingIndex(i);
        await SpeechRecognition.startListening();
    }

    const postTrans = (i) => {
        if(listening === false && i.length > 0){
            console.log(i, indexLyric);
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

    useEffect(() => {
        const containerElement = containerRef.current;
        containerElement.scrollTop = containerElement.scrollHeight;
    }, [containerRef]);

    useEffect( () => {
        lesson();
        getRecords();
    }, []);

    useEffect(() => {
        if(!listening) {
            setRecordingIndex(-1);
            if (recordingAll && indexLyric < arrayMain.length - 1) {
                if (transcript !== '') {
                    setTimeout(() => clickMic(indexLyric+1).then(), [1000]);
                } else {
                    alert('Ban co muon tiep tuc khong')
                }
            }
        }
    }, [listening])

    useEffect(() => {
        convertString(story === "Main Story" ? dataLesson?.mainStory : story === "Vocabulary" ? dataLesson?.vocabulary : dataLesson?.miniStory);
        setRecordMain(records.filter(
            rec => +rec.lesson_id === +dataLesson.id && toCamelCase(rec.track) === story,
        ))
    }, [story, dataLesson, records])

    useEffect(() => {
        postTrans(transcript);
    }, [transcript, listening])

    useEffect(() => {
        // if(dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD") && cookies?.user?.vip_expire_at !== null){
        //
        // } else {
        //     navigate("/");
        // }
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
                options={['Main Story', 'Vocabulary', 'Mini Story']}
                value={story}
                onChange={(e)=>setStory(e)}
                block />
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                {/*{dataLesson?.mainStory && story === "Main Story" ? (*/}
                    <div className="bg-red-100 h-screen overflow-y-scroll" ref={containerRef}>
                            {arrayMain.map((e,i) => (
                                <div className="border-b border-black p-4 w-full">
                                    <button className="w-full" onClick={() => setIndexLyric(i)}>
                                        <div className="flex flex-row justify-between">
                                            <div className="flex flex-row">
                                                {e.split(' ').map(el => (indexLyric === i ? <p className="font-bold text-xl text-orange-500">{el}&nbsp;</p> : <p className="font-bold text-xl">{el}&nbsp;</p>))}
                                            </div>
                                            <button disabled={recordingIndex > -1 && recordingIndex !== i} onClick={()=>clickMic(i)}>{recordingIndex > -1 && recordingIndex !== i ? <AudioMutedOutlined /> : <AudioOutlined style={{ color: recordingIndex === i ? 'red' : null}} />}</button>
                                        </div>
                                        {i === indexLyric && (
                                            <p className="w-full text-green-600 font-bold text-xl text-left">{recordMain.find(rec => +rec.position === i)?.text}</p>
                                            // <p className="w-full text-green-600 font-bold text-xl text-left">{transcript}</p>
                                        )}
                                    </button>
                                </div>
                            ))}
                        {/* <button onClick={SpeechRecognition.stopListening}>Stop</button>
                        <button onClick={resetTranscript}>Reset</button> */}
                    </div>
                <div>
                    <center>
                        <div className='p-4 bg-gradient-to-r from-red-500 to-red-800 flex flex-row justify-center'>
                            <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={() => indexLyric > 0 && setIndexLyric( indexLyric-1)}>
                                <img src={back} className='w-10 h-10'/>
                            </button>
                                <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={() => {
                                    if (!listening) {
                                        setRecordingAll(true);
                                        clickMic(indexLyric).then();
                                    } else {
                                        setRecordingAll(false);
                                        SpeechRecognition.stopListening().then();
                                    }
                                }}>
                                    <AudioFilled style={{ color: listening ? 'red' : null, fontSize: 30}} className='w-10 h-10 justify-center text-white'/>
                                </button>
                            <button type="button" className='mx-5 rounded-full p-4 bg-orange-600' onClick={() => indexLyric < arrayMain.length-1 && setIndexLyric(indexLyric+1)}>
                                <img src={next} className='w-10 h-10'/>
                            </button>
                        </div>
                    </center>
                </div>
        </div>
    );
};
