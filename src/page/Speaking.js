import { useCallback, useEffect, useRef, useState } from "react";
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
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";

export default function Speaking() {

    const { slug } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [dataLesson, setdataLesson] = useState([]);
    const [arrayMain, setArrayMain] = useState([]);
    const [indexLyric, setIndexLyric] = useState(0);
    const [recordingIndex, setRecordingIndex] = useState(-1);
    const [story, setStory] = useState("Main Story");
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

    useEffect(() => {
        const containerElement = containerRef.current;
        containerElement.scrollTop = containerElement.scrollHeight;
    }, [containerRef]);

    useEffect(() => {
        lesson();
    }, [])

    useEffect(() => {
        if(!listening) {
            setRecordingIndex(-1);
        }
    }, [listening])

    useEffect(() => {
        convertString(story === "Main Story" ? dataLesson?.mainStory : story === "Vocabulary" ? dataLesson?.vocabulary : dataLesson?.miniStory);
    }, [story, dataLesson])

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
                                        <div className="flex justify-between">
                                            {indexLyric === i ? <p className="font-bold text-xl text-orange-500">{e}</p> : <p className="font-bold text-xl">{e}</p>}
                                            <button disabled={recordingIndex > -1 && recordingIndex !== i} onClick={()=>clickMic(i)}>{recordingIndex > -1 && recordingIndex !== i ? <AudioMutedOutlined /> : <AudioOutlined style={{ color: recordingIndex === i ? 'red' : null}} />}</button>
                                        </div>
                                        {i === indexLyric && (
                                            <p className="w-full text-green-600 font-bold text-xl text-left">{transcript}</p>
                                        )}
                                    </button>
                                </div>
                            ))}
                        {/* <button onClick={SpeechRecognition.stopListening}>Stop</button>
                        <button onClick={resetTranscript}>Reset</button> */}
                    </div>
                {/*) : dataLesson?.vocabulary && story === "Vocabulary" ? (*/}
                {/*    <div className="bg-red-100 h-screen overflow-y-scroll" ref={containerRef}>*/}
                {/*        {arrayMain.map((e,i) => (*/}
                {/*            <div className="border-b border-black p-4">*/}
                {/*                <div className="flex justify-between">*/}
                {/*                    <p className="font-bold text-xl">{e}</p>*/}
                {/*                    <button onClick={()=>clickMic(i)}><AudioOutlined /></button>*/}
                {/*                </div>*/}
                {/*                {i === indexLyric && (*/}
                {/*                    <p className="text-green-600 font-bold text-xl">{transcript}</p>*/}
                {/*                )}*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*        /!* <button onClick={SpeechRecognition.stopListening}>Stop</button>*/}
                {/*        <button onClick={resetTranscript}>Reset</button> *!/*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <div className="bg-red-100 h-screen overflow-y-scroll">*/}
                {/*        {arrayMain.map((e,i) => (*/}
                {/*            <div className="border-b border-black p-4">*/}
                {/*                <div className="flex justify-between">*/}
                {/*                    <p className="font-bold text-xl">{e}</p>*/}
                {/*                    <button onClick={()=>clickMic(i)}><AudioOutlined /></button>*/}
                {/*                </div>*/}
                {/*                {i === indexLyric && (*/}
                {/*                    <p className="text-green-600 font-bold text-xl">{transcript}</p>*/}
                {/*                )}*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*        /!* <button onClick={SpeechRecognition.stopListening}>Stop</button>*/}
                {/*        <button onClick={resetTranscript}>Reset</button> *!/*/}
                {/*    </div>*/}
                {/*)}*/}
        </div>
    );
};
