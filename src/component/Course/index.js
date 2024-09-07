import {Button, Form, Input, message, Modal, Row, Select, Space,} from "antd";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import 'react-quill/dist/quill.snow.css';
import slugify from "slugify";

export default function CourseForm({
                                       id = "",
                                       initialValues = {},
                                       onSubmit = () => {
                                       },
                                   }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [topics, setTopics] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
    });

    const fetchTopics = async () => {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_API_URL}/topic/getAll`, {params: pagination}
            );
            setTopics(result?.data?.data);
        } catch (e) {
            message.error(e);
        }
    };

    const deleteCourse = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/course/delete/${id}`)
            .then(() => {
                message.success("Xoá khóa học thành công");
                navigate("/admin/course");
            })
    };

    const handleCourseSlugChange = (e) => {
        form.setFieldValue('slug', slugify(e.target.value, {lower: true}));
    };

    useEffect(() => {
        fetchTopics();
        if (Object.keys(initialValues)?.length > 0) {
            form.resetFields();
        }
    }, [form, initialValues]);

    const confirmDeleteBusiness = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined/>,
            content: "Bạn có chắc chắn xoá khóa học này?",
            okText: "Xác nhận",
            cancelText: "Huỷ",
            onOk: () => deleteCourse(),
        });
    };
    return (
        <div className={"p-[40px] bg-white rounded-[10px]"}>
            <div className={"!text-[#2d2e32] pb-[10px]"}>
                <Link
                    to={"/admin/course"}
                    className={
                        "text-[18px] sm:text-[24px] md:text-[26px] xl:text-[26px] font-[500] cursor-pointer "
                    }
                >
                    {"Thông tin Course"}
                </Link>
            </div>

            <Form
                layout={"vertical"}
                colon={false}
                form={form}
                initialValues={initialValues}
                onFinishFailed={(e) => console.log(e)}
                onFinish={onSubmit}
            >
                <Form.Item
                    label={"Tiêu đề"}
                    name="title"
                    rules={[{required: true, message: "Vui lòng nhập tên!"}]}
                >
                    <Input size="large" placeholder={"Nhập"} onChange={handleCourseSlugChange}/>
                </Form.Item>
                <Form.Item
                    label={"Slug"}
                    name="slug"
                    rules={[{required: true, message: "Vui lòng nhập tên!"}]}
                >
                    <Input size="large" placeholder={"Nhập"} onBlur={handleCourseSlugChange}/>
                </Form.Item>
                <Form.Item
                    label={"Topic"}
                    name="topic_id"
                    rules={[{required: true, message: "Vui lòng chọn Topic!"}]}
                >
                    <Select
                        showSearch
                        size="large"
                        placeholder="Select a person"
                        optionFilterProp="children"
                        options={topics?.map((value) => ({
                            value: value.id,
                            label: value.title,
                        }))}
                    />
                </Form.Item>
                <Row gutter={40} className={"my-[40px] pl-[20px]"}>
                    <Space align="center">
                        <Button type={"primary"} htmlType={"submit"}>
                            {id ? "Cập nhật" : "Tạo"}
                        </Button>
                        {id && (
                            <Button type={"primary"} danger onClick={confirmDeleteBusiness}>
                                Xoá
                            </Button>
                        )}
                    </Space>
                </Row>
            </Form>
        </div>
    );
}
