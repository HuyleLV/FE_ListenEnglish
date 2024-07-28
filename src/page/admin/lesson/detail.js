import {Form, message} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import LessonForm from "../../../component/Lesson";
import {useCookies} from "react-cookie";

export default function LessonDetail() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState({});
    const params = useParams();
    const slug = params?.slug;
    const [cookies, setCookie, removeCookie] = useCookies(['admin']);

    const fetchLesson = async () => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}/lesson/getBySlug/${slug}`)
            .then((res) => {
                const data = res?.data[0];
                const values = {
                    ...data,
                };
                setInitialValues(values);
            });
    };

    const createLesson = async (values) => {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/lesson/create`,
            values
        );
    };

    const updateLesson = async (id, values) => {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/lesson/update/${id}`,
            values
        );
    };

    useEffect(() => {
        if (slug && slug !== "create") {
            fetchLesson();
        }
    }, [slug]);

    const onSubmit = async (values) => {
        const submitValues = {
            ...values,
            create_by: cookies.admin[0]?.id
        };


        try {
            if (slug && slug !== "create") {
                await updateLesson(initialValues?.id, submitValues);
                message.success("Cập nhật thành công");
            } else {
                await createLesson(submitValues);
                message.success("Tạo mới thành công");
            }
            navigate("/admin/lesson");
        } catch (error) {
            console.log(error);
            message.error("Sai thông tin");
        }
    };

    useEffect(() => {
        if (slug && slug !== "create") fetchLesson();
        form.resetFields();
    }, [form, slug]);

    return (
        <LessonForm
            id={slug !== "create" ? initialValues?.id : undefined}
            initialValues={initialValues}
            onSubmit={onSubmit}
        />
    );
}
