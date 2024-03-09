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
  const slug = params?.slug;
  const [cookies, setCookie, removeCookie] = useCookies(['admin']);

  const fetchBlog = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/blog/getBySlug/${slug}`)
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
    if (slug && slug !== "create") {
        fetchBlog();
    }
  }, [slug]);

  const onSubmit = async (values) => {
    const submitValues = {
      ...values,
      create_by: cookies?.admin[0]?.id
    };

    try {
      if (slug && slug !== "create") {
        await updateBlog(initialValues?.blog_id, submitValues);
        message.success("Cập nhật thành công");
      } else {
        await createBlog(submitValues);
        message.success("Tạo mới thành công");
      }
      navigate("/admin/blog");
    } catch (error) {
      console.log(error);
      message.error("Slug đã được sử dụng");

    }
  };

  useEffect(() => {
    if (slug) fetchBlog();
        form.resetFields();
  }, [form, slug]);

  return (
    <BlogForm
      id={slug && slug !== "create" ? initialValues?.blog_id : undefined}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
}
