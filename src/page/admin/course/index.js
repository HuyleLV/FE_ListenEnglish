import axios from 'axios';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Col, Layout, message, Pagination, Row, Table} from 'antd';
import dayjs from 'dayjs';
import dayjsInstance from '../../../utils/dayjs';
import {EditOutlined} from '@ant-design/icons';

const {Header, Footer, Sider, Content} = Layout;

export default function CourseDashboard() {

    const [dataCourse, setDataCourse] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    const getAllCourses = async () => {
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/course/getAll`, {params: pagination})
                .then((res) => {
                    const data = res?.data;
                    setDataCourse(data);
                })
                .catch(() => message.error("Error server!"));
        } catch (error) {
            message.error(error);
        }
    }

    useEffect(() => {
        getAllCourses();
    }, []);

    const columns = [
        {
            title: <div className={"base-table-cell-label"}>ID</div>,
            key: "id",
            dataIndex: "id",
            sorter: (a, b) => a.id - b.id,
            width: 50,
            render: (_, record) => <div>{record?.id}</div>,
        },
        {
            title: <div className={"base-table-cell-label"}>Tiêu đề</div>,
            key: "title",
            dataIndex: "title",
            width: 200,
            render: (_, record) => <div>{record?.title}</div>,
        },
        {
            title: <div className={"base-table-cell-label"}>Slug</div>,
            key: "slug",
            dataIndex: "slug",
            width: 200,
            render: (_, record) => <div>{record?.slug}</div>,
        },
        {
            title: <div className={"base-table-cell-label"}>Topic</div>,
            key: "topic_title",
            dataIndex: "topic_title",
            width: 200,
            render: (_, record) => <div>{record?.topic_title}</div>,
        },
        {
            title: <div className={"base-table-cell-label "}>Ngày tạo</div>,
            key: "create_at",
            dataIndex: "create_at",
            width: 150,
            sorter: (a, b) => dayjs(a.create_at) - dayjs(b.create_at),
            render: (_, record) => {
                return (
                    <div className={"cursor-pointer text-[14px] font-normal"}>
                    <span className={"!inline-block min-w-[100px]"}>
                    {dayjsInstance(record?.create_at).format("DD/MM/YYYY")}
                    </span>
                    </div>
                );
            },
        },
        {
            title: <div className={"base-table-cell-label"}>Người tạo</div>,
            key: "create_by",
            dataIndex: "create_by",
            width: 150,
            render: (_, record) => <div>{record?.username}</div>,
        },
        {
            key: "operation",
            dataIndex: "operation",
            width: 50,
            render: (_, record) => {
                return (
                    <Link
                        to={`/admin/course/${record?.slug}`}
                        className={"text-[var(--blue)]"}
                    >
                        <EditOutlined/>
                    </Link>
                );
            },
        },
    ];

    return (
        <>
            <Row gutter={10} className={"mb-[8px]"}>
                <Col flex={1}>
                    <div className={"text-[20px] font-medium"}>Quản lý Course</div>
                </Col>
                <Col>
                    <Link to={"/admin/course/create"}>
                        <Button type={"primary"}>
                            Tạo
                        </Button>
                    </Link>
                </Col>
            </Row>
            <div className="w-full h-full mt-5 pb-20 relative">
                <Table
                    className={"custom-table"}
                    dataSource={dataCourse?.data}
                    columns={columns}
                    pagination={false}
                />
                <Pagination
                    className="flex justify-center absolute inset-x-0 bottom-10"
                    current={pagination.page}
                    total={dataCourse?.total}
                    pageSize={pagination.pageSize}
                    showSizeChanger
                    onChange={(p, ps) => {
                        setPagination({
                            page: p,
                            pageSize: ps
                        })
                    }}
                />
            </div>
        </>
    );
};
