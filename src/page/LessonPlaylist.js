import axios from "axios";
import cd from "../component/icon/cd.png"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Pagination } from "antd";
import Footer from "../component/Footer";
import { useCookies } from "react-cookie";
import dayjsInstance from "../utils/dayjs";
import toCamelCase from "../utils/toCamelCase";

export default function LessonPlaylist() {

    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSpeakOpen, setIsModalSpeakOpen] = useState(false);
    const [dataLessonPlaylist, setdataLessonPlaylist] = useState([]);
    const [pagination, setPagination] = useState({
      page: 1,
      pageSize: 12,
    });
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const lessonPlaylist = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/lessonplaylist/playlist/${id}`,
              {params: pagination, headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${cookies?.user?.token}`
              }});
          setdataLessonPlaylist(response?.data.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        lessonPlaylist();
    },[]);

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">

                <div class="grid grid-cols-4 gap-4 text-center pt-[40px] text-white h-full">
                    {dataLessonPlaylist?.map((lessonPlaylist, index) =>
                        <div class="col-span-1 text-center pt-[40px] text-white" key={index}>
                                <div class="bg-gradient-to-r from-red-500 to-red-800 rounded-t-md">
                                    <div className="p-5">
                                        <center>
                                            <img src={cd} className="h-20 w-20"/>
                                        </center>
                                        <p className="pt-[10px] font-semibold text-xl">{ toCamelCase(lessonPlaylist.track) +". "+ lessonPlaylist.title }</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                        <>
                                            <Link to={"/playlist/detail/"+ lessonPlaylist?.playlist_id} state={{ index: index }}>
                                                <div className="col-span-1 bg-orange-400 p-2 rounded-bl-md font-bold">
                                                    Audio
                                                </div>
                                            </Link>
                                            <Link to={"/lesson/speaking/"+ lessonPlaylist?.slug} state={{ index: 0 }}>
                                                <div className="col-span-1 bg-orange-600 p-2 rounded-br-md font-bold">
                                                    Speaking
                                                </div>
                                            </Link>
                                        </>
                                </div>
                        </div>
                    )}
                </div>

                <Pagination
                    className="flex justify-center pt-[50px]"
                    current={pagination.page}
                    total={dataLessonPlaylist?.total}
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
