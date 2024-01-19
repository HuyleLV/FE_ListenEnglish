import { Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import BlogForm from "../../../component/Blog";
import { useCookies } from "react-cookie";

export default function BlogDetail() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const params = useParams();
  const id = params?.blog_id;
  const [cookies, setCookie, removeCookie] = useCookies(['admin']);

  const fetchBlog = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/blog/getById/${id}`)
      .then((res) => {
        const data = res?.data[0];
        const values = {
          ...data,
        };
        setInitialValues(values);
      });
  };

  const createBlog = async (values) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/blog/create`,
      values
    );
  };

  const updateBlog = async (id, values) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/blog/update/${id}`,
      values
    );
  };

  useEffect(() => {
    if (id && id !== "create") {
        fetchBlog();
    }
  }, [id]);

  const onSubmit = async (values) => {
    const submitValues = {
      ...values,
      create_by: cookies?.admin[0]?.id
    };

    try {
      if (id && id !== "create") {
        await updateBlog(id, submitValues);
        message.success("Cập nhập thành công");
      } else {
        await createBlog(submitValues);
        message.success("Tạo mới thành công");
      }
      navigate("/admin/blog");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) fetchBlog();
        form.resetFields();
  }, [form, id]);

  return (
    <BlogForm
      id={id !== "create" ? id : undefined}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
}
