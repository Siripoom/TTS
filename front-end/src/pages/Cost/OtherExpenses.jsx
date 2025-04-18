import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Pagination,
  Input,
  Space,
  Modal,
  Form,
  InputNumber,
  Select,
  DatePicker,
  message,
  Statistic,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  CalendarOutlined,
  HomeOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./Costs.css";
import PropTypes from "prop-types";

const { Title, Text } = Typography;
const { Option } = Select;

const OtherExpenses = ({ sidebarVisible, toggleSidebar }) => {
  const [expenseRecords, setExpenseRecords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalCost: 0,
    avgCost: 0,
    expenseTypes: [],
  });

  const pageSize = 10;

  // Load mock data
  useEffect(() => {
    const mockExpenseRecords = [
      {
        id: "1",
        date: "2025-04-15",
        expenseType: "ค่าทางด่วน",
        description: "ค่าทางด่วนพิเศษ กรุงเทพ-พัทยา",
        amount: 250,
        paidBy: "บริษัท",
        vehicle: "กข-1234",
        driver: "นายสมชาย ใจดี",
        status: "approved",
        approvedBy: "Admin",
        receiptNo: "R-20250415-001",
      },
      {
        id: "2",
        date: "2025-04-14",
        expenseType: "ค่าปรับจราจร",
        description: "ค่าปรับจอดในที่ห้ามจอด",
        amount: 500,
        paidBy: "พนักงาน",
        vehicle: "ขค-5678",
        driver: "นายสมศักดิ์ รักดี",
        status: "pending",
        approvedBy: "",
        receiptNo: "TF-20250414-001",
      },
      {
        id: "3",
        date: "2025-04-10",
        expenseType: "ค่าที่พัก",
        description: "ค่าที่พักคนขับ จ.เชียงใหม่",
        amount: 800,
        paidBy: "บริษัท",
        vehicle: "คง-9012",
        driver: "นายสมหมาย พึ่งได้",
        status: "approved",
        approvedBy: "Admin",
        receiptNo: "R-20250410-002",
      },
      {
        id: "4",
        date: "2025-04-05",
        expenseType: "ค่าทางด่วน",
        description: "ค่าทางด่วนพิเศษ กรุงเทพ-ชลบุรี",
        amount: 180,
        paidBy: "บริษัท",
        vehicle: "กข-1234",
        driver: "นายสมชาย ใจดี",
        status: "approved",
        approvedBy: "Admin",
        receiptNo: "R-20250405-003",
      },
      {
        id: "5",
        date: "2025-04-03",
        expenseType: "ค่าอาหาร",
        description: "ค่าเบี้ยเลี้ยงคนขับ",
        amount: 300,
        paidBy: "บริษัท",
        vehicle: "งจ-3456",
        driver: "นายสมพงษ์ นามสกุล",
        status: "approved",
        approvedBy: "Admin",
        receiptNo: "R-20250403-004",
      },
      {
        id: "6",
        date: "2025-03-28",
        expenseType: "ค่าที่พัก",
        description: "ค่าที่พักคนขับ จ.ระยอง",
        amount: 650,
        paidBy: "บริษัท",
        vehicle: "ขค-5678",
        driver: "นายสมศักดิ์ รักดี",
        status: "approved",
        approvedBy: "Admin",
        receiptNo: "R-20250328-005",
      },
      {
        id: "7",
        date: "2025-03-25",
        expenseType: "ค่าจอดรถ",
        description: "ค่าจอดรถ ท่าเรือคลองเตย",
        amount: 150,
        paidBy: "พนักงาน",
        vehicle: "คง-9012",
        driver: "นายสมหมาย พึ่งได้",
        status: "rejected",
        approvedBy: "Admin",
        receiptNo: "R-20250325-006",
      },
      {
        id: "8",
        date: "2025-03-20",
        expenseType: "ค่าปรับจราจร",
        description: "ค่าปรับขับรถเร็วเกินกำหนด",
        amount: 800,
        paidBy: "พนักงาน",
        vehicle: "จฉ-7890",
        driver: "",
        status: "pending",
        approvedBy: "",
        receiptNo: "TF-20250320-002",
      },
    ];

    setExpenseRecords(mockExpenseRecords);

    // Calculate statistics
    const approvedRecords = mockExpenseRecords.filter(
      (record) => record.status === "approved"
    );
    const totalRecords = mockExpenseRecords.length;
    const totalCost = approvedRecords.reduce(
      (sum, record) => sum + record.amount,
      0
    );
    const avgCost =
      approvedRecords.length > 0 ? totalCost / approvedRecords.length : 0;

    // Group by expense type
    const typeMap = {};
    approvedRecords.forEach((record) => {
      if (!typeMap[record.expenseType]) {
        typeMap[record.expenseType] = {
          count: 0,
          totalCost: 0,
        };
      }
      typeMap[record.expenseType].count += 1;
      typeMap[record.expenseType].totalCost += record.amount;
    });

    const expenseTypes = Object.keys(typeMap).map((type) => ({
      type,
      count: typeMap[type].count,
      totalCost: typeMap[type].totalCost,
    }));

    setStats({
      totalRecords,
      totalCost,
      avgCost,
      expenseTypes,
    });
  }, []);

  // Filter records based on search text
  const filteredRecords = expenseRecords.filter(
    (record) =>
      record.expenseType.toLowerCase().includes(searchText.toLowerCase()) ||
      record.description.toLowerCase().includes(searchText.toLowerCase()) ||
      record.vehicle.toLowerCase().includes(searchText.toLowerCase()) ||
      (record.driver &&
        record.driver.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Show modal for adding/editing record
  const showModal = (record = null) => {
    setSelectedRecord(record);
    if (record) {
      form.setFieldsValue({
        expenseType: record.expenseType,
        date: record.date,
        description: record.description,
        amount: record.amount,
        paidBy: record.paidBy,
        vehicle: record.vehicle,
        driver: record.driver,
        status: record.status,
        receiptNo: record.receiptNo,
      });
    } else {
      form.resetFields();
      // Set default values
      form.setFieldsValue({
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        paidBy: "บริษัท",
      });
    }
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (selectedRecord) {
      // Update existing record
      const updatedRecords = expenseRecords.map((record) =>
        record.id === selectedRecord.id
          ? {
              ...record,
              ...values,
              approvedBy:
                values.status === "approved"
                  ? "Admin"
                  : values.status === "rejected"
                  ? "Admin"
                  : "",
            }
          : record
      );
      setExpenseRecords(updatedRecords);
      message.success("อัพเดตข้อมูลค่าใช้จ่ายเรียบร้อยแล้ว");
    } else {
      // Create new record
      const newRecord = {
        id: (expenseRecords.length + 1).toString(),
        ...values,
        approvedBy: values.status === "approved" ? "Admin" : "",
        receiptNo:
          values.receiptNo ||
          `R-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(
            expenseRecords.length + 1
          )
            .toString()
            .padStart(3, "0")}`,
      };
      setExpenseRecords([...expenseRecords, newRecord]);
      message.success("เพิ่มข้อมูลค่าใช้จ่ายเรียบร้อยแล้ว");
    }
    setIsModalVisible(false);
  };

  // Show delete confirmation dialog
  const showDeleteConfirm = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };

  // Handle record deletion
  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      const updatedRecords = expenseRecords.filter(
        (record) => record.id !== recordToDelete.id
      );
      setExpenseRecords(updatedRecords);
      message.success("ลบข้อมูลค่าใช้จ่ายเรียบร้อยแล้ว");
      setIsDeleteModalVisible(false);
      setRecordToDelete(null);
    }
  };

  // Table columns
  const columns = [
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "ประเภท",
      dataIndex: "expenseType",
      key: "expenseType",
    },
    {
      title: "รายละเอียด",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "รถ",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "คนขับ",
      dataIndex: "driver",
      key: "driver",
      render: (text) => text || "-",
    },
    {
      title: "จ่ายโดย",
      dataIndex: "paidBy",
      key: "paidBy",
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `฿${amount.toFixed(2)}`,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "approved"
            ? "green"
            : status === "rejected"
            ? "red"
            : "orange";
        let text =
          status === "approved"
            ? "อนุมัติแล้ว"
            : status === "rejected"
            ? "ไม่อนุมัติ"
            : "รอการอนุมัติ";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "จัดการ",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      <div className="costs-container">
        <div className="content-wrapper">
          {/* Breadcrumb */}
          <div className="page-header">
            <div className="breadcrumb">
              <HomeOutlined /> / ต้นทุน / ค่าใช้จ่ายอื่นๆ
            </div>
            <Title level={4}>จัดการค่าใช้จ่ายอื่นๆ</Title>
          </div>

          {/* Statistics Section */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="รายการทั้งหมด"
                  value={stats.totalRecords}
                  prefix={<FileTextOutlined />}
                  suffix="รายการ"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="ค่าใช้จ่ายที่อนุมัติแล้ว"
                  value={stats.totalCost}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="฿"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="stat-card">
                <Statistic
                  title="ค่าเฉลี่ยต่อรายการ"
                  value={stats.avgCost}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="฿"
                />
              </Card>
            </Col>
          </Row>

          {/* Expense Type Stats */}
          <Card className="mb-4" title="สถิติตามประเภทค่าใช้จ่าย">
            <Row gutter={[16, 16]}>
              {stats.expenseTypes
                .sort((a, b) => b.totalCost - a.totalCost)
                .map((type, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card size="small" className="category-card">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <AppstoreOutlined
                          style={{
                            fontSize: "24px",
                            marginRight: "12px",
                            color: "#1890ff",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: "bold" }}>{type.type}</div>
                          <div>จำนวน: {type.count} รายการ</div>
                          <div>ค่าใช้จ่ายรวม: ฿{type.totalCost.toFixed(2)}</div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Card>

          {/* Expense Records List */}
          <Card className="data-card mb-4">
            <div className="card-header">
              <Title level={4}>รายการค่าใช้จ่ายอื่นๆ</Title>
              <div className="card-actions">
                <Input
                  placeholder="ค้นหา..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250, marginRight: 16 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  เพิ่มค่าใช้จ่าย
                </Button>
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={filteredRecords.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="id"
              pagination={false}
            />

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredRecords.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Expense Record Modal */}
      <Modal
        title={
          selectedRecord ? "แก้ไขข้อมูลค่าใช้จ่าย" : "เพิ่มข้อมูลค่าใช้จ่าย"
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="expenseType"
                label="ประเภทค่าใช้จ่าย"
                rules={[
                  { required: true, message: "กรุณาเลือกประเภทค่าใช้จ่าย" },
                ]}
              >
                <Select placeholder="เลือกประเภทค่าใช้จ่าย">
                  <Option value="ค่าทางด่วน">ค่าทางด่วน</Option>
                  <Option value="ค่าปรับจราจร">ค่าปรับจราจร</Option>
                  <Option value="ค่าที่พัก">ค่าที่พัก</Option>
                  <Option value="ค่าอาหาร">ค่าอาหาร</Option>
                  <Option value="ค่าจอดรถ">ค่าจอดรถ</Option>
                  <Option value="ค่าธรรมเนียม">ค่าธรรมเนียม</Option>
                  <Option value="อื่นๆ">อื่นๆ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="วันที่"
                rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="รายละเอียด"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
              >
                <Input.TextArea rows={2} placeholder="รายละเอียดค่าใช้จ่าย" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="amount"
                label="จำนวนเงิน (บาท)"
                rules={[
                  { required: true, message: "กรุณากรอกจำนวนเงิน" },
                  { type: "number", min: 0, message: "จำนวนเงินต้องไม่ติดลบ" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  precision={2}
                  placeholder="0.00"
                  prefix="฿"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="paidBy"
                label="จ่ายโดย"
                rules={[{ required: true, message: "กรุณาเลือกผู้จ่าย" }]}
              >
                <Select placeholder="เลือกผู้จ่าย">
                  <Option value="บริษัท">บริษัท</Option>
                  <Option value="พนักงาน">พนักงาน</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="สถานะ"
                rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}
              >
                <Select placeholder="เลือกสถานะ">
                  <Option value="pending">รอการอนุมัติ</Option>
                  <Option value="approved">อนุมัติแล้ว</Option>
                  <Option value="rejected">ไม่อนุมัติ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vehicle"
                label="ทะเบียนรถ"
                rules={[{ required: true, message: "กรุณาเลือกทะเบียนรถ" }]}
              >
                <Select placeholder="เลือกทะเบียนรถ">
                  <Option value="กข-1234">กข-1234</Option>
                  <Option value="ขค-5678">ขค-5678</Option>
                  <Option value="คง-9012">คง-9012</Option>
                  <Option value="งจ-3456">งจ-3456</Option>
                  <Option value="จฉ-7890">จฉ-7890</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="driver" label="คนขับ">
                <Select placeholder="เลือกคนขับ (ไม่บังคับ)" allowClear>
                  <Option value="นายสมชาย ใจดี">นายสมชาย ใจดี</Option>
                  <Option value="นายสมศักดิ์ รักดี">นายสมศักดิ์ รักดี</Option>
                  <Option value="นายสมหมาย พึ่งได้">นายสมหมาย พึ่งได้</Option>
                  <Option value="นายสมพงษ์ นามสกุล">นายสมพงษ์ นามสกุล</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="receiptNo" label="เลขที่ใบเสร็จ">
            <Input placeholder="เลขที่ใบเสร็จ (ไม่บังคับ)" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button type="default" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedRecord ? "บันทึกการเปลี่ยนแปลง" : "บันทึกข้อมูล"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="ยืนยันการลบข้อมูล"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="ลบ"
        cancelText="ยกเลิก"
        okButtonProps={{ danger: true }}
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลค่าใช้จ่ายนี้?</p>
        <p>วันที่: {recordToDelete?.date}</p>
        <p>ประเภท: {recordToDelete?.expenseType}</p>
        <p>รายละเอียด: {recordToDelete?.description}</p>
        <p>จำนวนเงิน: ฿{recordToDelete?.amount?.toFixed(2)}</p>
      </Modal>
    </div>
  );
};

OtherExpenses.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default OtherExpenses;
