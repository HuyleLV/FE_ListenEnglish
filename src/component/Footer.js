import { Button, Col, Dropdown, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { CustomerServiceOutlined, LikeOutlined, MailOutlined } from "@ant-design/icons";

export default function Footer() {

  return (
    <>
        <div className="bg-gradient-to-r from-red-400 to-red-900 text-white">
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
        </div>
        <div className="bg-gradient-to-r from-red-800 to-red-900 text-center">
            <p className="text-2xl font-semibold text-white py-4">Effortless English</p>
        </div>
    </>
  );
}
