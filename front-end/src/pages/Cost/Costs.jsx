import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tabs,
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  Typography,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  CarOutlined,
  ToolOutlined,
  GasPumpOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./Costs.css";
import PropTypes from "prop-types";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Costs = ({ sidebarVisible, toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState("fuel");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data
  const fuelCosts = [
    {
      key: "1",
      date: "2025-04-10",
      vehicle: "ทะเบียน กข 1234",
      station: "ปตท. สาขาบางนา",
      amount: 2500,
      liters: 50,
    },
    {
      key: "2",
      date: "2025-04-08",
      vehicle: "ทะเบียน คง 5678",
      station: "เชลล์ สาขารัชดา",
      amount: 3000,
      liters: 60,
    },
    {
      key: "3",
      date: "2025-04-05",
      vehicle: "ทะเบียน จฉ 9012",
      station: "ปตท. สาขาพระราม 2",
      amount: 2000,
      liters: 40,
    },
  ];

  const maintenanceCosts = [
    {
      key: "1",
      date: "2025-04-12",
      vehicle: "ทะเบียน กข 1234",
      type: "เปลี่ยนน้ำมันเครื่อง",
      description: "เปลี่ยนน้ำมันเครื่องและไส้กรอง",
      amount: 3500,
    },
    {
      key: "2",
      date: "2025-04-07",
      vehicle: "ทะเบียน คง 5678",
      type: "ซ่อมระบบเบรก",
      description: "เปลี่ยนผ้าเบรกและตรวจสอบระบบไฮดรอลิก",
      amount: 5200,
    },
    {
      key: "3",
      date: "2025-04-03",
      vehicle: "ทะเบียน จฉ 9012",
      type: "ตรวจเช็คระบบไฟฟ้า",
      description: "ซ่อมระบบไฟส่องสว่างและตรวจเช็คแบตเตอรี่",
      amount: 1800,
    },
  ];

  const fuelColumns = [
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "ทะเบียนรถ",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "สถานีบริการ",
      dataIndex: "station",
      key: "station",
    },
    {
      title: "จำนวนลิตร",
      dataIndex: "liters",
      key: "liters",
    },
    {
      title: "ค่าใช้จ่าย (บาท)",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span>{text.toLocaleString()}</span>,
    },
    {
      title: "จัดการ",
      key: "action",
      render: () => (
        <div className="action-buttons">
          <Button type="link" size="small">
            แก้ไข
          </Button>
          <Button type="link" danger size="small">
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  const maintenanceColumns = [
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "ทะเบียนรถ",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "รายละเอียด",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "ค่าใช้จ่าย (บาท)",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span>{text.toLocaleString()}</span>,
    },
    {
      title: "จัดการ",
      key: "action",
      render: () => (
        <div className="action-buttons">
          <Button type="link" size="small">
            แก้ไข
          </Button>
          <Button type="link" danger size="small">
            ลบ
          </Button>
        </div>
      ),
    },
  ];

  // Modal handlers
  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddCost = (values) => {
    console.log("Form values:", values);
    setIsModalVisible(false);
    form.resetFields();
    // Here you would typically call your API to add the cost
  };

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="ต้นทุน" toggleSidebar={toggleSidebar} />

        <div className="costs-container">
          <div className="content-wrapper">
            <div className="page-header">
              <Title level={4}>จัดการข้อมูลต้นทุน</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
              >
                เพิ่มรายการ
              </Button>
            </div>

            {/* สรุปต้นทุน */}
            <Row gutter={[16, 16]} className="summary-section">
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="ต้นทุนทั้งหมด"
                    value={125000}
                    precision={2}
                    suffix="บาท"
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="ต้นทุนน้ำมัน"
                    value={75000}
                    precision={2}
                    suffix="บาท"
                    prefix={<GasPumpOutlined />}
                    valueStyle={{ color: "#f5a623" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="ต้นทุนซ่อมบำรุง"
                    value={50000}
                    precision={2}
                    suffix="บาท"
                    prefix={<ToolOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* แท็บข้อมูล */}
            <Card className="costs-tabs-card">
              <Tabs defaultActiveKey="fuel" onChange={setActiveTab}>
                <TabPane
                  tab={
                    <span>
                      <GasPumpOutlined /> ค่าน้ำมันเชื้อเพลิง
                    </span>
                  }
                  key="fuel"
                >
                  <Table
                    columns={fuelColumns}
                    dataSource={fuelCosts}
                    pagination={{ pageSize: 5 }}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <ToolOutlined /> ค่าซ่อมบำรุง
                    </span>
                  }
                  key="maintenance"
                >
                  <Table
                    columns={maintenanceColumns}
                    dataSource={maintenanceCosts}
                    pagination={{ pageSize: 5 }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Modal เพิ่มรายการต้นทุน */}
        <Modal
          title={`เพิ่มรายการ${
            activeTab === "fuel" ? "ค่าน้ำมันเชื้อเพลิง" : "ค่าซ่อมบำรุง"
          }`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddCost}>
            <Form.Item
              name="date"
              label="วันที่"
              rules={[{ required: true, message: "กรุณาเลือกวันที่" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="vehicle"
              label="ทะเบียนรถ"
              rules={[{ required: true, message: "กรุณาเลือกทะเบียนรถ" }]}
            >
              <Select placeholder="เลือกทะเบียนรถ">
                <Option value="กข 1234">กข 1234</Option>
                <Option value="คง 5678">คง 5678</Option>
                <Option value="จฉ 9012">จฉ 9012</Option>
              </Select>
            </Form.Item>

            {activeTab === "fuel" ? (
              <>
                <Form.Item
                  name="station"
                  label="สถานีบริการ"
                  rules={[{ required: true, message: "กรุณาระบุสถานีบริการ" }]}
                >
                  <Input placeholder="ชื่อสถานีบริการ" />
                </Form.Item>
                <Form.Item
                  name="liters"
                  label="จำนวนลิตร"
                  rules={[{ required: true, message: "กรุณาระบุจำนวนลิตร" }]}
                >
                  <Input type="number" min={0} placeholder="จำนวนลิตร" />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="type"
                  label="ประเภทการซ่อมบำรุง"
                  rules={[
                    { required: true, message: "กรุณาระบุประเภทการซ่อมบำรุง" },
                  ]}
                >
                  <Select placeholder="เลือกประเภทการซ่อมบำรุง">
                    <Option value="เปลี่ยนน้ำมันเครื่อง">
                      เปลี่ยนน้ำมันเครื่อง
                    </Option>
                    <Option value="ซ่อมระบบเบรก">ซ่อมระบบเบรก</Option>
                    <Option value="ตรวจเช็คระบบไฟฟ้า">ตรวจเช็คระบบไฟฟ้า</Option>
                    <Option value="อื่นๆ">อื่นๆ</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="description"
                  label="รายละเอียด"
                  rules={[{ required: true, message: "กรุณาระบุรายละเอียด" }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="รายละเอียดการซ่อมบำรุง"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="amount"
              label="ค่าใช้จ่าย (บาท)"
              rules={[{ required: true, message: "กรุณาระบุค่าใช้จ่าย" }]}
            >
              <Input type="number" min={0} placeholder="ระบุจำนวนเงิน" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                บันทึกข้อมูล
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

Costs.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Costs;
