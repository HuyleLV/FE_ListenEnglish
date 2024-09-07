import React, {useEffect, useState} from "react";
import {Button, Col, Form, Image, Input, message, Modal, Pagination, Progress, Row, Select, Space, Table} from "antd";
import {useCookies} from "react-cookie";
import axios from "axios";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import Paragraph from "antd/es/typography/Paragraph";
import Footer from "../component/Footer";

export default function Profile() {
    const [cookies] = useCookies(["user"]);
    const [form] = Form.useForm();
    const [profile, setProfile] = useState({});
    const [transfer, setTransfer] = useState([]);
    const [enrolls, setEnrolls] = useState([]);
    const [streak, setStreak] = useState([]);
    const [editProfile, setEditProfile] = useState(false);
    const [pricePackage, setPricePackage] = useState("");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 8,
    });

    const fetchTransfer = async () => {
        await axios
            .get(
                `${process.env.REACT_APP_API_URL}/transfer/getByIdUser/${cookies?.user?.id}`, {params: pagination})
            .then((res) => {
                const data = res?.data;
                setTransfer(data);
            });
    };

    const fetchEnrolls = async () => {
        const res = await axios
            .get(
                `${process.env.REACT_APP_API_URL}/enroll`, {
                    params: pagination,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies?.user?.token}`
                    }
                });
        console.log(res.data)
        setEnrolls(res.data);
    };

    const getUserStreak = async () => {
        await axios.get(
            `${process.env.REACT_APP_API_URL}/user/me`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies?.user?.token}`
                }
            }
        ).then((res) => {
            const data = res?.data;
            setStreak(data);
        });
    }

    const vip_expire_at = (pricePackage) => {
        const today = new Date();
        if (pricePackage === "80000") {
            const vip_expire_at = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            return dayjs(vip_expire_at).format('YYYY/MM/DD');
        } else if (pricePackage === "600000") {
            const vip_expire_at = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            return dayjs(vip_expire_at).format('YYYY/MM/DD');
        } else if (pricePackage === "1400000") {
            const vip_expire_at = new Date(today.getFullYear() + 5, today.getMonth(), today.getDate());
            return dayjs(vip_expire_at).format('YYYY/MM/DD');
        } else {
            return null;
        }
    }

    const postTransfer = async () => {
        const dataTransfer = {
            transfer_content: cookies?.user?.email,
            transfer_price: pricePackage,
            vip_expire_at: vip_expire_at(pricePackage),
            create_by: cookies?.user?.id
        };

        await axios
            .post(
                `${process.env.REACT_APP_API_URL}/transfer/create`,
                dataTransfer
            )
            .finally(() => {
                message.success("Gửi lệnh chuyển tiền thành công !");
                setIsModalOpen(false);
                fetchTransfer();
            });
    }

    const onSubmit = async (values) => {
        if (values?.passwordNew === values?.comfirmPassword && values?.passwordNew !== undefined) {
            await axios
                .post(
                    `${process.env.REACT_APP_API_URL}/user/update/${cookies?.user?.id}`,
                    values
                )
                .finally(() => {
                    window.location.reload(false);
                    setEditProfile(false);
                    message.success("Cập nhật thông tin thành công !");
                });
        } else {
            message.error("Thông tin điền bị sai hoặc thiếu!");
        }
    };

    const handleProvinceChange = (value) => {
        if (value > 0) {
            return (
                <>
                    {value === "80000" ?
                        <>
                            <p className="pt-5 text-black font-bold text-2xl text-center">Package Vip 1</p>
                            <p className="pt-2 text-black font-semibold text-xl text-center">80.000 VND</p>
                        </>
                        : value === "600000" ?
                            <>
                                <p className="pt-5 text-black font-bold text-2xl text-center">Package Vip 2</p>
                                <p className="pt-2 text-black font-semibold text-xl text-center">600.000 VND</p>
                            </>
                            : value === "1400000" ?
                                <>
                                    <p className="pt-5 text-black font-bold text-2xl text-center">Package Vip 3</p>
                                    <p className="pt-2 text-black font-semibold text-xl text-center">1.400.000 VND</p>
                                </>
                                : <></>
                    }

                    <p className="font-semibold text-lg pb-3">Bank: MB Bank</p>
                    <p className="flex font-semibold text-lg">Content: <Paragraph copyable
                                                                                  className="pl-4 font-semibold text-lg">{cookies?.user?.email}</Paragraph>
                    </p>
                    <p className="flex font-semibold text-lg">Price: <Paragraph copyable
                                                                                className="pl-4 font-semibold text-lg">{value}</Paragraph>
                    </p>

                    <div className="flex justify-center py-5">
                        <img
                            src={`https://img.vietqr.io/image/MB-0336877888-compact.png?amount=${value}&addInfo="${cookies?.user?.email}"`}
                            className="w-[400px]"/>
                    </div>
                </>
            )
        }
    };

    useEffect(() => {
        if (Object.keys(profile)?.length > 0) {
            form.resetFields();
        }
    }, [form, profile]);

    const columns = [
        {
            title: <div>ID</div>,
            key: "transfer_id",
            dataIndex: "transfer_id",
            width: 50,
            render: (_, record) => <div>{record?.transfer_id}</div>,
        },
        {
            title: <div>Nội dung</div>,
            key: "transfer_content",
            dataIndex: "transfer_content",
            width: 160,
            render: (_, record) => <div>{record?.transfer_content}</div>,
        },
        {
            title: <div>Giá</div>,
            key: "transfer_price",
            dataIndex: "transfer_price",
            width: 160,
            render: (_, record) => <div>{record?.transfer_price}</div>,
        },
        {
            title: <div>Trạng thái</div>,
            key: "transfer_status",
            dataIndex: "transfer_status",
            width: 160,
            render: (_, record) => (
                <div>
                    {record?.transfer_status === 1 ?
                        <p className="font-bold text-yellow-500">Đang chờ xác nhận</p>
                        : <p className="font-bold text-green-500">Đã xác nhận</p>
                    }
                </div>
            ),
        },
        {
            title: <div className={"base-table-cell-label "}>Ngày tạo</div>,
            key: "create_at",
            dataIndex: "create_at",
            width: 160,
            render: (_, record) => {
                return (
                    <div>
            <span className={"!inline-block min-w-[100px]"}>
              {dayjs(record?.create_at).format("DD/MM/YYYY")}
            </span>
                    </div>
                );
            },
        }
    ];

    const enrollColumn = [
        {
            title: <div>ID</div>,
            key: "id",
            dataIndex: "id",
            width: 50,
            render: (_, record) => <div>{record?.lesson_id}</div>,
        },
        {
            title: <div>Bài học</div>,
            key: "lesson",
            dataIndex: "lesson",
            width: 160,
            render: (_, record) => <div>{record?.title}</div>,
        },
        {
            title: <div className={"base-table-cell-label "}>Ngày học</div>,
            key: "create_at",
            dataIndex: "create_at",
            width: 160,
            render: (_, record) => {
                return (
                    <div>
            <span className={"!inline-block min-w-[100px]"}>
              {dayjs(record?.update_at).format("DD/MM/YYYY")}
            </span>
                    </div>
                );
            },
        },
        {
            title: <div className={"base-table-cell-label "}>Thời gian học</div>,
            key: "create_at",
            dataIndex: "create_at",
            width: 160,
            render: (_, record) => {
                return (
                    <div>
            <span className={"!inline-block min-w-[100px]"}>
              {dayjs(record?.update_at).format("hh:mm")}
            </span>
                    </div>
                );
            },
        },
        {
            title: <div>Số lần học</div>,
            key: "count",
            dataIndex: "count",
            width: 160,
            render: (_, record) => <div>{record?.count}</div>,
        },
    ];

    useEffect(() => {
        fetchTransfer()
    }, [pagination]);
    useEffect(() => {
        fetchEnrolls();
    }, []);

    useEffect(() => {
        if (cookies?.user) {
            getUserStreak();
        }
    }, [cookies?.user]);

    return (
        <>
            <div className="py-[60px]">
                <Row justify={"center"} align={"middle"}>
                    <Col
                        lg={20}
                        xs={24}
                        className="p-[20px] border border-[var(--mid-gray)] rounded"
                    >
                        <Form
                            layout={"vertical"}
                            colon={false}
                            form={form}
                            initialValues={profile}
                            onFinishFailed={(e) => console.log(e)}
                            onFinish={onSubmit}
                        >
                            <Row gutter={20}>
                                <Col>
                                    <Image
                                        preview={false}
                                        src={cookies?.user?.avatar}
                                        width={120}
                                        height={120}
                                    />
                                </Col>
                                <Col>
                                    <div className="text-[26px] font-medium">
                                        {cookies?.user?.username}
                                    </div>
                                    <div className="text-[18px] font-normal">{cookies?.user?.email}</div>
                                    <Button
                                        type={"primary"}
                                        className="bg-blue-500 mt-4"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Update Vip
                                    </Button>
                                </Col>
                            </Row>
                            <Row xs={24} lg={12} className="pt-10">
                                {!editProfile ? (
                                    <>
                                        <Form.Item label="Password" className="w-[300px]">
                                            <Input
                                                disabled={!editProfile}
                                                size="large"
                                                placeholder="*********"
                                            />
                                        </Form.Item>
                                    </>
                                ) : (
                                    <>
                                        <Col xs={24} xl={8}>
                                            <Form.Item label="Password New" name="passwordNew" className="w-[300px]">
                                                <Input
                                                    disabled={!editProfile}
                                                    size="large"
                                                    placeholder="*********"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} xl={8}>
                                            <Form.Item label="Confirm Password" name="comfirmPassword"
                                                       className="w-[300px]">
                                                <Input
                                                    disabled={!editProfile}
                                                    size="large"
                                                    placeholder="*********"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </>
                                )}
                                <Col xs={24}>
                                    <Space>
                                        <Button
                                            type={"primary"}
                                            className="bg-blue-500"
                                            onClick={() => setEditProfile(!editProfile)}
                                        >
                                            Edit profile
                                        </Button>
                                        {editProfile && (
                                            <Button
                                                type={"primary"}
                                                className="bg-blue-500"
                                                htmlType={"submit"}>
                                                Save
                                            </Button>
                                        )}
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    {transfer?.data?.length > 0 && (
                        <Col
                            lg={20}
                            xs={24}
                            className="p-[20px] mt-5 border border-[var(--mid-gray)] rounded"
                        >
                            <p className="font-bold py-5 text-center text-xl">Lệnh chuyển tiền</p>
                            <Table
                                className={"custom-table pb-10"}
                                rowKey={(record) => record?.transfer_id + ""}
                                dataSource={transfer?.data}
                                columns={columns}
                                pagination={false}
                            />
                            <Pagination
                                className="flex justify-center"
                                current={pagination.page}
                                total={transfer?.total}
                                pageSize={pagination.pageSize}
                                onChange={(p) => {
                                    setPagination({
                                        page: p,
                                        pageSize: pagination.pageSize
                                    })
                                }}
                            />
                        </Col>
                    )}


                    <Col
                        lg={20}
                        xs={24}
                        className="p-[20px] mt-5 border border-[var(--mid-gray)] rounded"
                    >
                        <p className="font-bold py-5 text-center text-xl">Thời gian học</p>

                        <Progress className="flex justify-center py-5 font-bold" type="circle" percent={66}/>
                        <Row className="text-center">
                            <Col
                                xs={24} xl={6}
                            >
                                <div className="bg-red-200 p-4 m-2 rounded-xl">
                                    <p className="font-semibold text-lg">Streak hiện tại</p>
                                    <p className="font-semibold text-2xl">{streak?.current_streak}</p>
                                </div>
                            </Col>
                            <Col
                                xs={24} xl={6}
                            >
                                <div className="bg-red-200 p-4 m-2 rounded-xl">
                                    <p className="font-semibold text-lg">Streak dài nhất</p>
                                    <p className="font-semibold text-2xl">{streak?.longest_streak}</p>
                                </div>
                            </Col>
                            <Col
                                xs={24} xl={6}
                            >
                                <div className="bg-red-200 p-4 m-2 rounded-xl">
                                    <p className="font-semibold text-lg">Bản ghi âm</p>
                                    <p className="font-semibold text-2xl">{streak?.total_records}</p>
                                </div>
                            </Col>
                            <Col
                                xs={24} xl={6}
                            >
                                <div className="bg-red-200 p-4 m-2 rounded-xl">
                                    <p className="font-semibold text-lg">Chính xác</p>
                                    <p className="font-semibold text-2xl">{streak?.total_records !== 0 ? Math.floor(streak?.points / streak?.total_records) : 0}</p>
                                </div>
                            </Col>
                            <Col
                                xs={24} xl={6}
                            >
                                <div className="bg-red-200 p-4 m-2 rounded-xl">
                                    <p className="font-semibold text-lg">Tuần này</p>
                                    <p className="font-semibold text-2xl">
                                        {
                                            streak?.this_week
                                                ? Math.floor(streak?.this_week % 86400 / 3600) + "h " + Math.floor(streak?.this_week % 86400 % 3600 / 60) + "m " + Math.floor(streak?.this_week % 86400 % 3600 % 60) + "s"
                                                : "0h 0m 0s"
                                        }
                                    </p>
                                </div>
                            </Col>
                            <Col
                                xs={24} xl={6}
                            >
                                <div className="bg-red-200 p-4 m-2 rounded-xl">
                                    <p className="font-semibold text-lg">Tháng này</p>
                                    <p className="font-semibold text-2xl">
                                        {
                                            streak?.this_month
                                                ? Math.floor(streak?.this_month % 86400 / 3600) + "h " + Math.floor(streak?.this_month % 86400 % 3600 / 60) + "m " + Math.floor(streak?.this_month % 86400 % 3600 % 60) + "s"
                                                : "0h 0m 0s"
                                        }
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {enrolls.length > 0 && (
                        <Col
                            lg={20}
                            xs={24}
                            className="p-[20px] mt-5 border border-[var(--mid-gray)] rounded"
                        >
                            <p className="font-bold py-5 text-center text-xl">Lịch sử bài đã học</p>
                            <Table
                                className={"custom-table pb-10"}
                                rowKey={(record, index) => index + ""}
                                dataSource={enrolls}
                                columns={enrollColumn}
                                pagination={false}
                            />

                        </Col>
                    )}
                </Row>
                <Modal
                    title="Update Vip"
                    style={{
                        top: 50,
                    }}
                    open={isModalOpen}
                    onOk={postTransfer}
                    onCancel={() => setIsModalOpen(false)}
                    okText="Money transferred"
                    okButtonProps={{className: "bg-blue-500"}}
                >
                    <p>Select package:</p>
                    <Select
                        style={{
                            width: 200,
                        }}
                        defaultValue={"choose Package"}
                        onChange={(i) => setPricePackage(i)}
                        options={[
                            {
                                value: "80000",
                                label: '1 month',
                            },
                            {
                                value: "600000",
                                label: '1 year',
                            },
                            {
                                value: "1400000",
                                label: '5 year',
                            },
                        ]}
                    />
                    {handleProvinceChange(pricePackage)}
                </Modal>
            </div>
            {Footer()}
        </>
    );
}
