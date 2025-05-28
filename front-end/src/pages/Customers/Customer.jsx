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
  message,
  Drawer,
  Flex,
  Select,
  Popconfirm,
  Descriptions,
  Statistic,
  Divider,
  List,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  PrinterOutlined,
  BuildOutlined,
  DollarOutlined,
  BankOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./Customer.css";
import PropTypes from "prop-types";
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerDepartments,
  addCustomerDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Customers = ({ sidebarVisible, toggleSidebar }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDepartmentModalVisible, setIsDepartmentModalVisible] =
    useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleteDeptModalVisible, setIsDeleteDeptModalVisible] =
    useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [form] = Form.useForm();
  const [departmentForm] = Form.useForm();
  const pageSize = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers(token);
      if (res && res.success) {
        setCustomers(res.data);
      } else {
        message.error("ไม่สามารถดึงข้อมูลลูกค้าได้");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced search function - search in customer name and department names
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchText.toLowerCase();

    // Search in customer name
    const nameMatch = customer.name.toLowerCase().includes(searchLower);

    // Search in contact info
    const contactMatch =
      customer.contactInfo &&
      customer.contactInfo.toLowerCase().includes(searchLower);

    // Search in department names
    const departmentMatch =
      customer.departments &&
      customer.departments.some(
        (dept) =>
          dept.name.toLowerCase().includes(searchLower) ||
          dept.type.toLowerCase().includes(searchLower)
      );

    return nameMatch || contactMatch || departmentMatch;
  });

  const showModal = (customer = null) => {
    if (customer) {
      // Edit existing customer
      form.setFieldsValue({
        name: customer.name,
        contactInfo: customer.contactInfo,
        address: customer.address,
      });
    } else {
      // Add new customer - reset form and set initial departments
      form.resetFields();
      form.setFieldsValue({
        departments: [{}], // Start with one empty department
      });
    }
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const showDepartmentModal = (department = null) => {
    setSelectedDepartment(department);
    if (department) {
      departmentForm.setFieldsValue({
        name: department.name,
        type: department.type,
        price: department.price,
        unit: department.unit,
        contactInfo: department.contactInfo,
        address: department.address,
      });
    } else {
      departmentForm.resetFields();
    }
    setIsDepartmentModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCustomer(null);
    form.resetFields();
  };

  const handleDepartmentCancel = () => {
    setIsDepartmentModalVisible(false);
    setSelectedDepartment(null);
    departmentForm.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedCustomer) {
        // Update existing customer (no departments in this form)
        const customerData = {
          name: values.name,
          contactInfo: values.contactInfo,
          address: values.address,
        };

        const res = await updateCustomer(
          customerData,
          selectedCustomer.id,
          token
        );
        if (res && res.success) {
          const updatedCustomers = customers.map((c) =>
            c.id === selectedCustomer.id ? { ...c, ...customerData } : c
          );
          setCustomers(updatedCustomers);
          message.success("อัพเดตข้อมูลลูกค้าเรียบร้อยแล้ว");
        } else {
          message.error("ไม่สามารถอัพเดตข้อมูลลูกค้าได้");
        }
      } else {
        // Create new customer
        const customerData = {
          name: values.name,
          contactInfo: values.contactInfo,
          address: values.address,
        };

        const res = await addCustomer(customerData, token);
        if (res && res.success) {
          const newCustomer = res.data;

          // If departments are provided, create them
          if (values.departments && values.departments.length > 0) {
            const departmentsToCreate = values.departments.filter(
              (dept) => dept.name && dept.type && dept.price && dept.unit
            );

            for (const dept of departmentsToCreate) {
              try {
                const deptRes = await addCustomerDepartment(
                  newCustomer.id,
                  dept,
                  token
                );
                if (deptRes && deptRes.success) {
                  if (!newCustomer.departments) newCustomer.departments = [];
                  newCustomer.departments.push(deptRes.data);
                }
              } catch (error) {
                console.error("Error creating department:", error);
              }
            }
          }

          setCustomers([...customers, newCustomer]);
          message.success("เพิ่มลูกค้าใหม่เรียบร้อยแล้ว");
        } else {
          message.error("ไม่สามารถเพิ่มลูกค้าได้");
        }
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting customer:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSubmit = async (values) => {
    if (!selectedCustomer) return;

    setDepartmentLoading(true);
    try {
      if (selectedDepartment) {
        // Update department
        const res = await updateDepartment(
          values,
          selectedDepartment.id,
          token
        );
        if (res && res.success) {
          // Update local state
          const updatedCustomers = customers.map((c) => {
            if (c.id === selectedCustomer.id) {
              return {
                ...c,
                departments: c.departments.map((d) =>
                  d.id === selectedDepartment.id ? { ...d, ...values } : d
                ),
              };
            }
            return c;
          });
          setCustomers(updatedCustomers);
          setSelectedCustomer({
            ...selectedCustomer,
            departments: selectedCustomer.departments.map((d) =>
              d.id === selectedDepartment.id ? { ...d, ...values } : d
            ),
          });
          message.success("อัพเดตข้อมูลหน่วยงานเรียบร้อยแล้ว");
        } else {
          message.error("ไม่สามารถอัพเดตข้อมูลหน่วยงานได้");
        }
      } else {
        // Create new department
        const res = await addCustomerDepartment(
          selectedCustomer.id,
          values,
          token
        );
        if (res && res.success) {
          // Update local state
          const updatedCustomers = customers.map((c) => {
            if (c.id === selectedCustomer.id) {
              return {
                ...c,
                departments: [...(c.departments || []), res.data],
              };
            }
            return c;
          });
          setCustomers(updatedCustomers);
          setSelectedCustomer({
            ...selectedCustomer,
            departments: [...(selectedCustomer.departments || []), res.data],
          });
          message.success("เพิ่มหน่วยงานใหม่เรียบร้อยแล้ว");
        } else {
          message.error("ไม่สามารถเพิ่มหน่วยงานได้");
        }
      }
      setIsDepartmentModalVisible(false);
      departmentForm.resetFields();
    } catch (error) {
      console.error("Error handling department:", error);
      message.error("เกิดข้อผิดพลาดในการจัดการหน่วยงาน");
    } finally {
      setDepartmentLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    setLoading(true);
    try {
      const res = await deleteCustomer(customerId, token);
      if (res && res.success) {
        const updatedCustomers = customers.filter((c) => c.id !== customerId);
        setCustomers(updatedCustomers);
        message.success("ลบลูกค้าเรียบร้อยแล้ว");
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer(null);
        }
      } else {
        message.error("ไม่สามารถลบลูกค้าได้");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      message.error("เกิดข้อผิดพลาดในการลบลูกค้า");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    setDepartmentLoading(true);
    try {
      const res = await deleteDepartment(departmentId, token);
      if (res && res.success) {
        // Update local state
        const updatedCustomers = customers.map((c) => {
          if (c.id === selectedCustomer.id) {
            return {
              ...c,
              departments: c.departments.filter((d) => d.id !== departmentId),
            };
          }
          return c;
        });
        setCustomers(updatedCustomers);
        setSelectedCustomer({
          ...selectedCustomer,
          departments: selectedCustomer.departments.filter(
            (d) => d.id !== departmentId
          ),
        });
        message.success("ลบหน่วยงานเรียบร้อยแล้ว");
      } else {
        message.error("ไม่สามารถลบหน่วยงานได้");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      message.error("เกิดข้อผิดพลาดในการลบหน่วยงาน");
    } finally {
      setDepartmentLoading(false);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleShowDrawer = (record) => {
    setSelectedInvoice(record);
    setInvoiceDetail(true);
  };

  const handleCloseDrawer = () => {
    setInvoiceDetail(false);
    setSelectedInvoice(null);
  };

  const createPDF = () => {
    message.info("ฟีเจอร์พิมพ์ PDF กำลังพัฒนา");
  };

  // Customer list columns
  const columns = [
    {
      title: "ชื่อลูกค้า",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <Space>
            <UserOutlined style={{ color: "#1890ff" }} />
            <Text strong>{text}</Text>
          </Space>
          {/* Show department names as tags */}
          {record.departments && record.departments.length > 0 && (
            <div style={{ marginTop: 4 }}>
              {record.departments.slice(0, 2).map((dept, index) => (
                <Tag
                  key={index}
                  size="small"
                  color="blue"
                  style={{ marginRight: 4 }}
                >
                  {dept.name}
                </Tag>
              ))}
              {record.departments.length > 2 && (
                <Tag size="small" color="default">
                  +{record.departments.length - 2} อื่นๆ
                </Tag>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "ข้อมูลติดต่อ",
      dataIndex: "contactInfo",
      key: "contactInfo",
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: "#52c41a" }} />
          <Text>{text || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "ที่อยู่",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#faad14" }} />
          <Text>{text || "-"}</Text>
        </Space>
      ),
    },
    {
      title: "จำนวนหน่วยงาน",
      key: "departmentCount",
      align: "center",
      render: (_, record) => (
        <Tag color="blue" icon={<BankOutlined />}>
          {record.departments?.length || 0} หน่วยงาน
        </Tag>
      ),
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Space>
          <CalendarOutlined style={{ color: "#722ed1" }} />
          <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
        </Space>
      ),
    },
    {
      title: "การดำเนินการ",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewCustomer(record)}
            title="ดูรายละเอียด"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            title="แก้ไข"
          />
          <Popconfirm
            title="ยืนยันการลบ"
            description={`คุณแน่ใจที่จะลบลูกค้า "${record.name}" หรือไม่?`}
            onConfirm={() => handleDeleteCustomer(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="ลบ" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Department columns
  const departmentColumns = [
    {
      title: "ชื่อหน่วยงาน",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <BankOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => (
        <Text strong style={{ color: "#52c41a" }}>
          ฿{Number(price).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit",
      align: "center",
      render: (text) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: "ข้อมูลติดต่อ",
      dataIndex: "contactInfo",
      key: "contactInfo",
      render: (text) => text || "-",
    },
    {
      title: "การดำเนินการ",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showDepartmentModal(record)}
            title="แก้ไข"
          />
          <Popconfirm
            title="ยืนยันการลบหน่วยงาน"
            description={`คุณแน่ใจที่จะลบหน่วยงาน "${record.name}" หรือไม่?`}
            onConfirm={() => handleDeleteDepartment(record.id)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="ลบ" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const invoiceColumns = [
    {
      title: "เลขใบวางบิล",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Space>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "หน่วยงาน",
      key: "department",
      render: (_, record) => (
        <Tag color="blue">{record.department?.name || "ไม่ระบุ"}</Tag>
      ),
    },
    {
      title: "วันที่",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (amount) => (
        <Text strong style={{ color: "#52c41a" }}>
          ฿{Number(amount).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "การดำเนินการ",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleShowDrawer(record)}
        >
          ดูรายละเอียด
        </Button>
      ),
    },
  ];

  const columnDetail = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "product",
      key: "product",
      render: (product) => product?.name || "-",
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => `฿${Number(price).toLocaleString()}`,
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "น้ำหนักสุทธิ",
      dataIndex: "weight",
      key: "weight",
      align: "right",
      render: (weight) => `${weight} กก.`,
    },
    {
      title: "ราคารวม",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount) => (
        <Text strong style={{ color: "#52c41a" }}>
          ฿{Number(amount).toLocaleString()}
        </Text>
      ),
    },
  ];

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="จัดการลูกค้า" toggleSidebar={toggleSidebar} />

        <div className="customer-container">
          <div className="content-wrapper">
            <Card className="customer-card">
              <div className="card-header">
                <Title level={4}>
                  <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  รายการลูกค้า
                </Title>
                <div className="card-actions">
                  <Input
                    placeholder="ค้นหาลูกค้า หรือ หน่วยงาน..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300, marginRight: 16 }}
                    allowClear
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                    loading={loading}
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
                      style={{ padding: 0, marginBottom: 16 }}
                    >
                      ← กลับไปยังรายการลูกค้า
                    </Button>
                  </div>

                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <Card className="info-card" style={{ height: "100%" }}>
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                          <div
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: "50%",
                              backgroundColor: "#f5f6fa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 16px",
                              fontSize: 32,
                              color: "#1890ff",
                            }}
                          >
                            <UserOutlined />
                          </div>
                          <Title level={4} style={{ marginBottom: 0 }}>
                            {selectedCustomer.name}
                          </Title>
                        </div>

                        <Descriptions column={1} size="small">
                          <Descriptions.Item
                            label={
                              <Space>
                                <PhoneOutlined style={{ color: "#52c41a" }} />
                                ข้อมูลติดต่อ
                              </Space>
                            }
                          >
                            {selectedCustomer.contactInfo || "-"}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={
                              <Space>
                                <EnvironmentOutlined
                                  style={{ color: "#faad14" }}
                                />
                                ที่อยู่
                              </Space>
                            }
                          >
                            {selectedCustomer.address || "-"}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={
                              <Space>
                                <BankOutlined style={{ color: "#722ed1" }} />
                                จำนวนหน่วยงาน
                              </Space>
                            }
                          >
                            <Tag color="blue">
                              {selectedCustomer.departments?.length || 0}{" "}
                              หน่วยงาน
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={
                              <Space>
                                <CalendarOutlined
                                  style={{ color: "#eb2f96" }}
                                />
                                วันที่สร้าง
                              </Space>
                            }
                          >
                            {dayjs(selectedCustomer.createdAt).format(
                              "DD/MM/YYYY"
                            )}
                          </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => showModal(selectedCustomer)}
                            block
                          >
                            แก้ไขข้อมูลลูกค้า
                          </Button>
                          <Button
                            type="default"
                            icon={<BuildOutlined />}
                            onClick={() => showDepartmentModal()}
                            block
                          >
                            เพิ่มหน่วยงาน
                          </Button>
                        </Space>
                      </Card>
                    </Col>

                    <Col xs={24} md={16}>
                      <Card
                        className="purchase-card"
                        style={{ height: "100%" }}
                      >
                        <Tabs defaultActiveKey="1">
                          <TabPane
                            tab={
                              <Space>
                                <BankOutlined />
                                หน่วยงาน (
                                {selectedCustomer.departments?.length || 0})
                              </Space>
                            }
                            key="1"
                          >
                            <Table
                              columns={departmentColumns}
                              dataSource={selectedCustomer.departments || []}
                              pagination={false}
                              rowKey="id"
                              loading={departmentLoading}
                              locale={{
                                emptyText: "ไม่มีข้อมูลหน่วยงาน",
                              }}
                              scroll={{ x: 800 }}
                            />
                          </TabPane>
                          <TabPane
                            tab={
                              <Space>
                                <FileTextOutlined />
                                ใบวางบิล (
                                {selectedCustomer.InvoiceCustomerItem?.length ||
                                  0}
                                )
                              </Space>
                            }
                            key="2"
                          >
                            <Table
                              columns={invoiceColumns}
                              dataSource={
                                selectedCustomer.InvoiceCustomerItem || []
                              }
                              pagination={false}
                              rowKey="id"
                              locale={{
                                emptyText: "ไม่มีข้อมูลใบวางบิล",
                              }}
                              scroll={{ x: 800 }}
                            />
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
                    loading={loading}
                    scroll={{ x: 1000 }}
                  />

                  <div className="pagination-container">
                    <Pagination
                      current={currentPage}
                      total={filteredCustomers.length}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} จาก ${total} รายการ`
                      }
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Add/Edit Customer Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            {selectedCustomer ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
          </Space>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Customer Basic Info */}
          <Title level={5}>ข้อมูลลูกค้า</Title>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="ชื่อลูกค้า"
                rules={[
                  { required: true, message: "กรุณากรอกชื่อลูกค้า" },
                  { min: 2, message: "ชื่อลูกค้าต้องมีอย่างน้อย 2 ตัวอักษร" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="กรอกชื่อลูกค้า" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactInfo"
                label="ข้อมูลติดต่อ"
                rules={[{ required: true, message: "กรุณากรอกข้อมูลติดต่อ" }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="เบอร์โทรศัพท์ หรือ อีเมล"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="ที่อยู่">
            <Input.TextArea rows={3} placeholder="กรอกที่อยู่ของลูกค้า" />
          </Form.Item>

          {/* Departments Section - Only show for new customers */}
          {!selectedCustomer && (
            <>
              <Divider />
              <Title level={5}>
                <BankOutlined style={{ marginRight: 8 }} />
                หน่วยงาน (ไม่บังคับ)
              </Title>
              <Text
                type="secondary"
                style={{ marginBottom: 16, display: "block" }}
              >
                คุณสามารถเพิ่มหน่วยงานได้ทันทีหรือเพิ่มภายหลัง
              </Text>

              <Form.List name="departments">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        style={{ marginBottom: 16 }}
                        title={`หน่วยงานที่ ${key + 1}`}
                        extra={
                          fields.length > 1 && (
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                            >
                              ลบ
                            </Button>
                          )
                        }
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "name"]}
                              label="ชื่อหน่วยงาน"
                              rules={[
                                {
                                  required: fields.length === 1 && key === 0,
                                  message: "กรุณากรอกชื่อหน่วยงาน",
                                },
                              ]}
                            >
                              <Input
                                prefix={<BankOutlined />}
                                placeholder="เช่น สำนักงานใหญ่, สาขา A"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "type"]}
                              label="ประเภท"
                              rules={[
                                {
                                  required: fields.length === 1 && key === 0,
                                  message: "กรุณาเลือกประเภท",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "price"]}
                              label="ราคา"
                              rules={[
                                {
                                  required: fields.length === 1 && key === 0,
                                  message: "กรุณากรอกราคา",
                                },
                              ]}
                            >
                              <Input
                                type="number"
                                prefix="฿"
                                suffix="บาท"
                                placeholder="0.00"
                                min={0}
                                step={0.01}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "unit"]}
                              label="หน่วย"
                              rules={[
                                {
                                  required: fields.length === 1 && key === 0,
                                  message: "กรุณาเลือกหน่วย",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "contactInfo"]}
                              label="ข้อมูลติดต่อ (เฉพาะหน่วยงาน)"
                            >
                              <Input
                                prefix={<PhoneOutlined />}
                                placeholder="ไม่บังคับ"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "address"]}
                              label="ที่อยู่ (เฉพาะหน่วยงาน)"
                            >
                              <Input placeholder="ไม่บังคับ" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        เพิ่มหน่วยงาน
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </>
          )}

          <Form.Item className="form-actions" style={{ marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {selectedCustomer ? "อัพเดต" : "สร้าง"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit Department Modal */}
      <Modal
        title={
          <Space>
            <BankOutlined />
            {selectedDepartment ? "แก้ไขข้อมูลหน่วยงาน" : "เพิ่มหน่วยงานใหม่"}
          </Space>
        }
        visible={isDepartmentModalVisible}
        onCancel={handleDepartmentCancel}
        footer={null}
        width={700}
      >
        <Form
          form={departmentForm}
          layout="vertical"
          onFinish={handleDepartmentSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="ชื่อหน่วยงาน"
                rules={[
                  { required: true, message: "กรุณากรอกชื่อหน่วยงาน" },
                  { min: 2, message: "ชื่อหน่วยงานต้องมีอย่างน้อย 2 ตัวอักษร" },
                ]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="เช่น สำนักงานใหญ่, สาขา A"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="ประเภทหน่วยงาน"
                rules={[
                  { required: true, message: "กรุณาเลือกประเภทหน่วยงาน" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="ราคา"
                rules={[
                  { required: true, message: "กรุณากรอกราคา" },
                  {
                    type: "number",
                    min: 0,
                    message: "ราคาต้องเป็นจำนวนที่มากกว่า 0",
                    transform: (value) => Number(value),
                  },
                ]}
              >
                <Input
                  type="number"
                  prefix="฿"
                  suffix="บาท"
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="หน่วย"
                rules={[{ required: true, message: "กรุณาเลือกหน่วย" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="contactInfo" label="ข้อมูลติดต่อ (เฉพาะหน่วยงาน)">
            <Input
              prefix={<PhoneOutlined />}
              placeholder="เบอร์โทรศัพท์ หรือ อีเมลเฉพาะหน่วยงาน (ไม่บังคับ)"
            />
          </Form.Item>

          <Form.Item name="address" label="ที่อยู่ (เฉพาะหน่วยงาน)">
            <Input.TextArea
              rows={3}
              placeholder="ที่อยู่เฉพาะหน่วยงาน (ไม่บังคับ)"
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleDepartmentCancel}>ยกเลิก</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={departmentLoading}
              >
                {selectedDepartment ? "อัพเดต" : "สร้าง"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Invoice Detail Drawer */}
      <Drawer
        title={
          <Space>
            <FileTextOutlined />
            รายละเอียดใบวางบิล
          </Space>
        }
        visible={invoiceDetail}
        onClose={handleCloseDrawer}
        width={800}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={createPDF}
            >
              พิมพ์ PDF
            </Button>
            <Button onClick={handleCloseDrawer}>ปิด</Button>
          </Space>
        }
      >
        {selectedInvoice && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card>
                    <Descriptions title="ข้อมูลใบวางบิล" bordered column={2}>
                      <Descriptions.Item label="เลขที่ใบวางบิล" span={1}>
                        <Text strong>{selectedInvoice.id}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="วันที่" span={1}>
                        <Text>
                          {dayjs(selectedInvoice.dueDate).format("DD/MM/YYYY")}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="ชื่อลูกค้า" span={1}>
                        <Text strong>{selectedCustomer?.name}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="หน่วยงาน" span={1}>
                        <Tag color="blue">
                          {selectedInvoice.department?.name || "ไม่ระบุ"}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="ราคารวม" span={2}>
                        <Text strong style={{ fontSize: 18, color: "#52c41a" }}>
                          ฿
                          {Number(selectedInvoice.totalAmount).toLocaleString()}
                        </Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            </div>

            <Card title="รายการสินค้า">
              <Table
                columns={columnDetail}
                dataSource={selectedInvoice.InvoiceCustomer || []}
                rowKey="id"
                pagination={false}
                scroll={{ x: 800 }}
                summary={(pageData) => {
                  let totalQuantity = 0;
                  let totalWeight = 0;
                  let totalAmount = 0;

                  pageData.forEach(({ quantity, weight, amount }) => {
                    totalQuantity += quantity;
                    totalWeight += weight;
                    totalAmount += amount;
                  });

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell>
                        <Text strong>รวมทั้งหมด</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell />
                      <Table.Summary.Cell align="center">
                        <Text strong>{totalQuantity}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align="right">
                        <Text strong>{totalWeight} กก.</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align="right">
                        <Text strong style={{ color: "#52c41a" }}>
                          ฿{totalAmount.toLocaleString()}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            </Card>
          </>
        )}
      </Drawer>
    </div>
  );
};

Customers.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Customers;
