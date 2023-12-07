import axios from "axios";
import cd from "../component/icon/cd.png"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Lesson() {

    const { topic_id } = useParams();
    const [dataLesson, setdataLesson] = useState([]);
    const [dataTopic, setdataTopic] = useState([]);

    const lesson = async () => {
        try {
          const response = await axios.get(`https://api.effortlessenglish.vip/lesson/getByTopic/` + topic_id);
          const responseTopic = await axios.get(`https://api.effortlessenglish.vip/topic/getDetail/` + topic_id);
          setdataLesson(response.data);
          setdataTopic(responseTopic.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        lesson();
        console.log(dataTopic);
    });

    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl text-center py-10">{dataTopic[0]?.title}</p>

            <div class="grid grid-cols-4 gap-4 text-center pt-[40px] text-white">
                {dataLesson.map((lesson, index) => 
                    <div class="col-span-1 text-center pt-[40px] text-white" key={index}>
                        <Link to={"/lesson/detail/" + lesson.id}>
                            <div class="bg-sky-600 rounded">
                                <div className="p-5">
                                    <center>
                                        <img src={cd} className="h-20 w-20"/>
                                    </center>
                                    <p className="pt-[10px] font-semibold text-xl">{ lesson.id +". "+ lesson.title }</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        
        </div>
    );
};