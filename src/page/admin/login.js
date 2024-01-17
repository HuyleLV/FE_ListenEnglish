import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['admin']);


    const onFinish = async(values) => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/admin/loginAdmin`, values)
            .then((res) => {
                const data = res?.data;
                if(data.length > 0) {
                    setCookie('admin', data);
                    navigate('/admin');
                } else {
                    message.error("Thông tin đăng nhập sai!");
                }
            })
            .catch(() => message.error("Error server!"));
    };

    const onFinishFailed = (errorInfo) => {
        message.error("Bạn đang điền thiếu thông tin!");
    };
      

    return (
        <Form
            className='py-[150px]'
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <p className='text-center pb-10 text-4xl font-bold'>Login Admin</p>
            <Form.Item
                className='flex justify-center'
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input className='w-[500px]'/>
            </Form.Item>
            
            <Form.Item
                className='flex justify-center pb-5'
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password className='w-[500px]'/>
            </Form.Item>

            <Form.Item
                className='flex justify-center'
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" className='bg-blue-500 w-[250px] h-[50px]' htmlType="submit">
                    Login for Admin
                </Button>
            </Form.Item>
        </Form>
    );
}