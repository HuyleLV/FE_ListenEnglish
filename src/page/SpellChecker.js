import {Button, Form, message, Row, Space} from 'antd';
import axios from 'axios';
import {useEffect} from 'react';
import Footer from '../component/Footer';
import TextArea from "antd/es/input/TextArea";

export default function SpellChecker() {
    const [form] = Form.useForm();
    useEffect(() => {
    }, []);
    const onSubmit = async (values) => {
        const submitValues = {
            ...values,
        };

        try {
            await checkSpelling(submitValues.text);
            message.success("Checked successfully");
        } catch (error) {
            console.log(error);
            message.error("Checked failed");
        }
    };

    const handleTextChange = (e) => {
        form.setFieldValue('text', e.target.value);
    };

    const checkSpelling = async (text) => {
        const response = await axios.get(
            `https://1059-35-234-2-53.ngrok-free.app/predict?text=${text}`,
            {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        );
        form.setFieldValue('prediction', response.data.data.prediction);
    };

    return (
        <>
            <div className="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center py-10">Free Spell Checker</p>
                <Form
                    layout={"vertical"}
                    colon={false}
                    form={form}
                    initialValues={''}
                    onFinishFailed={(e) => console.log(e)}
                    onFinish={onSubmit}
                >
                    <Form.Item
                        label={"Text"}
                        name="text"
                        rules={[{required: true, message: "Please enter text!"}]}
                    >
                        <TextArea size="large" placeholder={"Enter text here..."} onChange={handleTextChange}/>
                    </Form.Item>
                    <Form.Item
                        label={"The sentence has been corrected for spelling errors"}
                        name="prediction"
                    >
                        <TextArea size="large"/>
                    </Form.Item>

                    <Row gutter={40} className={"my-[40px] pl-[20px]"}>
                        <Space align="center">
                            <Button type={"default"} htmlType={"submit"}>
                                Check
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </div>
            {Footer()}
        </>
    );
};
