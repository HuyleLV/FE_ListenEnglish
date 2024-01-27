import { Button, Col, Form, Input, Row, message } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import google from "../component/image/google.png";
import { GoogleLogin, GoogleOAuthProvider, GoogleOAuthenProvider, googleLogout } from '@react-oauth/google';
import Footer from "../component/Footer";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [cookiesToken, setCookieToken, removeCookieToken] = useCookies(["accessToken"]);

  const loginUser = async (values) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/user/login`, values)
      .then((res) => {
        console.log(res?.data);
        setCookieToken("accessToken", res?.data);
        message.success("Đăng nhập thành công!");
        navigate("/");
      })
      .catch(() => message.error("Tài khoản hoặc mật khẩu không đúng!"));
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Bạn đang điền thiếu thông tin!");
  };

  const loginGmail = async(credentialResponse) => {
    console.log(credentialResponse?.credential);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        googleId: credentialResponse?.credential,
      })
      .then((res) => {
        console.log(res?.data);
        setCookie("user", res?.data);
        message.success("Đăng nhập thành công!");
        navigate("/");
      })
      .catch(() => message.error("Tài khoản hoặc mật khẩu không đúng!"));
  };

  return (
    <>
      <div className="pb-[150px] pt-[50px]">
        <div className="mb-[10px]">
          <div className="pt-[20px] text-[40px] text-[var(--red)] flex justify-center">
            Sign in
          </div>
        </div>
        <Row justify={"center"} align={"middle"} style={{ height: "300px" }}>
          <Col lg={14} xs={22} style={{ maxWidth: 380 }}>
            <Form
              onFinish={loginUser}
              onFinishFailed={onFinishFailed} 
              name="basic" 
              layout={"vertical"} 
              colon={false}>
              <Form.Item name="email">
                <Input
                  className="!rounded-none p-[10px]"
                  size={"large"}
                  placeholder="Login"
                />
              </Form.Item>
              <Form.Item name="password" className="mt-[-6px]">
                <Input.Password
                  className="!rounded-none p-[10px]"
                  size={"large"}
                  placeholder="Password"
                />
              </Form.Item>
              <Button
                style={{
                  background: "white",
                  width: "100%",
                  height: 40,
                  marginTop: 10
                }}
                size={"large"}
                htmlType="submit"
                shape="round"
                onClick={loginUser}
              >
                <span className="font-semibold text-lg">Log in</span>
              </Button>

              <div className="mt-4 flex justify-center">
                <GoogleOAuthProvider clientId="750712194074-i97s9pu85722m8rs0rjt6vki2fr4v6fm.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={loginGmail}
                    onError={(err)=>console.log(err)}
                    shape="pill"
                    theme="outline"
                    size="large"
                    width={"380px"}
                  />
                </GoogleOAuthProvider>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
      {Footer()}
    </>
  );
};

export default Login;
