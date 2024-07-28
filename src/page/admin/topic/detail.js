import {Form, message} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import TopicForm from "../../../component/Topic";

export default function TopicDetail() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState({});
    const params = useParams();
    const slug = params?.slug;

    const fetchTopic = async () => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}/topic/getBySlug/${slug}`)
            .then((res) => {
                const data = res?.data[0];
                const values = {
                    ...data,
                };
                setInitialValues(values);
            });
    };

    const createTopic = async (values) => {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/topic/create`,
            values
        );
    };

    const updateTopic = async (id, values) => {
        await axios.post(
            `${process.env.REACT_APP_API_URL}/topic/update/${id}`,
            values
        );
    };

    useEffect(() => {
        if (slug && slug !== "create") {
            fetchTopic();
        }
    }, [slug]);

    const onSubmit = async (values) => {
        const submitValues = {
            ...values,
            //   create_by: cookies.admin?.user_id
        };

        try {
            if (slug && slug !== "create") {
                await updateTopic(initialValues?.id, submitValues);
                message.success("Cập nhật thành công");
            } else {
                await createTopic(submitValues);
                message.success("Tạo mới thành công");
            }
            navigate("/admin/topic");
        } catch (error) {
            console.log(error);
            message.error("Slug đã được sử dụng");

        }
    };

    useEffect(() => {
        if (slug && slug !== "create") fetchTopic();
        form.resetFields();
    }, [form, slug]);

    return (
        <TopicForm
            id={slug !== "create" ? initialValues?.id : undefined}
            initialValues={initialValues}
            onSubmit={onSubmit}
        />
    );
}
