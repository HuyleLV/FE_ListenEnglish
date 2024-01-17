import { Avatar, Col, List, Row } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import parse from "html-react-parser";

export default function BlogDetail() {

    const [news, setdataNews] = useState([]);
    const params = useParams();

    const mapObj = {
        '<h1': "<h1 class='text-3xl'",
        '<h2': "<h2 class='text-2xl'",
        '<h3': "<h3 class='text-xl'",
        'ul>': "p>"
    };

    const getNews = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/blog/getById/${params?.blog_id}`);
          setdataNews(response?.data[0]);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        getNews();
    }, [params]);

    return (
        <div class="max-w-screen-xl items-center mx-auto py-1">
            <Row>
                <Col span={24}>
                    
                    <div className='p-10 py-10 mt-4 bg-white drop-shadow'>
                        <p className='text-4xl font-bold'>{news?.blog_title}</p>
                        <div className='flex justify-center py-10'>
                            <img src={news?.blog_image} className=' h-[400px] rounded'/>
                        </div>
                        <p className='font-semibold pb-3 text-slate-600'>{parse(String(news?.blog_description).replaceAll(/<h1|<h2|<h3|ul>/gi, matched => mapObj[matched]))}</p>
                    </div>
                    
                </Col>
            </Row>

        </div>
    );
};