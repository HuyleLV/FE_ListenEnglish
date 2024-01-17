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
  
  export default function TopicForm({
    id = "",
    initialValues = {},
    onSubmit = () => {},
  }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const deleteTopic = async () => {
      await axios
        .delete(`${process.env.REACT_APP_API_URL}/topic/delete/${id}`)
        .then(() => {
          message.success("Xoá bài viết thành công");
          navigate("/admin/topic");
        })
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
            label={"Tiều đề"}
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input size="large" placeholder={"Nhập"} />
          </Form.Item>
  
          <Row gutter={40} className={"my-[40px] pl-[20px]"}>
            <Space align="center">
              <Button type={"primary"} htmlType={"submit"}>
                {id ? "Cập nhập" : "Tạo"}
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
  