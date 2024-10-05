import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Col, Modal, Pagination, Row} from "antd";
import Footer from "../component/Footer";
import {useCookies} from "react-cookie";
import dayjsInstance from "../utils/dayjs";

export default function Lesson() {

    const {slug} = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSpeakOpen, setIsModalSpeakOpen] = useState(false);
    const [dataLesson, setdataLesson] = useState([]);
    const [dataUserTopic, setDataUserTopic] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
    });
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const navigate = useNavigate();

    const lesson = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getBySlugCourse/${slug}`, {params: pagination});
            setdataLesson(response?.data[0]);
            console.log(response.data[0]);
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
        lesson();
        if (cookies?.user) userTopic();
    }, []);

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center py-10">{dataLesson?.title}</p>
                <Row className="pt-[40px]">

                    {dataLesson?.lesson?.map((lesson, index) =>
                        <Col xs={24} xl={6} key={index}>
                            {dayjsInstance(cookies?.user?.vip_expire_at)?.format("YYYY-MM-DD") > dayjsInstance(Date())?.format("YYYY-MM-DD")
                            && cookies?.user?.vip_expire_at !== null
                            || +dataUserTopic?.lesson_id >= +lesson.id || +index === 0
                                ?
                                <div className="rounded border m-2 p-2 flex">
                                    <div className="rounded border p-1">
                                        <img src={lesson?.lesson_url} width={48}/>
                                    </div>
                                    <div className="ml-2 flex flex-col justify-around">
                                        <Link to={"/lesson/detail/" + lesson?.slug} state={{index: index}}>
                                            <p className="font-semibold text-blue-700">{lesson.title}</p>
                                        </Link>
                                        <div className='flex justify-between'>
                                            <Link to={"/lesson/listening/" + lesson?.slug} state={{index: index}}>
                                                <p className='text-xs'>Listening</p>
                                            </Link>
                                            <Link to={"/lesson/speaking/" + lesson?.slug} state={{index: index}}>
                                                <p className='text-xs ml-2'>Speaking</p>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                                :
                                <div className="rounded border m-2 p-2 flex">
                                    <div className="rounded border p-1">
                                        <img src={lesson?.lesson_url} width={48}/>
                                    </div>
                                    <div className="ml-2 flex flex-col justify-around">
                                        <Link onClick={() => setIsModalOpen(true)}>
                                            <p className="font-semibold text-blue-700">{lesson.title}</p>
                                        </Link>
                                        <div className='flex justify-between'>
                                            <Link onClick={() => setIsModalOpen(true)}>
                                                <p className='text-xs'>Listening</p>
                                            </Link>
                                            <Link onClick={() => setIsModalOpen(true)}>
                                                <p className='text-xs ml-2'>Speaking</p>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            }
                        </Col>
                    )}
                </Row>

                <Pagination
                    className="flex justify-center pt-[50px]"
                    current={pagination.page}
                    total={dataLesson?.total}
                    pageSize={pagination.pageSize}
                    onChange={(p, ps) => {
                        setPagination({
                            page: p,
                            pageSize: ps
                        })
                    }}
                />
            </div>
            {Footer()}

            <Modal open={isModalOpen}
                   onOk={() => cookies?.user ? navigate(`/profile/${cookies.user.id}`) : navigate('/login')}
                   onCancel={() => setIsModalOpen(false)} okButtonProps={{className: "bg-blue-500"}}>
                <p className="text-xl font-bold py-2 pt-8">Vui lòng truy cập vào profile và </p>
                <p className="text-xl font-bold py-2 pb-8">đăng ký gói vip để được sử dụng dịch vụ này</p>
            </Modal>

            <Modal open={isModalSpeakOpen} onOk={() => setIsModalSpeakOpen(false)}
                   onCancel={() => setIsModalSpeakOpen(false)} okButtonProps={{className: "bg-blue-500"}}>
                <p className="text-xl font-bold py-5 pt-8">Vui lòng tải app để được dùng chức năng này!</p>
            </Modal>
        </>
    );
};
