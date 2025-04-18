import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Table,
  Pagination,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Divider,
  message,
  Row,
  Col,
  Descriptions,
  Avatar,
  Statistic,
  Tag,
  Empty,
  Drawer,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CarOutlined,
} from "@ant-design/icons";
import "../User.css";
import PropTypes from "prop-types";
import dayjs from "dayjs"; // Make sure dayjs is imported

const { Title } = Typography;
const { Option } = Select;

const Drivers = ({
  trucks,
  setDrivers,
  drivers,
  searchText,
  setSearchText,
}) => {
  const [currentDriverPage, setCurrentDriverPage] = useState(1);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverForm] = Form.useForm();
  const [isDeleteDriverModalVisible, setIsDeleteDriverModalVisible] =
    useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [driverDetailVisible, setDriverDetailVisible] = useState(false);
  const [viewingDriver, setViewingDriver] = useState(null);
  const pageSize = 5;

  // Filter drivers based on search text
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchText.toLowerCase()) ||
      driver.phone.includes(searchText) ||
      driver.licenseNumber.includes(searchText)
  );

  // Function to show driver details
  const showDriverDetails = (driver) => {
    console.log("Viewing Driver Data:", driver); // Check if driver data is available
    setViewingDriver(driver);
    setDriverDetailVisible(true);
  };

  // Close driver details drawer
  const closeDriverDetails = () => {
    setDriverDetailVisible(false);
    setViewingDriver(null);
  };

  // Driver columns for table
  const driverColumns = [
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a
          onClick={() => showDriverDetails(record)}
          style={{ cursor: "pointer", color: "#1890ff" }}
        >
          {text}
        </a>
      ),
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

  // Close driver modal
  const handleDriverModalCancel = () => {
    setIsDriverModalVisible(false);
    setSelectedDriver(null);
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

  // Show delete driver confirmation
  const showDeleteDriverConfirm = (driver) => {
    setDriverToDelete(driver);
    setIsDeleteDriverModalVisible(true);
  };

  // Delete driver
  const handleDeleteDriver = () => {
    if (driverToDelete) {
      const updatedDrivers = drivers.filter(
        (driver) => driver.id !== driverToDelete.id
      );
      setDrivers(updatedDrivers);

      message.success("ลบพนักงานขับรถสำเร็จ");
      setIsDeleteDriverModalVisible(false);
      setDriverToDelete(null);
    }
  };

  return (
    <>
      <div className="section-header">
        <Title level={4}>รายการพนักงานขับรถ</Title>
        <Space>
          <Input
            placeholder="ค้นหาพนักงานขับรถ..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showDriverModal()}
          >
            เพิ่มพนักงานขับรถ
          </Button>
        </Space>
      </div>

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
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="birthdate"
                label="วันเกิด"
                rules={[{ required: true, message: "กรุณากรอกวันเกิด" }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="วันที่เริ่มงาน"
                rules={[{ required: true, message: "กรุณากรอกวันที่เริ่มงาน" }]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={8}>
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

          <Form.Item
            name="address"
            label="ที่อยู่"
            rules={[{ required: true, message: "กรุณากรอกที่อยู่" }]}
          >
            <Input.TextArea rows={3} prefix={<EnvironmentOutlined />} />
          </Form.Item>

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
        <p>
          คุณแน่ใจหรือไม่ที่จะลบพนักงานขับรถ &qout;{driverToDelete?.name}&qout;?
        </p>
        <p>การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
      </Modal>

      {/* Driver Details Drawer */}
      {viewingDriver ? (
        <Drawer
          title="ข้อมูลพนักงานขับรถ"
          width={700}
          placement="right"
          onClose={closeDriverDetails}
          visible={driverDetailVisible}
          extra={
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  closeDriverDetails();
                  showDriverModal(viewingDriver);
                }}
              >
                แก้ไข
              </Button>
            </Space>
          }
        >
          {/* Driver details content */}
          {viewingDriver && (
            <>
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <Avatar
                  size={100}
                  icon={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <UserOutlined style={{ fontSize: "48px" }} />
                    </div>
                  }
                  style={{
                    backgroundColor: "#f5a623",
                  }}
                />
                <div style={{ marginTop: "15px" }}>
                  <Typography.Title level={3}>
                    {viewingDriver.name}
                  </Typography.Title>
                </div>
              </div>

              <Divider />

              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card title="ข้อมูลส่วนตัว" bordered={false}>
                    <Descriptions column={{ xs: 1, sm: 2 }} layout="vertical">
                      <Descriptions.Item label="ชื่อ-นามสกุล">
                        {viewingDriver.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="เบอร์โทร">
                        <PhoneOutlined /> {viewingDriver.phone}
                      </Descriptions.Item>
                      <Descriptions.Item label="วันเกิด">
                        <CalendarOutlined />{" "}
                        {dayjs(viewingDriver.birthdate).format("DD/MM/YYYY")}
                      </Descriptions.Item>
                      <Descriptions.Item label="วันที่เริ่มงาน">
                        <CalendarOutlined />{" "}
                        {dayjs(viewingDriver.startDate).format("DD/MM/YYYY")}
                      </Descriptions.Item>
                      <Descriptions.Item label="ที่อยู่" span={2}>
                        <EnvironmentOutlined /> {viewingDriver.address}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card title="ข้อมูลใบขับขี่" bordered={false}>
                    <Descriptions column={{ xs: 1, sm: 3 }} layout="vertical">
                      <Descriptions.Item label="เลขใบขับขี่">
                        <IdcardOutlined /> {viewingDriver.licenseNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="ประเภทใบขับขี่">
                        {viewingDriver.licenseType}
                      </Descriptions.Item>
                      <Descriptions.Item label="วันหมดอายุ">
                        {dayjs(viewingDriver.licenseExpiry).format(
                          "DD/MM/YYYY"
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={24}>
                  <Card title="ข้อมูลการขับรถ" bordered={false}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={8}>
                        <Statistic
                          title="จำนวนเที่ยว"
                          value={viewingDriver.trips}
                          suffix="เที่ยว"
                        />
                      </Col>
                    </Row>

                    <Divider style={{ margin: "16px 0" }} />

                    <div>
                      <Typography.Title level={5}>
                        รถที่ขับประจำ
                      </Typography.Title>
                      {viewingDriver.assignedVehicle ? (
                        <Card>
                          <Descriptions column={1}>
                            <Descriptions.Item label="ทะเบียนรถ">
                              <CarOutlined />{" "}
                              {viewingDriver.assignedVehicle.plateNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="รุ่น">
                              {viewingDriver.assignedVehicle.model}
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      ) : (
                        <Empty description="ไม่มีรถที่ขับประจำ" />
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Drawer>
      ) : (
        <Empty description="ข้อมูลพนักงานขับรถไม่ถูกต้อง" />
      )}
    </>
  );
};

Drivers.propTypes = {
  trucks: PropTypes.array.isRequired,
  drivers: PropTypes.array.isRequired,
  setDrivers: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired,
};

export default Drivers;
