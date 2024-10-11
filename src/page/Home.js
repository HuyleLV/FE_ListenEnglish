import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import check from "../component/image/check.png";
import typeImg from "../component/image/type.png";
import listen from "../component/image/listen.png";
import read from "../component/image/read.png";
import Footer from '../component/Footer';

export default function Home() {

    useEffect(() => {

    },[]);

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto">
                <div className='py-20 border-b'>
                    <p className='font-semibold text-4xl pb-10'>Practice English with dictation <br></br>exercises</p>
                    <p className='leading-7'>
                        Dictation is a method to learn languages by listening and writing down what you hear.<br></br> It is a highly effective method!
                    </p>
                    <p className='pt-2 leading-7'>This website contains hundreds of dictation exercises to help English learners practice<br></br> easily and improve quickly.</p>
                    <div className='flex items-center pt-10'>
                        <button className='text-lg font-semibold text-white py-2 px-4 bg-blue-600 rounded-lg'>Start Now</button>
                        <p className='pl-5'>It's 100% FREE!</p>
                    </div>
                </div>

                <div className='py-10 border-b'>
                    <p className='font-semibold text-3xl pb-5 text-center'>How practicing dictation will improve your English skills?</p>
                    <p className='text-center'>When practicing exercises at dailydictation.com, you will go through 4 main steps, <br></br>all of them are equally important!</p>
                    <Row className='py-10'>
                        <Col xs={24} xl={12} className='py-8 text-center'>
                            <div className='flex justify-center'>
                                <img src={listen} className='w-40'/>
                            </div>
                            <p className='font-semibold text-2xl py-5'>1. Listen to the audio</p>
                            <p className='text-gray-600 font-normal'>
                                Through the exercises, you will have to listen a lot; that's the key to improving your <br></br>listening skills in any learning method.
                            </p>
                        </Col>
                        <Col xs={24} xl={12} className='py-8 text-center'>
                            <div className='flex justify-center'>
                                <img src={typeImg} className='w-40'/>
                            </div>
                            <p className='font-semibold text-2xl py-5'>2. Type what you hear</p>
                            <p className='text-gray-600 font-normal'>
                                Typing what you hear forces you to focus on every detail which helps you become better<br></br> at pronunciation, spelling and writing.
                            </p>
                        </Col>
                        <Col xs={24} xl={12} className='py-8 text-center'>
                            <div className='flex justify-center'>
                                <img src={check} className='w-40'/>
                            </div>
                            <p className='font-semibold text-2xl py-5'>3. Check & correct</p>
                            <p className='text-gray-600 font-normal'>
                                Error correction is important for your listening accuracy and reading comprehension, it's<br></br> best to learn from mistakes.
                            </p>
                        </Col>
                        <Col xs={24} xl={12} className='py-8 text-center'>
                            <div className='flex justify-center'>
                                <img src={read} className='w-40'/>
                            </div>
                            <p className='font-semibold text-2xl py-5'>4. Read it out loud</p>
                            <p className='text-gray-600 font-normal'>
                                After complete a sentence, try to read it out loud, it will greatly improve your<br></br> pronunciation & speaking skills!
                            </p>
                        </Col>
                    </Row>
                </div>

                <div className='py-10 border-b'>
                    <p className='font-semibold text-3xl pb-5 text-center'>Frequently Asked Questions?</p>
                    <p className='text-center'>When practicing exercises at dailydictation.com, you will go through 4 main steps, <br></br>all of them are equally important!</p>
                    <Row className='py-10'>
                        <Col xs={24} xl={12} className='p-2'>
                            <p className='font-semibold text-2xl py-5'>Is this program free?</p>
                            <p className='text-gray-600 font-normal'>
                                Yes, it's 100% FREE!
                            </p>
                        </Col>
                        <Col xs={24} xl={12} className='p-2'>
                            <p className='font-semibold text-2xl py-5'>Is this website for beginners?</p>
                            <p className='text-gray-600 font-normal'>
                                As long as you can understand this page, you're good to go! But it's better if you know basic English pronunciation, if you don't, watch this...
                            </p>
                        </Col>
                        <Col xs={24} xl={12} className='p-2'>
                            <p className='font-semibold text-2xl py-5'>How long will it take to become fluent with this website?</p>
                            <p className='text-gray-600 font-normal'>
                                It depends on many things (such as your current level, how many hours you will spend each day). I can only say that your English will improve very quickly with this method.
                            </p>
                        </Col>
                        <Col xs={24} xl={12} className='p-2'>
                            <p className='font-semibold text-2xl py-5'>Will my speaking skills improve using this method?</p>
                            <p className='text-gray-600 font-normal'>
                                Speaking and listening skills are related together, once you have better listening skills, it's much easier and faster to improve your speaking skills.
                                Also, you can try to read out loud what you hear, your skills will improve really quickly!
                            </p>
                        </Col>
                    </Row>
                </div>
            </div>

            <Footer/>
        </>
    );
};