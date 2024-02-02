import { Col, Pagination, Row, Segmented } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevice } from '../hooks/useDevice';
import Footer from '../component/Footer';
import fire from "../component/icon/fire.png"
import logo from "../component/image/logo.png"

export default function RankingStreak() {
    const { isMobile } = useDevice();
    const [dataRankStreak, setDataRankStreak] = useState([]);

    const getRankStreak = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/streakRank`);
          setDataRankStreak(response?.data);
          console.log(response?.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        getRankStreak();
    },[]);

    return (
        <>
            <div className="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center font-semibold py-10">Bảng xếp hạng Streak</p>
                <div className='flex justify-center bg-red-100 p-10 rounded-xl'>
                    <table className='w-[1200px]'>
                        <thead className='bg-red-600 text-white'>
                            <tr>
                                <th className='px-10 py-2'>Rank</th>
                                <th className='px-10'>Avatar</th>
                                <th className='px-10'>Full name</th>
                                <th className='px-10'>Streak hiện tại</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {dataRankStreak?.map((_, index) => 
                                <tr className='p-5'>    
                                    <td>{index+1}</td>
                                    <td className='flex justify-center py-5'><img src={_?.avatar ? _?.avatar : logo} className='w-[70px] rounded-full'/></td>
                                    <td className='font-semibold'>{_?.username}</td>
                                    <td>
                                        <div className='flex justify-center'>
                                            <p className='px-2'>{_?.longest_streak}</p>
                                            <img src={fire} width={"20px"}/>
                                        </div>
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