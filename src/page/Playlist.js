import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import Footer from "../component/Footer";
import { useCookies } from "react-cookie";
import {useDevice} from "../hooks";
import {Button, Col, Form, Input, message, Modal, Pagination, Row, Select} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export default function Playlist() {
    const { isMobile } = useDevice();
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({});
    const [selectedPlaylist, setPlaylist] = useState()
    const [form] = Form.useForm();

    const [dataPlaylist, setdataPlaylist] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 12,
    });

    const playlist = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/playlist`, {params: pagination, headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }});
            setdataPlaylist(response?.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        playlist();
    },[]);

    const handleEditPlaylist = (id) => {
        setPlaylist(id);
        setIsEditModalOpen(true);
    }
    const handleDeletePlaylist = (id) => {
        setPlaylist(id);
        setIsDeleteModalOpen(true);
    }
    const onSubmit = async (values) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/playlist`, values,{
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }}).finally(() => {
                message.success("Tạo Playlist thành công !");
                setTimeout(() => {
                    window.location.reload(false);
                }, 500);
            });

        } catch (error) {
            message.error("Tạo Playlist thất bại");
        }
    };

    const onSubmitEdit = async (values) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/playlist/${selectedPlaylist}`, values,{
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }}).finally(() => {
                message.success("Sửa Playlist thành công !");
                setTimeout(() => {
                    window.location.reload(false);
                }, 500);
            });

        } catch (error) {
            message.error("Sửa Playlist thất bại");
        }
    };

    const onSubmitDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/playlist/${selectedPlaylist}`,{
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }}).finally(() => {
                message.success("Xóa Playlist thành công !");
                setTimeout(() => {
                    window.location.reload(false);
                }, 500);
            });

        } catch (error) {
            message.error("Xóa Playlist thất bại");
        }
    };

    return (
        <>
            <div className="max-w-screen-xl items-center mx-auto p-4 pb-[150px]">
                <p className="text-4xl text-center py-10">Danh sách phát của tôi</p>
                {cookies?.user && <Button
                    type={"primary"}
                    className="bg-blue-500 mt-4"
                    onClick={() => setIsModalOpen(true)}
                >
                    Tạo danh sách phát
                </Button>}
                <Row className={isMobile ? 'text-center pt-[40px] text-white flex justify-center' : 'text-center pt-[40px] text-white'}>
                    {dataPlaylist?.data?.map((playlist, index) =>
                        <Col xs={24} xl={6}>
                            <div className='bg-gradient-to-r from-red-500 to-red-800 rounded-xl mt-2 mx-2 h-[150px]'>
                              <Link to={"/playlist/" + playlist.id}>
                                <div className='h-[100px] p-10'>
                                    <p className="pt-[10px] font-semibold text-xl">{playlist.id + ". " + playlist.title}</p>
                                </div>
                              </Link>
                              <button className="pt-[10px] font-semibold text-xl mr-20" onClick={() => handleEditPlaylist(playlist.id)}><EditOutlined /></button>
                              <button className="pt-[10px] font-semibold text-xl" onClick={() => handleDeletePlaylist(playlist.id)}><DeleteOutlined /></button>
                            </div>
                        </Col>
                    )}
                </Row>
                <Pagination
                    className="flex justify-center pt-[50px]"
                    current={pagination.page}
                    total={dataPlaylist?.total}
                    pageSize={pagination.pageSize}
                    onChange={(p, ps)=> {
                        setPagination({
                            page: p,
                            pageSize: ps
                        })
                    }}
                />
            </div>
            <Modal
                title="Tạo danh sách phát"
                style={{
                    top: 50,
                }}
                open={isModalOpen}
                onCancel={()=>setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    layout={"vertical"}
                    colon={false}
                    form={form}
                    initialValues={newPlaylist}
                    onFinishFailed={(e) => console.log(e)}
                    onFinish={onSubmit}
                >
                <Form.Item label="Tên" className="w-[300px]" name="title">
                    <Input
                        size="large"
                    />
                </Form.Item>
                    <Button
                        type={"primary"}
                        className="bg-blue-500 mr-4"
                        htmlType={"submit"}>
                        Save
                    </Button>
                    <Button
                        type={"default"}
                        className="mr-0 ml-auto"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </Button>

                </Form>
            </Modal>
            <Modal
                title="Sửa danh sách phát"
                style={{
                    top: 50,
                }}
                open={isEditModalOpen}
                onCancel={()=>setIsEditModalOpen(false)}
                footer={null}
            >
                <Form
                    layout={"vertical"}
                    colon={false}
                    form={form}
                    onFinishFailed={(e) => console.log(e)}
                    onFinish={onSubmitEdit}
                >
                    <Form.Item label="Tên" className="w-[300px]" name="title">
                        <Input
                            size="large"
                        />
                    </Form.Item>
                    <Button
                        type={"primary"}
                        className="bg-blue-500 mr-4"
                        htmlType={"submit"}>
                        Save
                    </Button>
                    <Button
                        type={"default"}
                        className="mr-0 ml-auto"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Cancel
                    </Button>

                </Form>
            </Modal>
            <Modal
                title="Xóa danh sách phát"
                style={{
                    top: 50,
                }}
                open={isDeleteModalOpen}
                onCancel={()=>setIsDeleteModalOpen(false)}
                footer={null}
            >
                <Button
                    type={"primary"}
                    className="bg-blue-500 mr-4 mt-4"
                    onClick={onSubmitDelete}
                >
                    Delete
                </Button>
                <Button
                    type={"default"}
                    className="mr-0 ml-auto"
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    Cancel
                </Button>
            </Modal>
            {Footer()}
        </>
    );
};
