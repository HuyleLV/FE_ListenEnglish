import { Avatar, Col, List, Pagination, Row } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../component/Footer';
import parse from "html-react-parser";

export default function Blog() {

    const [news, setdataNews] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 8,
      });

    const getNews = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog/getAll`, {params: pagination});
          setdataNews(response?.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        getNews();
    }, []);

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto py-1 pb-[100px]">
                <Row>
                    <Col xs={24} xl={16}>
                        <List
                            className='py-5 mx-2'
                            itemLayout="horizontal"
                            dataSource={news?.data}
                            renderItem={(item, index) => (
                                <div className='p-5 mt-4 bg-white drop-shadow'>
                                    <a href={"/blog/" + item?.blog_id} className='text-2xl font-bold'>{item?.blog_title}</a>
                                    <div className='flex justify-center py-5'>
                                        <img src={item?.blog_image} className=' h-[300px] rounded'/>
                                    </div>
                                    {parse(String(item?.blog_description)).length > 1000 ?
                                        <p className='font-semibold py-5 text-slate-600 h-32 text-ellipsis overflow-hidden'>{parse(String(item?.blog_description)) + "..."}</p>
                                    :
                                        <p className='font-semibold py-5 text-slate-600 h-16 text-ellipsis overflow-hidden'>{parse(String(item?.blog_description))}</p>
                                    }
                                    
                                    <a href={"/blog/" + item?.blog_id}>
                                        <button className='bg-[#2ca1db] px-5 py-2 mt-5 text-white font-bold'>
                                            Continue Reading
                                        </button>
                                    </a>
                                </div>
                            )}
                        />
                        
                        <Pagination
                            className="flex justify-center"
                            current={pagination.page}
                            total={news?.total}
                            pageSize={pagination.pageSize}
                            onChange={(p, ps)=> {
                                setPagination({
                                    page: p,
                                    pageSize: ps
                                })
                            }}
                        />
                    </Col>
                    <Col xs={24} xl={8}>
                        <div className='px-4 mt-9 mx-5 py-8 bg-white drop-shadow'>
                            <p className='font-semibold text-xl pb-2 border-b'>Popular Articles</p>
                            <List
                                itemLayout="horizontal"
                                dataSource={news?.data}
                                renderItem={(item, index) => (
                                    <div className='pt-4'>
                                        <a href={"/blog/" + item?.blog_id} className='text-lg font-normal text-[#1e73be]'>{item?.blog_title}</a>
                                    </div>
                                )}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            {Footer()}
        </>
    );
};