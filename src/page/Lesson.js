import axios from "axios";
import cd from "../component/icon/cd.png"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Pagination } from "antd";
import Footer from "../component/Footer";
import { useCookies } from "react-cookie";
import dayjsInstance from "../utils/dayjs";

export default function Lesson() {

    const { topic_id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSpeakOpen, setIsModalSpeakOpen] = useState(false);
    const [dataLesson, setdataLesson] = useState([]);
    const [pagination, setPagination] = useState({
      page: 1,
      pageSize: 12,
    });
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const lesson = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getByIdTopic/${topic_id}`, {params: pagination});
          setdataLesson(response?.data[0]);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        lesson();
    },[]);

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center py-10">{dataLesson?.title}</p>

                <div class="grid grid-cols-4 gap-4 text-center pt-[40px] text-white h-full">
                    {dataLesson?.lesson?.map((lesson, index) => 
                        <div class="col-span-1 text-center pt-[40px] text-white" key={index}>
                                <div class="bg-gradient-to-r from-red-500 to-red-800 rounded-t-md">
                                    <div className="p-5">
                                        <center>
                                            <img src={cd} className="h-20 w-20"/>
                                        </center>
                                        <p className="pt-[10px] font-semibold text-xl">{ lesson.id +". "+ lesson.title }</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    {dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD") && cookies?.user?.vip_expire_at !== null
                                    ?
                                        <Link to={"/lesson/detail/"+ lesson?.id}>
                                            <div className="col-span-1 bg-orange-400 p-2 rounded-bl-md font-bold">
                                                Audio
                                            </div>
                                        </Link>
                                    : 
                                        <Link onClick={()=>setIsModalOpen(true)}>
                                            <div className="col-span-1 bg-orange-400 p-2 rounded-bl-md font-bold">
                                                Audio
                                            </div>
                                        </Link>
                                    }
                                    
                                    <Link onClick={()=>setIsModalSpeakOpen(true)}>
                                        <div className="col-span-1 bg-orange-600 p-2 rounded-br-md font-bold">
                                            Speaking
                                        </div>
                                    </Link>
                                </div>
                        </div>
                    )}
                </div>
                
                <Pagination
                    className="flex justify-center pt-[50px]"
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
            {Footer()}
            
            <Modal open={isModalOpen} onOk={()=>setIsModalOpen(false)} onCancel={()=>setIsModalOpen(false)} okButtonProps={{ className: "bg-blue-500" }}>
                <p className="text-xl font-bold py-2 pt-8">Vui lòng truy cập vào profile và </p>
                <p className="text-xl font-bold py-2 pb-8">đăng ký gói vip để được sử dụng dịch vụ này</p>
            </Modal>

            <Modal open={isModalSpeakOpen} onOk={()=>setIsModalSpeakOpen(false)} onCancel={()=>setIsModalSpeakOpen(false)} okButtonProps={{ className: "bg-blue-500" }}>
                <p className="text-xl font-bold py-5 pt-8">Vui lòng tải app để được dùng chức năng này!</p>
            </Modal>
        </>
    );
};