import { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "../component/UseTimer";
import cd from "../component/icon/cd.png"
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import Control from "../component/Control";
import { songsdata } from "../component/audio";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Breadcrumb } from "antd";
import { useCookies } from "react-cookie";
import dayjsInstance from "../utils/dayjs";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { AudioOutlined } from "@ant-design/icons";

export default function Speaking() {

    const { lesson_id } = useParams();
    const navigate = useNavigate();
    const [dataLesson, setdataLesson] = useState([]);
    const [arrayMain, setArrayMain] = useState([]);
    const [indexLyric, setIndexLyric] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const convertString = () => {
        if( dataLesson?.mainStory ) {
            const data = dataLesson?.mainStory.replaceAll("]"," <br> ").replaceAll("["," <br> ").split(" <br> ");
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
        await SpeechRecognition.startListening();
    }

    const postTrans = (i) => {
        if(listening === false && i.length > 0){
            console.log(i, indexLyric);
        }
    }
    
    const lesson = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getById/` + lesson_id)
                .then(response => setdataLesson(response.data[0]));
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        lesson();
        convertString();
    }, [dataLesson?.mainStory])

    useEffect(() => {
        postTrans(transcript);
    }, [transcript, listening])

    useEffect(() => {
        if(dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD") && cookies?.user?.vip_expire_at !== null){

        } else {
            navigate("/");
        }
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
                        title: <a href={"/lesson/" + dataLesson?.topic_id}>{dataLesson?.topic_title}</a>,
                    },
                    {
                        title: dataLesson?.title,
                    },
                ]}
            />
            <p className="text-4xl font-semibold text-center pt-10">{dataLesson?.title}</p>
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                {dataLesson?.mainStory && (
                    <div className="bg-red-100">
                            {arrayMain.map((e,i) => (
                                <div className="border-b border-black p-4">
                                    <div className="flex justify-between">
                                        <p className="font-bold text-xl">{e}</p>
                                        <button onClick={()=>clickMic(i)}><AudioOutlined /></button>
                                    </div> 
                                    {i === indexLyric && (
                                        <p className="text-green-600 font-bold text-xl">{transcript}</p>
                                    )}
                                </div>
                            ))}
                        {/* <button onClick={SpeechRecognition.stopListening}>Stop</button>
                        <button onClick={resetTranscript}>Reset</button> */}
                    </div>
                )}
        </div>
    );
};