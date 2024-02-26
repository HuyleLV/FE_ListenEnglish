import axios from "axios";
import cd from "../component/icon/cd.png"
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Pagination } from "antd";
import Footer from "../component/Footer";
import { useCookies } from "react-cookie";
import dayjsInstance from "../utils/dayjs";

export default function Playlist() {

    const { topic_id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSpeakOpen, setIsModalSpeakOpen] = useState(false);
    const [dataLesson, setdataLesson] = useState([]);
    const [pagination, setPagination] = useState({
      page: 1,
      pageSize: 12,
    });
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const lesson = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/lesson/getByIdTopic/${topic_id}`, {params: pagination});
          setdataLesson(response?.data[0]);
        } catch (error) {
          console.error(error);
        }
    }

    useEffect(() => {
        lesson();
    },[]);

    return (
        <>
            <div class="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-center text-xl font-bold py-10">Playlist</p>
                
            </div>
            {Footer()}
        </>
    );
};