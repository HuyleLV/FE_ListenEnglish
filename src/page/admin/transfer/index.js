import { Table, message, Space, Row, Col, Modal, Image, Select, Pagination } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjsInstance from "../../../utils/dayjs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchProps from "../../../component/SearchProps";
import dayjs from "dayjs";

export default function TransferDetail() {
  const [transfer, setTransfer] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
  });
  
  const fetchTransfer = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/transfer/getAll`, {params: pagination})
      .then((res) => {
        const data = res?.data;
        setTransfer(data);
      })
      .catch(() => message.error("Error server!"));
  };

  const removeTransfer = async (id) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/transfer/delete/${id}`
    ).finally(() => {
        fetchTransfer()
        message.success('Xoá thành công')
    })
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn xoá comment này?",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => removeTransfer(id),
    });
  };

  const updateTransfer = async (value, id) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/transfer/update/${id}`, {transfer_status: value})
      .finally(() => {
        fetchTransfer();
        message.success("Cập nhập thành công!");
      });
    
  };

  const optionTransfer = [
    { value: "1", label: "Chờ Xác nhận" },
    { value: "2", label: "Xác nhận" },
  ];
  
  useEffect(() => {
    fetchTransfer();
  }, [pagination]);

  const columns = [
    {
      title: <div>ID</div>,
      key: "transfer_id",
      dataIndex: "transfer_id",
      width: 50,
      sorter: (a, b) => a.transfer_id - b.transfer_id,
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
      sorter: (a, b) => a.transfer_price - b.transfer_price,
      render: (_, record) => <div>{record?.transfer_price}</div>,
    },
    {
      title: <div>Trạng thái</div>,
      key: "transfer_status",
      dataIndex: "transfer_status",
      width: 160,
      filters: [
        { text: 'Chờ xác nhận', value: 1 },
        { text: 'Xác nhận', value: 2 },
      ],
      onFilter: (value, record) => {
        return record?.transfer_status === value;
      },
      render: (_, record) => (
        <div>
            <Select
                options={optionTransfer}
                className={"w-[150px]"}
                value={record?.transfer_status === 1 ? "Chờ xác nhận" : "Xác nhận"}
                defaultValue={record?.transfer_status === 1 ? "Chờ xác nhận" : "Xác nhận"}
                onChange={(value) => updateTransfer(value, record?.transfer_id)}
                />
        </div>
      ),
    },
    {
      title: <div>Thời gian hết hạn</div>,
      key: "vip_expire_at",
      dataIndex: "vip_expire_at",
      width: 160,
      render: (_, record) => (
        <div>            
            {dayjs(record?.vip_expire_at).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      title: <div className={"base-table-cell-label "}>Ngày tạo</div>,
      key: "create_at",
      dataIndex: "create_at",
      width: 160,
      sorter: (a, b) => dayjs(a.create_at) - dayjs(b.create_at),
      render: (_, record) => {
        return (
          <div>
            <span className={"!inline-block min-w-[100px]"}>
              {dayjs(record?.create_at).format("DD/MM/YYYY")}
            </span>
          </div>
        );
      },
    },
    {
      title: <div>Người tạo</div>,
      key: "username",
      dataIndex: "username",
      width: 160,
      ...SearchProps("username"),
      render: (_, record) => <div>{record?.username}</div>,
    },
    {
      key: "operation",
      dataIndex: "operation",
      width: 50,
      render: (_, record) => {
        return (
          <Space>
            <div
              className={"text-[var(--red)]"}
              onClick={() => confirmDelete(record?.transfer_id)}
            >
              <DeleteOutlined />
            </div>
          </Space>
        );
      },
    }
    
  ];

  return (
    <>
      <div>
        <Row gutter={10} className={"mb-[8px]"}>
          <Col flex={1}>
            <div className={"text-[20px] font-medium pb-10 pt-5"}>Quản lý giao dịch</div>
          </Col>
        </Row>
      </div>
      <div className="w-full h-full mt-5 pb-20 relative">
        <Table
          className={"custom-table"}
          dataSource={transfer?.data}
          columns={columns}
          pagination={false}
        />
      
        <Pagination 
          className="flex justify-center absolute inset-x-0 bottom-24"
          current={pagination.page}
          total={transfer?.total}
          pageSize={pagination.pageSize}
          showSizeChanger
          onChange={(p, ps)=> {
            setPagination({
              page: p,
              pageSize: ps
            })
          }}
        />
      </div>
    </>
  );
}
