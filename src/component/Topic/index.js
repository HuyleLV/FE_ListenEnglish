import {Button, Form, Input, message, Modal, Row, Space,} from "antd";
import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import CustomUpload from "../customUpload";
import slugify from "slugify";

export default function TopicForm({
                                      id = "",
                                      initialValues = {},
                                      onSubmit = () => {
                                      },
                                  }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const deleteTopic = async () => {
        await axios
            .delete(`${process.env.REACT_APP_API_URL}/topic/deleteBySlug/${initialValues?.slug}`)
            .then(() => {
                message.success("Xoá bài viết thành công");
                navigate("/admin/topic");
            })
    };

    const handleTopicSlugChange = (e) => {
        form.setFieldValue('slug', slugify(e.target.value, {lower: true}));
    };

    useEffect(() => {
        if (Object.keys(initialValues)?.length > 0) {
            form.resetFields();
        }
    }, [form, initialValues]);

    const confirmDeleteBusiness = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined/>,
            content: "Bạn có chắc chắn xoá bài viết này?",
            okText: "Xác nhận",
            cancelText: "Huỷ",
            onOk: () => deleteTopic(),
        });
    };

    return (
        <div className={"p-[40px] bg-white rounded-[10px]"}>
            <div className={"!text-[#2d2e32] pb-[10px]"}>
                <Link
                    to={"/admin/topic"}
                    className={
                        "text-[18px] sm:text-[24px] md:text-[26px] xl:text-[26px] font-[500] cursor-pointer "
                    }
                >
                    {"Thông tin Topic"}
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
                    <Input size="large" placeholder={"Nhập"} onChange={handleTopicSlugChange}/>
                </Form.Item>
                <Form.Item
                    label={"Slug"}
                    name="slug"
                    rules={[{required: true, message: "Vui lòng nhập tên!"}]}
                >
                    <Input size="large" placeholder={"Nhập"} onBlur={handleTopicSlugChange}/>
                </Form.Item>

                <Form.Item
                    label={"Ảnh topic"}
                    name="image_url"
                    rules={[{required: true, message: "Vui lòng chọn ảnh!"}]}
                >
                    <CustomUpload type="image" accept=".png, .jpg, .jpeg, .jfif"/>
                </Form.Item>
                <Form.Item
                    name="image_url"
                >
                    <Input size="large" placeholder={"Nhập url"}/>
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
