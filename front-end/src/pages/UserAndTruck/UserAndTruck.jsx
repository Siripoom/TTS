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
  Tabs,
  Tag,
  Space,
  Modal,
  Form,
  Select,
  Divider,
  message,
  Descriptions,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CarOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  ToolOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import "./User.css";
import PropTypes from "prop-types";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const UserAndTruck = ({ sidebarVisible, toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState("1");
  const [searchText, setSearchText] = useState("");
  const [currentDriverPage, setCurrentDriverPage] = useState(1);
  const [currentTruckPage, setCurrentTruckPage] = useState(1);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
  const [isTruckModalVisible, setIsTruckModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [driverForm] = Form.useForm();
  const [truckForm] = Form.useForm();
  const [isDeleteDriverModalVisible, setIsDeleteDriverModalVisible] =
    useState(false);
  const [isDeleteTruckModalVisible, setIsDeleteTruckModalVisible] =
    useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [truckToDelete, setTruckToDelete] = useState(null);
  const pageSize = 5;

  // Mock data for drivers
  const [drivers, setDrivers] = useState([
    {
      id: "1",
      name: "นายสมชาย ใจดี",
      phone: "091-234-5678",
      licenseNumber: "1234567890",
      licenseType: "ประเภท 2",
      licenseExpiry: "31/12/2568",
      status: "ว่าง",
      address: "123/456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
      birthdate: "01/05/2530",
      startDate: "15/01/2560",
      assignedVehicle: {
        id: "1",
        plateNumber: "กข-1234",
        model: "ISUZU FTR",
      },
      trips: 245,
      totalKm: 15680,
      avgRating: 4.8,
    },
    {
      id: "2",
      name: "นายสมศักดิ์ รักดี",
      phone: "092-345-6789",
      licenseNumber: "2345678901",
      licenseType: "ประเภท 2",
      licenseExpiry: "15/10/2568",
      status: "กำลังขับ",
      address: "789/123 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400",
      birthdate: "15/07/2528",
      startDate: "01/03/2558",
      assignedVehicle: {
        id: "2",
        plateNumber: "ขค-5678",
        model: "HINO FC",
      },
      trips: 312,
      totalKm: 19250,
      avgRating: 4.5,
    },
    {
      id: "3",
      name: "นายสมหมาย พึ่งได้",
      phone: "093-456-7890",
      licenseNumber: "3456789012",
      licenseType: "ประเภท 2",
      licenseExpiry: "30/06/2569",
      status: "ลาป่วย",
      address: "456/789 ถนนพระราม 9 แขวงบางกะปิ เขตห้วยขวาง กรุงเทพฯ 10310",
      birthdate: "10/12/2532",
      startDate: "20/05/2562",
      assignedVehicle: {
        id: "3",
        plateNumber: "คง-9012",
        model: "FUSO FJ",
      },
      trips: 178,
      totalKm: 10230,
      avgRating: 4.9,
    },
    {
      id: "4",
      name: "นายสมบัติ มากมี",
      phone: "094-567-8901",
      licenseNumber: "4567890123",
      licenseType: "ประเภท 2",
      licenseExpiry: "28/02/2570",
      status: "ว่าง",
      address: "321/654 ถนนเพชรบุรี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400",
      birthdate: "25/03/2535",
      startDate: "10/10/2563",
      assignedVehicle: null,
      trips: 87,
      totalKm: 5430,
      avgRating: 4.7,
    },
    {
      id: "5",
      name: "นายสมพงษ์ นามสกุล",
      phone: "095-678-9012",
      licenseNumber: "5678901234",
      licenseType: "ประเภท 2",
      licenseExpiry: "31/08/2569",
      status: "กำลังขับ",
      address: "987/654 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500",
      birthdate: "18/11/2530",
      startDate: "05/04/2561",
      assignedVehicle: {
        id: "4",
        plateNumber: "งจ-3456",
        model: "ISUZU FVZ",
      },
      trips: 256,
      totalKm: 16780,
      avgRating: 4.6,
    },
  ]);

  // Mock data for trucks
  const [trucks, setTrucks] = useState([
    {
      id: "1",
      plateNumber: "กข-1234",
      model: "ISUZU FTR",
      type: "รถบรรทุก 6 ล้อ",
      capacity: "8 ตัน",
      manufactureYear: "2565",
      status: "กำลังใช้งาน",
      lastMaintenance: "15/01/2568",
      nextMaintenance: "15/04/2568",
      fuelType: "ดีเซล",
      fuelConsumption: "6 กม./ลิตร",
      mileage: 45600,
      assignedDriver: {
        id: "1",
        name: "นายสมชาย ใจดี",
        phone: "091-234-5678",
      },
      maintenanceHistory: [
        { date: "15/01/2568", type: "เปลี่ยนถ่ายน้ำมันเครื่อง", cost: 2500 },
        { date: "15/10/2567", type: "ตรวจเช็คระบบเบรก", cost: 1800 },
        { date: "15/07/2567", type: "เปลี่ยนถ่ายน้ำมันเครื่อง", cost: 2500 },
      ],
    },
    {
      id: "2",
      plateNumber: "ขค-5678",
      model: "HINO FC",
      type: "รถบรรทุก 6 ล้อ",
      capacity: "7 ตัน",
      manufactureYear: "2566",
      status: "กำลังใช้งาน",
      lastMaintenance: "20/02/2568",
      nextMaintenance: "20/05/2568",
      fuelType: "ดีเซล",
      fuelConsumption: "5.5 กม./ลิตร",
      mileage: 32400,
      assignedDriver: {
        id: "2",
        name: "นายสมศักดิ์ รักดี",
        phone: "092-345-6789",
      },
      maintenanceHistory: [
        { date: "20/02/2568", type: "เปลี่ยนถ่ายน้ำมันเครื่อง", cost: 2500 },
        { date: "20/11/2567", type: "เปลี่ยนยาง", cost: 24000 },
        { date: "20/08/2567", type: "ตรวจเช็คระบบไฟฟ้า", cost: 1200 },
      ],
    },
    {
      id: "3",
      plateNumber: "คง-9012",
      model: "FUSO FJ",
      type: "รถบรรทุก 10 ล้อ",
      capacity: "15 ตัน",
      manufactureYear: "2564",
      status: "ซ่อมบำรุง",
      lastMaintenance: "05/03/2568",
      nextMaintenance: "05/06/2568",
      fuelType: "ดีเซล",
      fuelConsumption: "4.5 กม./ลิตร",
      mileage: 78500,
      assignedDriver: {
        id: "3",
        name: "นายสมหมาย พึ่งได้",
        phone: "093-456-7890",
      },
      maintenanceHistory: [
        { date: "05/03/2568", type: "ซ่อมระบบเบรก", cost: 15000 },
        { date: "05/12/2567", type: "เปลี่ยนถ่ายน้ำมันเครื่อง", cost: 3500 },
        { date: "05/09/2567", type: "ตรวจเช็คระบบช่วงล่าง", cost: 2800 },
      ],
    },
    {
      id: "4",
      plateNumber: "งจ-3456",
      model: "ISUZU FVZ",
      type: "รถบรรทุก 10 ล้อ",
      capacity: "18 ตัน",
      manufactureYear: "2567",
      status: "กำลังใช้งาน",
      lastMaintenance: "10/01/2568",
      nextMaintenance: "10/04/2568",
      fuelType: "ดีเซล",
      fuelConsumption: "4 กม./ลิตร",
      mileage: 21300,
      assignedDriver: {
        id: "5",
        name: "นายสมพงษ์ นามสกุล",
        phone: "095-678-9012",
      },
      maintenanceHistory: [
        { date: "10/01/2568", type: "เปลี่ยนถ่ายน้ำมันเครื่อง", cost: 3500 },
        { date: "10/10/2567", type: "ตรวจเช็คระบบเบรก", cost: 2000 },
      ],
    },
    {
      id: "5",
      plateNumber: "จฉ-7890",
      model: "HINO FG",
      type: "รถบรรทุก 6 ล้อ",
      capacity: "8 ตัน",
      manufactureYear: "2565",
      status: "ว่าง",
      lastMaintenance: "25/02/2568",
      nextMaintenance: "25/05/2568",
      fuelType: "ดีเซล",
      fuelConsumption: "5.8 กม./ลิตร",
      mileage: 38700,
      assignedDriver: null,
      maintenanceHistory: [
        { date: "25/02/2568", type: "เปลี่ยนถ่ายน้ำมันเครื่อง", cost: 2500 },
        { date: "25/11/2567", type: "ตรวจเช็คระบบไฟฟ้า", cost: 1500 },
        { date: "25/08/2567", type: "เปลี่ยนถ่ายน้ำมันเครื่อง", cost: 2500 },
      ],
    },
  ]);

  // Filter drivers and trucks based on search text
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchText.toLowerCase()) ||
      driver.phone.includes(searchText) ||
      driver.licenseNumber.includes(searchText)
  );

  const filteredTrucks = trucks.filter(
    (truck) =>
      truck.plateNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchText.toLowerCase()) ||
      truck.type.toLowerCase().includes(searchText.toLowerCase())
  );

  // Driver columns for table
  const driverColumns = [
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "เลขใบขับขี่",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
    },
    {
      title: "ประเภทใบขับขี่",
      dataIndex: "licenseType",
      key: "licenseType",
    },
    {
      title: "ทะเบียนรถที่ขับ",
      dataIndex: "assignedVehicle",
      key: "assignedVehicle",
      render: (vehicle) => (vehicle ? vehicle.plateNumber : "-"),
    },
    {
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showDriverModal(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteDriverConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  // Truck columns for table
  const truckColumns = [
    {
      title: "ทะเบียนรถ",
      dataIndex: "plateNumber",
      key: "plateNumber",
    },
    {
      title: "รุ่น",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "บรรทุก",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "คนขับประจำ",
      dataIndex: "assignedDriver",
      key: "assignedDriver",
      render: (driver) => (driver ? driver.name : "-"),
    },
    {
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showTruckModal(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteTruckConfirm(record)}
          />
        </Space>
      ),
    },
  ];

  // Driver details modal
  const showDriverModal = (driver = null) => {
    setSelectedDriver(driver);
    if (driver) {
      driverForm.setFieldsValue({
        name: driver.name,
        phone: driver.phone,
        licenseNumber: driver.licenseNumber,
        licenseType: driver.licenseType,
        licenseExpiry: driver.licenseExpiry,
        status: driver.status,
        address: driver.address,
        birthdate: driver.birthdate,
        startDate: driver.startDate,
        assignedVehicleId: driver.assignedVehicle
          ? driver.assignedVehicle.id
          : null,
      });
    } else {
      driverForm.resetFields();
    }
    setIsDriverModalVisible(true);
  };

  // Truck details modal
  const showTruckModal = (truck = null) => {
    setSelectedTruck(truck);
    if (truck) {
      truckForm.setFieldsValue({
        plateNumber: truck.plateNumber,
        model: truck.model,
        type: truck.type,
        capacity: truck.capacity,
        manufactureYear: truck.manufactureYear,
        status: truck.status,
        lastMaintenance: truck.lastMaintenance,
        nextMaintenance: truck.nextMaintenance,
        fuelType: truck.fuelType,
        fuelConsumption: truck.fuelConsumption,
        mileage: truck.mileage,
        assignedDriverId: truck.assignedDriver ? truck.assignedDriver.id : null,
      });
    } else {
      truckForm.resetFields();
    }
    setIsTruckModalVisible(true);
  };

  // Close driver modal
  const handleDriverModalCancel = () => {
    setIsDriverModalVisible(false);
    setSelectedDriver(null);
  };

  // Close truck modal
  const handleTruckModalCancel = () => {
    setIsTruckModalVisible(false);
    setSelectedTruck(null);
  };

  // Handle driver form submission
  const handleDriverFormSubmit = (values) => {
    if (selectedDriver) {
      // Update existing driver
      const updatedDriver = {
        ...selectedDriver,
        ...values,
        assignedVehicle: values.assignedVehicleId
          ? trucks.find((truck) => truck.id === values.assignedVehicleId)
          : null,
      };

      const updatedDrivers = drivers.map((driver) =>
        driver.id === selectedDriver.id ? updatedDriver : driver
      );

      setDrivers(updatedDrivers);
      message.success("อัพเดตข้อมูลพนักงานขับรถสำเร็จ");
    } else {
      // Add new driver
      const newDriver = {
        id: (drivers.length + 1).toString(),
        ...values,
        trips: 0,
        totalKm: 0,
        avgRating: 0,
        assignedVehicle: values.assignedVehicleId
          ? trucks.find((truck) => truck.id === values.assignedVehicleId)
          : null,
      };

      setDrivers([...drivers, newDriver]);
      message.success("เพิ่มพนักงานขับรถสำเร็จ");
    }

    setIsDriverModalVisible(false);
    setSelectedDriver(null);
  };

  // Handle truck form submission
  const handleTruckFormSubmit = (values) => {
    if (selectedTruck) {
      // Update existing truck
      const updatedTruck = {
        ...selectedTruck,
        ...values,
        assignedDriver: values.assignedDriverId
          ? drivers.find((driver) => driver.id === values.assignedDriverId)
          : null,
      };

      const updatedTrucks = trucks.map((truck) =>
        truck.id === selectedTruck.id ? updatedTruck : truck
      );

      setTrucks(updatedTrucks);
      message.success("อัพเดตข้อมูลรถบรรทุกสำเร็จ");
    } else {
      // Add new truck
      const newTruck = {
        id: (trucks.length + 1).toString(),
        ...values,
        mileage: values.mileage || 0,
        maintenanceHistory: [],
        assignedDriver: values.assignedDriverId
          ? drivers.find((driver) => driver.id === values.assignedDriverId)
          : null,
      };

      setTrucks([...trucks, newTruck]);
      message.success("เพิ่มรถบรรทุกสำเร็จ");
    }

    setIsTruckModalVisible(false);
    setSelectedTruck(null);
  };

  // Show delete driver confirmation
  const showDeleteDriverConfirm = (driver) => {
    setDriverToDelete(driver);
    setIsDeleteDriverModalVisible(true);
  };

  // Show delete truck confirmation
  const showDeleteTruckConfirm = (truck) => {
    setTruckToDelete(truck);
    setIsDeleteTruckModalVisible(true);
  };

  // Delete driver
  const handleDeleteDriver = () => {
    if (driverToDelete) {
      const updatedDrivers = drivers.filter(
        (driver) => driver.id !== driverToDelete.id
      );
      setDrivers(updatedDrivers);

      // Also update trucks that had this driver assigned
      const updatedTrucks = trucks.map((truck) => {
        if (
          truck.assignedDriver &&
          truck.assignedDriver.id === driverToDelete.id
        ) {
          return { ...truck, assignedDriver: null };
        }
        return truck;
      });
      setTrucks(updatedTrucks);

      message.success("ลบพนักงานขับรถสำเร็จ");
      setIsDeleteDriverModalVisible(false);
      setDriverToDelete(null);
    }
  };

  // Delete truck
  const handleDeleteTruck = () => {
    if (truckToDelete) {
      const updatedTrucks = trucks.filter(
        (truck) => truck.id !== truckToDelete.id
      );
      setTrucks(updatedTrucks);

      // Also update drivers that had this truck assigned
      const updatedDrivers = drivers.map((driver) => {
        if (
          driver.assignedVehicle &&
          driver.assignedVehicle.id === truckToDelete.id
        ) {
          return { ...driver, assignedVehicle: null };
        }
        return driver;
      });
      setDrivers(updatedDrivers);

      message.success("ลบรถบรรทุกสำเร็จ");
      setIsDeleteTruckModalVisible(false);
      setTruckToDelete(null);
    }
  };

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="จัดการรถและผู้ใช้" toggleSidebar={toggleSidebar} />

        <div className="user-container">
          <div className="content-wrapper">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarExtraContent={
                <Space>
                  <Input
                    placeholder="ค้นหา..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      if (activeTab === "1") {
                        showDriverModal();
                      } else {
                        showTruckModal();
                      }
                    }}
                  >
                    {activeTab === "1" ? "เพิ่มพนักงานขับรถ" : "เพิ่มรถบรรทุก"}
                  </Button>
                </Space>
              }
            >
              <TabPane
                tab={
                  <span>
                    <UserOutlined /> พนักงานขับรถ
                  </span>
                }
                key="1"
              >
                <Card className="data-card">
                  <Table
                    columns={driverColumns}
                    dataSource={filteredDrivers.slice(
                      (currentDriverPage - 1) * pageSize,
                      currentDriverPage * pageSize
                    )}
                    pagination={false}
                    rowKey="id"
                  />
                  <div className="pagination-container">
                    <Pagination
                      current={currentDriverPage}
                      onChange={setCurrentDriverPage}
                      total={filteredDrivers.length}
                      pageSize={pageSize}
                      showSizeChanger={false}
                    />
                  </div>
                </Card>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CarOutlined /> รถบรรทุก
                  </span>
                }
                key="2"
              >
                <Card className="data-card">
                  <Table
                    columns={truckColumns}
                    dataSource={filteredTrucks.slice(
                      (currentTruckPage - 1) * pageSize,
                      currentTruckPage * pageSize
                    )}
                    pagination={false}
                    rowKey="id"
                  />
                  <div className="pagination-container">
                    <Pagination
                      current={currentTruckPage}
                      onChange={setCurrentTruckPage}
                      total={filteredTrucks.length}
                      pageSize={pageSize}
                      showSizeChanger={false}
                    />
                  </div>
                </Card>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Driver Form Modal */}
      <Modal
        title={
          selectedDriver ? "แก้ไขข้อมูลพนักงานขับรถ" : "เพิ่มพนักงานขับรถใหม่"
        }
        visible={isDriverModalVisible}
        onCancel={handleDriverModalCancel}
        footer={null}
        width={700}
      >
        <Form
          form={driverForm}
          layout="vertical"
          onFinish={handleDriverFormSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="ชื่อ-นามสกุล"
                rules={[{ required: true, message: "กรุณากรอกชื่อ-นามสกุล" }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="เบอร์โทร"
                rules={[{ required: true, message: "กรุณากรอกเบอร์โทร" }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="licenseNumber"
                label="เลขใบขับขี่"
                rules={[{ required: true, message: "กรุณากรอกเลขใบขับขี่" }]}
              >
                <Input prefix={<IdcardOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="licenseType"
                label="ประเภทใบขับขี่"
                rules={[
                  { required: true, message: "กรุณาเลือกประเภทใบขับขี่" },
                ]}
              >
                <Select>
                  <Option value="ประเภท 1">ประเภท 1</Option>
                  <Option value="ประเภท 2">ประเภท 2</Option>
                  <Option value="ประเภท 3">ประเภท 3</Option>
                  <Option value="ประเภท 4">ประเภท 4</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="licenseExpiry"
                label="วันหมดอายุใบขับขี่"
                rules={[
                  { required: true, message: "กรุณากรอกวันหมดอายุใบขับขี่" },
                ]}
              >
                <Input prefix={<CalendarOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="birthdate"
                label="วันเกิด"
                rules={[{ required: true, message: "กรุณากรอกวันเกิด" }]}
              >
                <Input prefix={<CalendarOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="ที่อยู่"
            rules={[{ required: true, message: "กรุณากรอกที่อยู่" }]}
          >
            <Input.TextArea rows={3} prefix={<EnvironmentOutlined />} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="วันที่เริ่มงาน"
                rules={[{ required: true, message: "กรุณากรอกวันที่เริ่มงาน" }]}
              >
                <Input prefix={<CalendarOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assignedVehicleId" label="รถที่ขับประจำ">
                <Select allowClear placeholder="เลือกรถบรรทุก">
                  {trucks.map((truck) => (
                    <Option key={truck.id} value={truck.id}>
                      {truck.plateNumber} - {truck.model}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item className="form-actions">
            <Button
              type="default"
              onClick={handleDriverModalCancel}
              style={{ marginRight: 8 }}
            >
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedDriver ? "อัพเดต" : "บันทึก"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Truck Form Modal */}
      <Modal
        title={selectedTruck ? "แก้ไขข้อมูลรถบรรทุก" : "เพิ่มรถบรรทุกใหม่"}
        visible={isTruckModalVisible}
        onCancel={handleTruckModalCancel}
        footer={null}
        width={700}
      >
        <Form
          form={truckForm}
          layout="vertical"
          onFinish={handleTruckFormSubmit}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="plateNumber"
                label="ทะเบียนรถ"
                rules={[{ required: true, message: "กรุณากรอกทะเบียนรถ" }]}
              >
                <Input prefix={<CarOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="model"
                label="รุ่น"
                rules={[{ required: true, message: "กรุณากรอกรุ่นรถ" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="manufactureYear"
                label="ปีที่ผลิต"
                rules={[{ required: true, message: "กรุณากรอกปีที่ผลิต" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="ประเภท"
                rules={[{ required: true, message: "กรุณาเลือกประเภทรถ" }]}
              >
                <Select>
                  <Option value="รถบรรทุก 4 ล้อ">รถบรรทุก 4 ล้อ</Option>
                  <Option value="รถบรรทุก 6 ล้อ">รถบรรทุก 6 ล้อ</Option>
                  <Option value="รถบรรทุก 10 ล้อ">รถบรรทุก 10 ล้อ</Option>
                  <Option value="รถพ่วง">รถพ่วง</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="น้ำหนักบรรทุก"
                rules={[{ required: true, message: "กรุณากรอกน้ำหนักบรรทุก" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="lastMaintenance"
                label="วันที่ซ่อมบำรุงล่าสุด"
                rules={[
                  { required: true, message: "กรุณากรอกวันที่ซ่อมบำรุงล่าสุด" },
                ]}
              >
                <Input prefix={<ToolOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="nextMaintenance"
                label="วันที่ซ่อมบำรุงถัดไป"
                rules={[
                  { required: true, message: "กรุณากรอกวันที่ซ่อมบำรุงถัดไป" },
                ]}
              >
                <Input prefix={<CalendarOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mileage"
                label="เลขไมล์ (กม.)"
                rules={[{ required: true, message: "กรุณากรอกเลขไมล์" }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="fuelType"
                label="ประเภทเชื้อเพลิง"
                rules={[
                  { required: true, message: "กรุณาเลือกประเภทเชื้อเพลิง" },
                ]}
              >
                <Select>
                  <Option value="ดีเซล">ดีเซล</Option>
                  <Option value="เบนซิน">เบนซิน</Option>
                  <Option value="NGV">NGV</Option>
                  <Option value="LPG">LPG</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="fuelConsumption"
                label="อัตราสิ้นเปลืองเชื้อเพลิง"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอัตราสิ้นเปลืองเชื้อเพลิง",
                  },
                ]}
              >
                <Input placeholder="กม./ลิตร" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assignedDriverId" label="คนขับประจำ">
                <Select allowClear placeholder="เลือกคนขับประจำ">
                  {drivers.map((driver) => (
                    <Option key={driver.id} value={driver.id}>
                      {driver.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item className="form-actions">
            <Button
              type="default"
              onClick={handleTruckModalCancel}
              style={{ marginRight: 8 }}
            >
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedTruck ? "อัพเดต" : "บันทึก"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Driver Confirmation Modal */}
      <Modal
        title="ยืนยันการลบพนักงานขับรถ"
        visible={isDeleteDriverModalVisible}
        onCancel={() => setIsDeleteDriverModalVisible(false)}
        onOk={handleDeleteDriver}
        okText="ลบ"
        cancelText="ยกเลิก"
        okButtonProps={{ danger: true }}
      >
        <p>คุณแน่ใจหรือไม่ที่จะลบพนักงานขับรถ "{driverToDelete?.name}"?</p>
        <p>การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
      </Modal>

      {/* Delete Truck Confirmation Modal */}
      <Modal
        title="ยืนยันการลบรถบรรทุก"
        visible={isDeleteTruckModalVisible}
        onCancel={() => setIsDeleteTruckModalVisible(false)}
        onOk={handleDeleteTruck}
        okText="ลบ"
        cancelText="ยกเลิก"
        okButtonProps={{ danger: true }}
      >
        <p>
          คุณแน่ใจหรือไม่ที่จะลบรถบรรทุกทะเบียน &quot;
          {truckToDelete?.plateNumber} &quot;?
        </p>
        <p>การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
      </Modal>
    </div>
  );
};

UserAndTruck.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default UserAndTruck;
