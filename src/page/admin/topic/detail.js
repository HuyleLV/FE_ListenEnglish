import { Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import TopicForm from "../../../component/Topic";
import { useCookies } from "react-cookie";

export default function TopicDetail() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const params = useParams();
  const id = params?.topic_id;

  const fetchTopic = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/topic/getById/${id}`)
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
    if (id && id !== "create") {
        fetchTopic();
    }
  }, [id]);

  const onSubmit = async (values) => {
    const submitValues = {
      ...values,
    //   create_by: cookies.admin?.user_id
    };

    try {
      if (id && id !== "create") {
        await updateTopic(id, submitValues);
        message.success("Cập nhập thành công");
      } else {
        await createTopic(submitValues);
        message.success("Tạo mới thành công");
      }
      navigate("/admin/topic");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) fetchTopic();
        form.resetFields();
  }, [form, id]);

  return (
    <TopicForm
      id={id !== "create" ? id : undefined}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
}
