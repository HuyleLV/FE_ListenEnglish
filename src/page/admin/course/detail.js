import {Form, message} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import CourseForm from "../../../component/Course";

export default function CourseDetail() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState({});
    const params = useParams();
    const slug = params?.slug;
    const [cookies, setCookie, removeCookie] = useCookies(['admin']);

    const fetchCourse = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/course/getBySlug/${slug}`)
            .then((res) => {
                const data = res?.data[0];
                const values = {
                    ...data,
                };
                setInitialValues(values);
            });
    };

    const createCourse = async (values) => {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/course/create`,
            values
        );
    };

    const updateCourse = async (id, values) => {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/course/update/${id}`,
            values
        );
    };

    useEffect(() => {
        if (slug && slug !== "create") {
            fetchCourse();
        }
    }, [slug]);

    const onSubmit = async (values) => {
        const submitValues = {
            ...values,
            create_by: cookies.admin[0]?.id
        };


        try {
            if (slug && slug !== "create") {
                await updateCourse(initialValues?.id, submitValues);
                message.success("Cập nhật thành công");
            } else {
                await createCourse(submitValues);
                message.success("Tạo mới thành công");
            }
            navigate("/admin/course");
        } catch (error) {
            console.log(error);
            message.error("Sai thông tin");
        }
    };

    useEffect(() => {
        if (slug && slug !== "create") fetchCourse();
        form.resetFields();
    }, [form, slug]);

    return (
        <CourseForm
            id={slug !== "create" ? initialValues?.id : undefined}
            initialValues={initialValues}
            onSubmit={onSubmit}
        />
    );
}
