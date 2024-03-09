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
  } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CustomUpload from "../customUpload";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import slugify from "slugify";

  export default function BlogForm({
    id = "",
    initialValues = {},
    onSubmit = () => {},
  }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: [] }],
        [{ font: [] }],
        [{ align: ["right", "center", "justify"] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        [{ color: ["red", "#785412"] }],
        [{ background: ["red", "#785412"] }]
      ]
    };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "link",
      "color",
      "image",
      "background",
      "align",
      "size",
      "font"
    ];

    const deleteBlog = async () => {
      await axios
        .delete(`${process.env.REACT_APP_API_URL}/blog/deleteBySlug/${initialValues?.blog_slug}`)
        .then(() => {
          message.success("Xoá bài viết thành công");
          navigate("/admin/blog");
        })
    };

    const handleBlogSlugChange = (e) => {
      form.setFieldValue('blog_slug', slugify(e.target.value, {lower: true}));
    };

    useEffect(() => {
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
        onOk: () => deleteBlog(),
      });
    };
    return (
      <div className={"p-[40px] bg-white rounded-[10px]"}>
        <div className={"!text-[#2d2e32] pb-[10px]"}>
          <Link
            to={"/admin/blog"}
            className={
              "text-[18px] sm:text-[24px] md:text-[26px] xl:text-[26px] font-[500] cursor-pointer "
            }
          >
            {"Thông tin bài viết"}
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
            name="blog_title"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input size="large" placeholder={"Nhập"} onChange={handleBlogSlugChange}/>
          </Form.Item>

          <Form.Item
            label={"Slug"}
            name="blog_slug"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input size="large" placeholder={"Nhập"} onBlur={handleBlogSlugChange}/>
          </Form.Item>

          <Form.Item
            label={"Nội dung"}
            name="blog_description"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <ReactQuill className="h-[400px] pb-10" theme="snow" formats={formats} modules={modules}/>
          </Form.Item>

          <Form.Item
            label={"Ảnh bài viết"}
            name="blog_image"
            rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}
          >
            <CustomUpload type="image" accept=".png, .jpg, .jpeg, .jfif" />
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
