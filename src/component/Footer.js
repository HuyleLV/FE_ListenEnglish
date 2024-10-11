import { Button, Col, Dropdown, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { CustomerServiceOutlined, LikeOutlined, MailOutlined } from "@ant-design/icons";

export default function Footer() {

  return (
    <div className="float-end">
        {/* <div className="bg-gradient-to-r from-red-400 to-red-900 text-white">
            <Row className="max-w-screen-xl items-center mx-auto p-20">
                <Col xs={24} xl={8} className="flex">
                    <div className="px-2">
                        <CustomerServiceOutlined className="border-2 text-xl rounded-full p-2"/>
                    </div>
                    <div>
                        <p className="font-bold text-2xl">Practicing Stories</p>
                        <p className="text-sm font-medium pt-2">Want to speak English fluently? </p>
                        <p className="text-sm font-medium">Listen to our interactive stories to practice English speaking. English Easy Practice</p>
                    </div>
                </Col>
                <Col xs={24} xl={8} className="flex">
                    <div className="px-2">
                        <MailOutlined className="border-2 text-xl rounded-full p-2"/>
                    </div>
                    <div>
                        <p className="font-bold text-2xl">Practicing Stories</p>
                        <p className="text-sm font-medium pt-2">Want to speak English fluently? </p>
                        <p className="text-sm font-medium">Listen to our interactive stories to practice English speaking. English Easy Practice</p>
                    </div>
                </Col>
                <Col xs={24} xl={8} className="flex">
                    <div className="px-2">
                        <LikeOutlined className="border-2 text-xl rounded-full p-2"/>
                    </div>
                    <div>
                        <p className="font-bold text-2xl">Practicing Stories</p>
                        <p className="text-sm font-medium pt-2">Want to speak English fluently? </p>
                        <p className="text-sm font-medium">Listen to our interactive stories to practice English speaking. English Easy Practice</p>
                    </div>
                </Col>
            </Row>
        </div> */}
        <div className="flex bg-black justify-center py-5 text-white">
            <p className="pr-2 font-medium">Copyright © 2024 vualingo.com</p>
            <a href="https://engfluent.com/terms-of-service/"><p className="font-semibold">Terms of Service</p></a>
            <p className="px-2"> | </p>
            <a href="https://engfluent.com/privacy-policy/"><p className="font-semibold">Privacy Policy</p></a>
        </div>
    </div>
  );
}
