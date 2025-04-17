import { useState } from "react";
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
  Checkbox,
  Tag,
  Tabs,
  Descriptions,
  Timeline,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CarOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import "./TruckQueus.css";
import PropTypes from "prop-types";

const { Title } = Typography;

const TruckQueus = ({ sidebarVisible, toggleSidebar }) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const { TabPane } = Tabs;

  // Mock data for truck queues
  const truckQueues = [
    {
      key: "Q0001",
      date: "15/05/2568",
      customer: "บริษัท เอ ทรานสปอร์ต จำกัด",
      customerContact: "0891234567",
      customerAddress: "123/456 ถนนสุขุมวิท กรุงเทพฯ 10110",
      plateNumber: "กม-2525",
      driver: "นาย ก",
      driverContact: "0851112222",
      driverLicense: "12345678",
      supplier: "ร้าน-ห้างหุ้นส่วนจำกัด บิ๊กเบสท์ ซัพพลาย",
      supplierContact: "0223334444",
      supplierAddress: "789 ถนนเพชรบุรี กรุงเทพฯ 10400",
      status: "บรรทุกอย่างเดียว",
      tripType: "full_delivery",
      distanceKm: 120,
      overnight: true,
      createdAt: "15/05/2568 08:30",
      updatedAt: "15/05/2568 09:45",
      vehicle: {
        model: "ISUZU FTR",
        capacity: "15 ตัน",
        manufactureYear: "2565",
      },
      timeline: [
        {
          time: "15/05/2568 08:30",
          status: "สร้างคิว",
          description: "คิวถูกสร้างโดย admin",
        },
        {
          time: "15/05/2568 09:45",
          status: "จัดรถและคนขับ",
          description: "มอบหมายรถทะเบียน กม-2525 และคนขับนาย ก",
        },
        {
          time: "15/05/2568 10:15",
          status: "ออกเดินทาง",
          description: "รถออกจากคลังสินค้าหลัก",
        },
      ],
      payment: {
        baseFare: 3500,
        overnightBonus: 500,
        fuelCost: 1200,
        totalCost: 5200,
      },
    },
    {
      key: "Q0002",
      date: "14/05/2568",
      customer: "บริษัท บี โลจิสติกส์ จำกัด",
      customerContact: "0823456789",
      customerAddress: "456/789 ถนนพระราม 3 กรุงเทพฯ 10120",
      plateNumber: "งง-2254",
      driver: "นาย ข",
      driverContact: "0873334444",
      driverLicense: "98765432",
      supplier: "บริษัท วัสดุภัณฑ์ จำกัด",
      supplierContact: "0255556666",
      supplierAddress: "123 ถนนรัชดาภิเษก กรุงเทพฯ 10400",
      status: "ขนส่งพร้อมส่งสินค้า",
      tripType: "only_loading",
      distanceKm: 85,
      overnight: false,
      createdAt: "14/05/2568 10:30",
      updatedAt: "14/05/2568 15:45",
      vehicle: {
        model: "HINO FC",
        capacity: "10 ตัน",
        manufactureYear: "2566",
      },
      timeline: [
        {
          time: "14/05/2568 10:30",
          status: "สร้างคิว",
          description: "คิวถูกสร้างโดย admin",
        },
        {
          time: "14/05/2568 12:15",
          status: "จัดรถและคนขับ",
          description: "มอบหมายรถทะเบียน งง-2254 และคนขับนาย ข",
        },
        {
          time: "14/05/2568 13:30",
          status: "ออกเดินทาง",
          description: "รถออกจากคลังสินค้าหลัก",
        },
        {
          time: "14/05/2568 15:45",
          status: "ถึงปลายทาง",
          description: "รถถึงปลายทางและเริ่มขนถ่ายสินค้า",
        },
      ],
      payment: {
        baseFare: 2800,
        overnightBonus: 0,
        fuelCost: 950,
        totalCost: 3750,
      },
    },
    {
      key: "Q0003",
      date: "12/05/2568",
      customer: "ห้างหุ้นส่วนจำกัด ซี ทรานสปอร์ต",
      customerContact: "0865556666",
      customerAddress: "789/123 ถนนสาทร กรุงเทพฯ 10120",
      plateNumber: "ฮต-1234",
      driver: "นาย ค",
      driverContact: "0899998888",
      driverLicense: "45678901",
      supplier: "บริษัท ซัพพลายออล จำกัด",
      supplierContact: "0211112222",
      supplierAddress: "456 ถนนสีลม กรุงเทพฯ 10500",
      status: "ขนส่งพร้อมส่งสินค้า",
      tripType: "full_delivery",
      distanceKm: 150,
      overnight: true,
      createdAt: "12/05/2568 07:30",
      updatedAt: "12/05/2568 18:20",
      vehicle: {
        model: "FUSO FJ",
        capacity: "18 ตัน",
        manufactureYear: "2567",
      },
      timeline: [
        {
          time: "12/05/2568 07:30",
          status: "สร้างคิว",
          description: "คิวถูกสร้างโดย admin",
        },
        {
          time: "12/05/2568 08:15",
          status: "จัดรถและคนขับ",
          description: "มอบหมายรถทะเบียน ฮต-1234 และคนขับนาย ค",
        },
        {
          time: "12/05/2568 09:30",
          status: "ออกเดินทาง",
          description: "รถออกจากคลังสินค้าหลัก",
        },
        {
          time: "12/05/2568 15:45",
          status: "ถึงปลายทาง",
          description: "รถถึงปลายทางและเริ่มขนถ่ายสินค้า",
        },
        {
          time: "12/05/2568 18:20",
          status: "กลับสู่คลัง",
          description: "รถกลับถึงคลังสินค้าหลักและจบงาน",
        },
      ],
      payment: {
        baseFare: 4200,
        overnightBonus: 500,
        fuelCost: 1500,
        totalCost: 6200,
      },
    },
  ];

  // Columns for the table
  const columns = [
    {
      title: "คิวที่",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "ว/ด/ป",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "customer",
      key: "customer",
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: "ทะเบียนรถ",
      dataIndex: "plateNumber",
      key: "plateNumber",
    },
    {
      title: "คนขับ",
      dataIndex: "driver",
      key: "driver",
    },
    {
      title: "ซัพพลายเออร์",
      dataIndex: "supplier",
      key: "supplier",
      ellipsis: true,
      render: (text) => <span title={text}>{text}</span>,
    },
    {
      title: "ประเภท",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "ค้างคืน",
      dataIndex: "overnight",
      key: "overnight",
      render: (overnight) => <Checkbox checked={overnight} disabled />,
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space
          size="small"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            type="text"
            style={{ color: "#1890ff", padding: "0 8px" }}
            onClick={() => setSelectedQueue(record)}
            title="ดูรายละเอียด"
            icon={<span>👁️</span>}
          />
          <Button
            type="text"
            style={{ color: "#f5a623", padding: "0 8px" }}
            title="แก้ไข"
            icon={<EditOutlined />}
          />
          <Button
            type="text"
            danger
            style={{ padding: "0 8px" }}
            title="ลบ"
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get queue status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "บรรทุกอย่างเดียว":
        return "blue";
      case "ขนส่งพร้อมส่งสินค้า":
        return "green";
      default:
        return "default";
    }
  };

  // Render the queue detail view
  const renderQueueDetail = () => {
    if (!selectedQueue) return null;

    return (
      <div className="queue-detail">
        <div className="detail-header">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => setSelectedQueue(null)}
          >
            กลับไปยังรายการคิว
          </Button>
        </div>

        <Card className="detail-card">
          <div className="detail-title">
            <Title level={4}>รายละเอียดคิวรถบรรทุก: {selectedQueue.key}</Title>
            <Tag
              color={getStatusColor(selectedQueue.status)}
              className="status-tag"
            >
              {selectedQueue.status}
            </Tag>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="info-section" title="ข้อมูลการขนส่ง">
                <Descriptions column={1} size="small" className="queue-info">
                  <Descriptions.Item label="วันที่">
                    <ClockCircleOutlined /> {selectedQueue.date}
                  </Descriptions.Item>
                  <Descriptions.Item label="ประเภทการขนส่ง">
                    {selectedQueue.status}
                  </Descriptions.Item>
                  <Descriptions.Item label="ระยะทาง">
                    {selectedQueue.distanceKm} กิโลเมตร
                  </Descriptions.Item>
                  <Descriptions.Item label="ค้างคืน">
                    <Checkbox checked={selectedQueue.overnight} disabled />
                    {selectedQueue.overnight ? "ใช่" : "ไม่ใช่"}
                  </Descriptions.Item>
                  <Descriptions.Item label="สร้างเมื่อ">
                    {selectedQueue.createdAt}
                  </Descriptions.Item>
                  <Descriptions.Item label="อัปเดตล่าสุด">
                    {selectedQueue.updatedAt}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="info-section" title="ข้อมูลรถและคนขับ">
                <Descriptions column={1} size="small" className="queue-info">
                  <Descriptions.Item label="ทะเบียนรถ">
                    <CarOutlined /> {selectedQueue.plateNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="รุ่นรถ">
                    {selectedQueue.vehicle.model}
                  </Descriptions.Item>
                  <Descriptions.Item label="ความจุ">
                    {selectedQueue.vehicle.capacity}
                  </Descriptions.Item>
                  <Descriptions.Item label="ปีที่ผลิต">
                    {selectedQueue.vehicle.manufactureYear}
                  </Descriptions.Item>
                  <Descriptions.Item label="คนขับ">
                    <UserOutlined /> {selectedQueue.driver}
                  </Descriptions.Item>
                  <Descriptions.Item label="เบอร์ติดต่อ">
                    {selectedQueue.driverContact}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="info-section"
                title="ข้อมูลลูกค้าและซัพพลายเออร์"
              >
                <Descriptions column={1} size="small" className="queue-info">
                  <Descriptions.Item label="ลูกค้า" className="multiline-item">
                    {selectedQueue.customer}
                  </Descriptions.Item>
                  <Descriptions.Item label="เบอร์ติดต่อ">
                    {selectedQueue.customerContact}
                  </Descriptions.Item>
                  <Descriptions.Item label="ที่อยู่" className="multiline-item">
                    <EnvironmentOutlined /> {selectedQueue.customerAddress}
                  </Descriptions.Item>

                  <Divider style={{ margin: "12px 0" }} />

                  <Descriptions.Item
                    label="ซัพพลายเออร์"
                    className="multiline-item"
                  >
                    <ShopOutlined /> {selectedQueue.supplier}
                  </Descriptions.Item>
                  <Descriptions.Item label="เบอร์ติดต่อ">
                    {selectedQueue.supplierContact}
                  </Descriptions.Item>
                  <Descriptions.Item label="ที่อยู่" className="multiline-item">
                    <EnvironmentOutlined /> {selectedQueue.supplierAddress}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={16}>
              <Card className="timeline-section" title="ไทม์ไลน์การขนส่ง">
                <Timeline mode="left">
                  {selectedQueue.timeline.map((item, index) => (
                    <Timeline.Item
                      key={index}
                      color={
                        index === selectedQueue.timeline.length - 1
                          ? "green"
                          : "blue"
                      }
                      label={item.time}
                    >
                      <div className="timeline-content">
                        <strong>{item.status}</strong>
                        <p>{item.description}</p>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="payment-section" title="ข้อมูลค่าใช้จ่าย">
                <Descriptions column={1} size="small" className="payment-info">
                  <Descriptions.Item label="ค่าขนส่งพื้นฐาน">
                    ฿{selectedQueue.payment.baseFare.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="โบนัสค้างคืน">
                    ฿{selectedQueue.payment.overnightBonus.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="ค่าน้ำมัน">
                    ฿{selectedQueue.payment.fuelCost.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="รวมทั้งหมด">
                    <strong>
                      ฿{selectedQueue.payment.totalCost.toLocaleString()}
                    </strong>
                  </Descriptions.Item>
                </Descriptions>

                <div className="action-buttons">
                  <Button type="primary" style={{ marginRight: 8 }}>
                    พิมพ์ใบขนส่ง
                  </Button>
                  <Button>ส่งออก PDF</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="รายการคิวรถบรรทุก" toggleSidebar={toggleSidebar} />

        <div className="truckQueus-container">
          <div className="content-wrapper">
            {selectedQueue ? (
              renderQueueDetail()
            ) : (
              <Card className="truck-queue-card">
                <div className="card-header">
                  <Title level={4}>รายการคิวรถบรรทุก</Title>
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
                      className="add-button"
                    >
                      เพิ่ม
                    </Button>
                  </div>
                </div>

                <Table
                  columns={columns}
                  dataSource={truckQueues}
                  pagination={false}
                  className="truck-queue-table"
                />

                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    total={10} // Adjust based on your data
                    showSizeChanger={false}
                    itemRender={(page, type) => {
                      if (type === "prev") {
                        return <Button size="small">&lt;</Button>;
                      }
                      if (type === "next") {
                        return <Button size="small">&gt;</Button>;
                      }
                      if (type === "page") {
                        return <Button size="small">{page}</Button>;
                      }
                      return null;
                    }}
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TruckQueus.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default TruckQueus;
