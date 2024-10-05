import {List, Pagination} from 'antd';
import axios from 'axios';
import {useEffect, useState} from 'react';
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
                <List
                    className='py-5 mx-2'
                    itemLayout="horizontal"
                    dataSource={news?.data}
                    renderItem={(item, index) => (
                        <div className='p-5 mt-4 bg-white drop-shadow'>
                            <a href={"/blog/" + item?.blog_slug} className='text-2xl font-bold'>{item?.blog_title}</a>
                            <div className='flex justify-center py-5'>
                                <img src={item?.blog_image} className=' h-[300px] rounded'/>
                            </div>
                            {parse(String(item?.blog_description)).length > 1000 ?
                                <p className='font-semibold py-5 text-slate-600 h-32 text-ellipsis overflow-hidden'>{parse(String(item?.blog_description)) + "..."}</p>
                                :
                                <p className='font-semibold py-5 text-slate-600 h-16 text-ellipsis overflow-hidden'>{parse(String(item?.blog_description))}</p>
                            }

                            <a href={"/blog/" + item?.blog_slug}>
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
