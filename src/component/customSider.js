import { Image, Layout, Menu } from "antd";
import React, { useEffect } from "react";
import {
  MessageOutlined,
  UserOutlined,
  VideoCameraOutlined,
  AppstoreOutlined,
  TransactionOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const { Sider } = Layout;


export default function CustomeSider() {

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['admin']);

  const menuItem = [
    {
      key: "user",
      icon: <UserOutlined />,
      label: <Link to={"/admin/user"}>Quản lí người dùng</Link>,
    },
    {
      key: "product",
      icon: <VideoCameraOutlined />,
      label: <Link to={"/admin/blog"}>Quản lí bài viết</Link>,
    },
    {
      key: "topic",
      icon: <VideoCameraOutlined />,
      label: <Link to={"/admin/topic"}>Quản lí Topic</Link>,
    },
    {
      key: "lesson",
      icon: <VideoCameraOutlined />,
      label: <Link to={"/admin/lesson"}>Quản lí Lesson</Link>,
    },
  ];

  useEffect(() => {
    if(!cookies?.admin) {
      navigate("/loginAdmin");
    }
  }, [cookies?.admin]);
  
  return (
    <div className="!w-[250px]">
      <Sider className={"!h-full !w-full !bg-white"}>
        <div
          className={
            "!bg-primary-color h-[68px] px-5 flex justify-center cursor-pointer "
          }
        >
          <div
            className={
              "text-[var(--blue)] text-[28px] font-bold cursor-pointer leading-[26px] self-center "
            }
          >
            App English
          </div>
        </div>
        {/* <div className="flex items-center px-5 border">
          <Image
            preview={false}
            src={cookies.admin?.photos}
            width={30}
            height={30}
          />
          <div className="ml-[10px] font-bold">
            {cookies.admin?.displayName}
          </div>
        </div> */}
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItem}
        />
      </Sider>
    </div>
  );
}
