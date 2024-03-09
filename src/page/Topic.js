import { Col, Pagination, Row } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';
import Footer from '../component/Footer';

export default function Topic() {
    const { isMobile } = useDevice();
    const [dataTopic, setdataTopic] = useState([]);
    const [pagination, setPagination] = useState({
      page: 1,
      pageSize: 12,
    });

    const topic = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/topic/getAll`, {params: pagination});
          setdataTopic(response?.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        topic();
    },[]);

    return (
        <>
            <div className="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center py-10">Tất cả chương trình học</p>
                <Row className={isMobile ? 'text-center pt-[40px] text-white flex justify-center' : 'text-center pt-[40px] text-white'}>
                    {dataTopic?.data?.map((topic, index) =>
                        <Col xs={24} xl={6}>
                            <Link to={"/lesson/" + topic.slug}>
                                <div className='bg-gradient-to-r from-red-500 to-red-800 rounded-xl m-2 p-10 h-[150px]'>
                                    <p className="pt-[10px] font-semibold text-xl">{topic.id + ". " + topic.title}</p>
                                </div>
                            </Link>
                        </Col>
                    )}
                </Row>
                <Pagination
                    className="flex justify-center pt-[50px]"
                    current={pagination.page}
                    total={topic?.total}
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
        </>
    );
};
