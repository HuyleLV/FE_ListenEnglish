import { Col, Pagination, Row, Segmented } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';
import Footer from '../component/Footer';
import fire from "../component/icon/fire.png"
import logo from "../component/image/logo.png"
import dayjs from 'dayjs';

export default function RankingTimer() {
    const { isMobile } = useDevice();
    const [period, setPeriod] = useState("Today");
    const [dataRankStreak, setDataRankStreak] = useState([]);

    const getRankStreak = async (param) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/timeRank`, {params: {
            period: param
          }});
          setDataRankStreak(response?.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
            getRankStreak(period === "Today" ? "today" 
            :period === "Week" ? "week"
            :period === "Month" ? "month"
            :period === "All" ? "all": "all");
    },[period]);

    return (
        <>
            <div className="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center font-semibold py-10">Bảng xếp hạng Time</p>
                <Segmented className='mb-10 font-bold text-xl py-1' options={["Today", "Week", 'Month', "All"]} onChange={setPeriod} block />
                <div className='flex justify-center bg-red-100 p-10 rounded-xl'>
                    <table className='w-[1200px]'>
                        <thead className='bg-red-600 text-white'>
                            <tr>
                                <th className={isMobile? 'px-2' : 'px-10 py-2'}>Rank</th>
                                <th className={isMobile? 'px-2' : 'px-10'}>Avatar</th>
                                <th className={isMobile? 'px-2' : 'px-10'}>Full name</th>
                                <th className={isMobile? 'px-2' : 'px-10'}>Time hiện tại</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {dataRankStreak?.map((_, index) => 
                                <tr className='p-5'>    
                                    <td>{index+1}</td>
                                    <td className='flex justify-center py-5'><img src={_?.avatar ? _?.avatar : logo} className={isMobile? 'w-[30px] rounded-full' : 'w-[70px] rounded-full'}/></td>
                                    <td className='font-semibold'>{_?.username}</td>
                                    <td>
                                        <p className={isMobile? 'w-[100px]' : 'px-2'}>{ Math.floor(_?.duration % 86400 / 3600) + "h " + Math.floor(_?.duration % 86400 % 3600 / 60) + "m " + Math.floor(_?.duration % 86400 % 3600 % 60) + "s"}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {Footer()}
        </>
    );
};