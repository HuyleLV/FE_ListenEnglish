import {Col, Pagination, Row} from 'antd';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDevice} from '../hooks/useDevice';
import Footer from '../component/Footer';

export default function Topic() {
    const {isMobile} = useDevice();
    const [dataTopic, setdataTopic] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
    });

    const topic = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/topic/getAll`, {params: pagination});
            console.log(response.data)
            setdataTopic(response?.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        topic();
    }, []);

    return (
        <>
            <div className="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center py-10">Tất cả chương trình học</p>
                <Row className='pt-[30px]'>
                    {dataTopic?.data?.map((topic, index) =>
                        <Col xs={24} xl={6} key={index} className='mt-5'>
                            <div className='grid grid-cols-4 gap-2 rounded border m-2 p-2 bg-white flex items-center h-full'>
                                <div className='rounded border p-1'>
                                    <img src={topic.image_url} width={60}/>
                                </div>
                                <div className="ml-2 col-span-3">
                                    <Link to={"/course/" + topic.slug}>
                                        <p className="text-lg font-semibold text-blue-700">{topic.title}</p>
                                    </Link>
                                    <p className='text-xs'>{topic.totalCourses} courses</p>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
                <Pagination
                    className="flex justify-center pt-[50px]"
                    current={pagination.page}
                    total={topic?.total}
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
        </>
    );
};
