import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {

    const [dataTopic, setdataTopic] = useState([]);

    const topic = async () => {
        try {
          const response = await axios.get(`https://api.effortlessenglish.vip/topic/getAll`);
          setdataTopic(response.data);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        topic();
    });

    return (
        <div class="max-w-screen-xl items-center mx-auto p-4">
            <p className="text-4xl text-center py-10">Tất cả chương trình học</p>
            <div class="grid grid-cols-4 gap-4 text-center pt-[40px] text-white">

                {dataTopic.map((topic, index) => 
                    <div class="col-span-1 bg-sky-600 rounded-xl" key={index}>
                        <Link to={"/lesson/" + topic.id}>
                            <div className="p-10">
                                <div className="border rounded-full border-slate-200 border-2">
                                    <div className="bg-sky-400 w-[40%] rounded-full py-[3px]">
                                        <span className="font-bold">40%</span>
                                    </div>
                                </div>
                                <p className="pt-[10px] font-semibold text-xl">{topic.id + ". " + topic.title}</p>
                            </div>
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};