import { Form, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import LessonForm from "../../../component/Lesson";
import { useCookies } from "react-cookie";

export default function LessonDetail() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const params = useParams();
  const id = params?.lesson_id;
  const [cookies, setCookie, removeCookie] = useCookies(['admin']);

  const fetchLesson = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/lesson/getById/${id}`)
      .then((res) => {
        const data = res?.data[0];
        const values = {
          ...data,
        };
        setInitialValues(values);
      });
  };

  const createLesson = async (values) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/lesson/create`,
      values
    );
  };

  const updateLesson = async (id, values) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/lesson/update/${id}`,
      values
    );
  };

  useEffect(() => {
    if (id && id !== "create") {
        fetchLesson();
    }
  }, [id]);

  const onSubmit = async (values) => {
    const submitValues = {
      ...values,
      create_by: cookies.admin[0]?.id
    };
    
    console.log(submitValues);

    try {
      if (id && id !== "create") {
        await updateLesson(id, submitValues);
        message.success("Cập nhập thành công");
      } else {
        await createLesson(submitValues);
        message.success("Tạo mới thành công");
      }
      navigate("/admin/lesson");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) fetchLesson();
        form.resetFields();
  }, [form, id]);

  return (
    <LessonForm
      id={id !== "create" ? id : undefined}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
}
