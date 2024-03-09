import {
    Form,
    Row,
    Input,
    Space,
    Button,
    message,
    InputNumber,
    Select,
    Modal,
    Col,
  } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CustomUpload from "../customUpload";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TextArea from "antd/es/input/TextArea";
import slugify from "slugify";

export default function LessonForm({
    id = "",
    initialValues = {},
    onSubmit = () => {},
  }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [topic, setTopic] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
    });

    const fetchTopic = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/topic/getAll`, {params: pagination}
        );
        setTopic(result?.data?.data);
      } catch (e) {
        message.error(e);
      }
    };

    const deleteLesson = async () => {
      await axios
        .delete(`${process.env.REACT_APP_API_URL}/lesson/delete/${id}`)
        .then(() => {
          message.success("Xoá bài viết thành công");
          navigate("/admin/lesson");
        })
    };

    const handleLessonSlugChange = (e) => {
        form.setFieldValue('slug', slugify(e.target.value, {lower: true}));
    };

    useEffect(() => {
        fetchTopic();
        if (Object.keys(initialValues)?.length > 0) {
            form.resetFields();
        }
    }, [form, initialValues]);

    const confirmDeleteBusiness = () => {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: "Bạn có chắc chắn xoá bài viết này?",
        okText: "Xác nhận",
        cancelText: "Huỷ",
        onOk: () => deleteLesson(),
      });
    };
    return (
      <div className={"p-[40px] bg-white rounded-[10px]"}>
        <div className={"!text-[#2d2e32] pb-[10px]"}>
          <Link
            to={"/admin/lesson"}
            className={
              "text-[18px] sm:text-[24px] md:text-[26px] xl:text-[26px] font-[500] cursor-pointer "
            }
          >
            {"Thông tin Lesson"}
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
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
                <Input size="large" placeholder={"Nhập"} onChange={handleLessonSlugChange}/>
            </Form.Item>
            <Form.Item
                label={"Slug"}
                name="slug"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
                <Input size="large" placeholder={"Nhập"} onBlur={handleLessonSlugChange}/>
            </Form.Item>
            <Row className="flex justify-center">
                <Col span={4} className="mr-4">
                    <Form.Item
                        label={"mainStory"}
                        name="mainStory"
                        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                    >
                        <TextArea placeholder={"Nhập"} style={{height: "500px"}}/>
                    </Form.Item>
                    <Form.Item
                        className="flex justify-center"
                        label={"mainStory Audio"}
                        name="mainStoryAudio"
                        rules={[{ required: true, message: "Vui lòng chọn audio!" }]}
                    >
                        <CustomUpload type="file" accept=".mp3, .jpg, .jpeg, .jfif" />
                    </Form.Item>
                </Col>
                <Col span={4} className="mx-4">
                    <Form.Item
                        label={"vocabulary"}
                        name="vocabulary"
                        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                    >
                        <TextArea placeholder={"Nhập"} style={{height: "500px"}}/>
                    </Form.Item>
                    <Form.Item
                        className="flex justify-center"
                        label={"vocabulary Audio"}
                        name="vocabularyAudio"
                        rules={[{ required: true, message: "Vui lòng chọn audio!" }]}
                    >
                        <CustomUpload type="file" accept=".mp3, .jpg, .jpeg, .jfif" />
                    </Form.Item>
                </Col>
                <Col span={4} className="mx-4">
                    <Form.Item
                        label={"miniStory"}
                        name="miniStory"
                    >
                        <TextArea placeholder={"Nhập"} style={{height: "500px"}}/>
                    </Form.Item>
                    <Form.Item
                        className="flex justify-center"
                        label={"miniStory Audio"}
                        name="miniStoryAudio"
                    >
                        <CustomUpload type="file" accept=".mp3, .jpg, .jpeg, .jfif" />
                    </Form.Item>
                </Col>
                <Col span={4} className="mx-4">
                    <Form.Item
                        label={"POV"}
                        name="POV"
                    >
                        <TextArea placeholder={"Nhập"} style={{height: "500px"}}/>
                    </Form.Item>
                    <Form.Item
                        className="flex justify-center"
                        label={"POV Audio"}
                        name="POVAudio"
                    >
                        <CustomUpload type="file" accept=".mp3, .jpg, .jpeg, .jfif" />
                    </Form.Item>
                </Col>
                <Col span={4} className="ml-4">
                    <Form.Item
                        label={"comment"}
                        name="comment"
                    >
                        <TextArea placeholder={"Nhập"} style={{height: "500px"}}/>
                    </Form.Item>
                    <Form.Item
                        className="flex justify-center"
                        label={"comment Audio"}
                        name="commentAudio"
                    >
                        <CustomUpload type="file" accept=".mp3, .jpg, .jpeg, .jfif" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12} className="px-10">
                    <Form.Item
                        label={"Status"}
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trang thai!" }]}
                    >
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select a person"
                            optionFilterProp="children"
                            options={[
                                {
                                    label: "Active",
                                    value: 1
                                },
                                {
                                    label: "UnActive",
                                    value: 2
                                }
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} className="px-10">
                    <Form.Item
                        label={"Topic"}
                        name="topic_id"
                        rules={[{ required: true, message: "Vui lòng chọn Topic!" }]}
                    >
                        <Select
                            showSearch
                            size="large"
                            placeholder="Select a person"
                            optionFilterProp="children"
                            options={topic?.map((value) => ({
                                value: value.id,
                                label: value.title,
                            }))}
                        />
                    </Form.Item>
                </Col>
            </Row>

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
