import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import {
    HeartFilled, HomeFilled, MessageFilled
  } from '@ant-design/icons';

export default function Home() {

    useEffect(() => {

    },[]);

    return (
        <>
            <div className='bg-gradient-to-r from-red-400 to-red-900 text-center text-white py-[140px]'>
                <p className="text-6xl py-10 font-bold">Effortless English</p>
                <p className="text-4xl pb-10">Listening Stories To Improve Speaking</p>
                <Link to={"/topic"}>
                    <button className='bg-green-600 px-8 py-4 text-white font-bold rounded'>
                        Start Learning
                    </button>
                </Link>
            </div>
            <div class="max-w-screen-xl items-center mx-auto">
                <div className='text-center py-10 text-xl'>
                    <p className=''><span className='font-semibold'>Improve English Speaking</span> By listening to our interactive stories.</p>
                    <p className='py-8'>You are learning English, that's great! However, if you want to speak English fluently <p>you must practice every day.</p></p>
                    <p className='pb-8'>Reading textbooks, studying grammar rules, memorizing Word lists, and taking tests<p>is not enough to improve speaking skills.</p></p>
                    <p>You should practice listening and speaking regularly to speak English fluently.</p>
                </div>

                <div className='bg-gradient-to-r from-red-400 to-red-900 rounded-lg text-center text-white font-semibold'>
                    <p className="text-2xl pt-10 pb-5">But how to practice English speaking anywhere and anytime you want?</p>
                    <p className="text-2xl pb-10">Listening Stories To Improve Speaking</p>
                </div>

                <Row className='pt-10 text-center'>
                    <Col xs={24} xl={8}>
                        <HeartFilled  className='text-[#d85e4b] text-6xl'/>
                        <div className='py-5'>
                            <p className='text-[#d85e4b] font-bold text-xl pb-2'>No stress, Just relax</p>
                            <p>There are no exams, grammar rules, fill in the</p>
                            <p>blank tests in our course. You will speak</p>
                            <p>trying to speak English. Be relax and just listen</p>
                            <p>to our English stories.</p>
                        </div>
                    </Col>
                    <Col xs={24} xl={8}>
                        <MessageFilled  className='text-[#d85e4b] text-6xl' />
                        <div className='py-5'>
                            <p className='text-[#d85e4b] font-bold text-xl pb-2'>Listen And Speak</p>
                            <p>There are no exams, grammar rules, fill in the</p>
                            <p>blank tests in our course. You will speak</p>
                            <p>trying to speak English. Be relax and just listen</p>
                            <p>to our English stories.</p>
                        </div>
                    </Col>
                    <Col xs={24} xl={8}>
                        <HomeFilled  className='text-[#d85e4b] text-6xl' />
                        <div className='py-5'>
                            <p className='text-[#d85e4b] font-bold text-xl pb-2'>Practice English At Home</p>
                            <p>There are no exams, grammar rules, fill in the</p>
                            <p>blank tests in our course. You will speak</p>
                            <p>trying to speak English. Be relax and just listen</p>
                            <p>to our English stories.</p>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className='bg-gradient-to-r from-red-400 to-red-900 rounded-lg text-center text-white font-bold mt-10 py-10'>
                <p className="text-xl pt-10 pb-5">Remember, It is not important to KNOW English…</p>
                <p className="text-2xl pb-5">But it is important to USE English.</p>
                <p className="text-lg pb-10">So you need to practice a lot.</p>
            </div>
        </>
    );
};