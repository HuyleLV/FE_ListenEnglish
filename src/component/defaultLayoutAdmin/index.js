import React from "react";
import { Layout, theme } from "antd";
import CustomeSider from "../customSider";
import { StyleProvider } from '@ant-design/cssinjs'
import { Admin } from "../../route/admin.route";

const { Content } = Layout;
export default function DefaultLayoutAdmin() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <StyleProvider hashPriority="high">
        <Layout className={"relative "} style={{ minHeight: "100vh" }}>
          <CustomeSider />
          <Layout className="site-layout">
            <Content
              className={"relative !-z-0 mt-[10px] p-[20px]"}
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Admin />
            </Content>
          </Layout>
        </Layout>
      </StyleProvider>
    </>
  );
}
