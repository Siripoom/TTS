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
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import "./Customer.css";
import PropTypes from "prop-types";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Customers = ({ sidebarVisible, toggleSidebar }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const pageSize = 10;

  useEffect(() => {
    // Mock data - replace with actual API call later
    const mockCustomers = [
      {
        id: "1",
        name: "A",
        contactInfo: "0000000009",
        address: "123 Main St",
        pricePerTrip: 1200.0,
        createdAt: "12/05/2568",
        purchases: [
          { id: "p1", product: "สินค้า A", date: "12/05/2568", amount: 3500 },
          { id: "p2", product: "สินค้า B", date: "15/05/2568", amount: 2800 },
        ],
      },
      {
        id: "2",
        name: "B",
        contactInfo: "092xxxxxxx",
        address: "456 Second Ave",
        pricePerTrip: 1500.0,
        createdAt: "13/05/2568",
        purchases: [
          { id: "p3", product: "สินค้า C", date: "13/05/2568", amount: 4200 },
        ],
      },
      {
        id: "3",
        name: "C",
        contactInfo: "092xxxxxxx",
        address: "789 Third St",
        pricePerTrip: 1800.0,
        createdAt: "15/05/2568",
        purchases: [
          { id: "p4", product: "สินค้า A", date: "16/05/2568", amount: 3200 },
          { id: "p5", product: "สินค้า D", date: "18/05/2568", amount: 1900 },
        ],
      },
    ];

    setCustomers(mockCustomers);
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.contactInfo.includes(searchText)
  );

  const showModal = (customer = null) => {
    setSelectedCustomer(customer);
    if (customer) {
      form.setFieldsValue({
        name: customer.name,
        contactInfo: customer.contactInfo,
        address: customer.address,
        pricePerTrip: customer.pricePerTrip,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = (values) => {
    if (selectedCustomer) {
      // Update existing customer
      const updatedCustomers = customers.map((c) =>
        c.id === selectedCustomer.id ? { ...c, ...values } : c
      );
      setCustomers(updatedCustomers);
      message.success("ข้อมูลลูกค้าได้รับการอัพเดตแล้ว");
    } else {
      // Create new customer
      const newCustomer = {
        id: (customers.length + 1).toString(),
        ...values,
        createdAt: new Date().toLocaleDateString("th-TH"),
        purchases: [],
      };
      setCustomers([...customers, newCustomer]);
      message.success("เพิ่มลูกค้าใหม่แล้ว");
    }
    setIsModalVisible(false);
  };

  const showDeleteConfirm = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      const updatedCustomers = customers.filter(
        (c) => c.id !== customerToDelete.id
      );
      setCustomers(updatedCustomers);
      message.success("ลบลูกค้าเรียบร้อยแล้ว");
      setIsDeleteModalVisible(false);
      setCustomerToDelete(null);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  // Customer list columns
  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ข้อมูลติดต่อ",
      dataIndex: "contactInfo",
      key: "contactInfo",
    },
    {
      title: "ที่อยู่",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "ราคาค่าขนส่ง",
      dataIndex: "pricePerTrip",
      key: "pricePerTrip",
      render: (price) => `฿${price.toFixed(2)}`,
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "ACTION",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewCustomer(record)}
          />
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

  // Purchase history columns
  const purchaseColumns = [
    {
      title: "สินค้า",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `฿${amount.toFixed(2)}`,
    },
  ];

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="ลูกค้า" toggleSidebar={toggleSidebar} />

        <div className="customer-container">
          <div className="content-wrapper">
            <Card className="customer-card">
              <div className="card-header">
                <Title level={4}>รายการลูกค้า</Title>
                <div className="card-actions">
                  <Input
                    placeholder="ค้นหาลูกค้า..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250, marginRight: 16 }}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                  >
                    เพิ่มลูกค้าใหม่
                  </Button>
                </div>
              </div>

              {selectedCustomer ? (
                <div className="customer-detail">
                  <div className="detail-header">
                    <Button
                      type="link"
                      onClick={() => setSelectedCustomer(null)}
                    >
                      &lt; กลับไปยังรายการลูกค้า
                    </Button>
                  </div>

                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <Card className="info-card">
                        <div className="customer-avatar">
                          <UserOutlined />
                        </div>
                        <Title level={4}>{selectedCustomer.name}</Title>
                        <div className="customer-info">
                          <p>
                            <strong>ข้อมูลติดต่อ:</strong>{" "}
                            {selectedCustomer.contactInfo}
                          </p>
                          <p>
                            <strong>ที่อยู่:</strong> {selectedCustomer.address}
                          </p>
                          <p>
                            <strong>ราคาค่าขนส่ง:</strong> ฿
                            {selectedCustomer.pricePerTrip.toFixed(2)}
                          </p>
                          <p>
                            <strong>วันที่สร้าง:</strong>{" "}
                            {selectedCustomer.createdAt}
                          </p>
                        </div>
                        <div className="customer-actions">
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => showModal(selectedCustomer)}
                          >
                            แก้ไขข้อมูล
                          </Button>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={16}>
                      <Card className="purchase-card">
                        <Tabs defaultActiveKey="1">
                          <TabPane tab="ประวัติการซื้อ" key="1">
                            <Table
                              columns={purchaseColumns}
                              dataSource={selectedCustomer.purchases}
                              pagination={false}
                              rowKey="id"
                              summary={(pageData) => {
                                let totalAmount = 0;
                                pageData.forEach(({ amount }) => {
                                  totalAmount += amount;
                                });
                                return (
                                  <Table.Summary.Row>
                                    <Table.Summary.Cell colSpan={2}>
                                      <strong>รวมทั้งหมด</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                      <Text strong>
                                        ฿{totalAmount.toFixed(2)}
                                      </Text>
                                    </Table.Summary.Cell>
                                  </Table.Summary.Row>
                                );
                              }}
                            />
                          </TabPane>
                          <TabPane tab="การส่งสินค้า" key="2">
                            <div className="empty-content">
                              <p>ไม่มีข้อมูลการส่งสินค้า</p>
                            </div>
                          </TabPane>
                          <TabPane tab="ใบวางบิล" key="3">
                            <div className="empty-content">
                              <p>ไม่มีข้อมูลใบวางบิล</p>
                            </div>
                          </TabPane>
                        </Tabs>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ) : (
                <>
                  <Table
                    columns={columns}
                    dataSource={filteredCustomers.slice(
                      (currentPage - 1) * pageSize,
                      currentPage * pageSize
                    )}
                    pagination={false}
                    rowKey="id"
                  />

                  <div className="pagination-container">
                    <Pagination
                      current={currentPage}
                      total={filteredCustomers.length}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      <Modal
        title={selectedCustomer ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="ชื่อ"
            rules={[{ required: true, message: "กรุณากรอกชื่อลูกค้า" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contactInfo"
            label="ข้อมูลติดต่อ"
            rules={[{ required: true, message: "กรุณากรอกข้อมูลติดต่อ" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="address" label="ที่อยู่">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="pricePerTrip"
            label="ราคาค่าขนส่ง"
            rules={[{ required: true, message: "กรุณากรอกราคาค่าขนส่ง" }]}
          >
            <Input type="number" prefix="฿" suffix="บาท" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginRight: 8 }}
            >
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedCustomer ? "อัพเดต" : "สร้าง"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="ยืนยันการลบ"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="ลบ"
        cancelText="ยกเลิก"
        okButtonProps={{ danger: true }}
      >
        <p>คุณแน่ใจที่จะลบลูกค้า "{customerToDelete?.name}" หรือไม่?</p>
        <p>การกระทำนี้จะไม่สามารถเปลี่ยนกลับได้</p>
      </Modal>
    </div>
  );
};

Customers.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Customers;
