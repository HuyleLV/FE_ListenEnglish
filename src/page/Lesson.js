import axios from "axios";
import cd from "../component/icon/cd.png"
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "antd";

export default function Lesson() {

    const { topic_id } = useParams();
    const [dataLesson, setdataLesson] = useState([]);
    const [pagination, setPagination] = useState({
      page: 1,
      pageSize: 12,
    });

    const lesson = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getByIdTopic/${topic_id}`, {params: pagination});
          console.log(response?.data[0]);
          setdataLesson(response?.data[0]);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        lesson();
    },[]);

    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl text-center py-10">{dataLesson?.title}</p>

            <div class="grid grid-cols-4 gap-4 text-center pt-[40px] text-white h-full">
                {dataLesson?.lesson?.map((lesson, index) => 
                    <div class="col-span-1 text-center pt-[40px] text-white" key={index}>
                            <div class="bg-cyan-600 rounded-t-md">
                                <div className="p-5">
                                    <center>
                                        <img src={cd} className="h-20 w-20"/>
                                    </center>
                                    <p className="pt-[10px] font-semibold text-xl">{ lesson.id +". "+ lesson.title }</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <Link to={"/lesson/detail/" + lesson.id}>
                                    <div className="col-span-1 bg-cyan-500 p-2 rounded-bl-md font-bold">
                                        Audio
                                    </div>
                                </Link>
                                <Link to={"/lesson/speaking/" + lesson.id}>
                                    <div className="col-span-1 bg-blue-500 p-2 rounded-br-md font-bold">
                                        Speaking
                                    </div>
                                </Link>
                            </div>
                    </div>
                )}
            </div>
            
            <Pagination
                className="flex justify-center absolute inset-x-0 bottom-10"
                current={pagination.page}
                total={dataLesson?.total}
                pageSize={pagination.pageSize}
                onChange={(p, ps)=> {
                    setPagination({
                        page: p,
                        pageSize: ps
                    })
                }}
            />
        </div>
    );
};