import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Col, Modal, Pagination, Row} from "antd";
import Footer from "../component/Footer";
import {useCookies} from "react-cookie";
import {useDevice} from "../hooks";

export default function Course() {
    const {isMobile} = useDevice();

    const {slug} = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSpeakOpen, setIsModalSpeakOpen] = useState(false);
    const [dataCourse, setdataCourse] = useState([]);
    const [dataUserTopic, setDataUserTopic] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
    });
    const [cookies] = useCookies(["user"]);
    const navigate = useNavigate();

    const course = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/course/getBySlugTopic/${slug}`, {params: pagination});
            setdataCourse(response?.data[0]);
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        course();
    }, []);

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center py-10">{dataCourse?.title}</p>

                <Row
                    className={isMobile ? 'text-center pt-[40px] text-white flex justify-center' : 'text-center pt-[40px] text-white'}>
                    {dataCourse?.course?.map((course, index) =>
                        <Col xs={24} xl={6} key={index}>
                            <Link to={"/lesson/" + course.slug}>
                                <div className='bg-gradient-to-r from-red-500 to-red-800 rounded-xl m-2 p-10 h-[150px]'>
                                    <p className="pt-[10px] font-semibold text-xl">{course.id + ". " + course.title}</p>
                                </div>
                            </Link>
                        </Col>
                    )}
                </Row>

                <Pagination
                    className="flex justify-center pt-[50px]"
                    current={pagination.page}
                    total={dataCourse?.total}
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
