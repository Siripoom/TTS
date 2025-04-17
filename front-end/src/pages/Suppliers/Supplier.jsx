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
  Space,
  Modal,
  Form,
  message,
  Drawer,
} from "antd";
import {
  ShopOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import "./Supplier.css";
import PropTypes from "prop-types";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Supplier = ({ sidebarVisible, toggleSidebar }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const [invoiceDetailsVisible, setInvoiceDetailsVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    // Mock data - replace with actual API call later
    const mockSuppliers = [
      {
        id: "1",
        name: "บริษัท A จำกัด",
        contactInfo: "0800000001",
        address: "123 ถนนสุขุมวิท กรุงเทพฯ",
        createdAt: "10/03/2568",
        invoices: [
          {
            id: "inv1",
            invoiceNumber: "INV-20250310-001",
            date: "15/03/2568",
            amount: 23000,
            status: "ชำระแล้ว",
            items: [
              {
                id: "item1",
                itemName: "วัสดุก่อสร้าง",
                quantity: 10,
                unitPrice: 1500,
                total: 15000,
              },
              {
                id: "item2",
                itemName: "อุปกรณ์ขนส่ง",
                quantity: 4,
                unitPrice: 2000,
                total: 8000,
              },
            ],
          },
          {
            id: "inv2",
            invoiceNumber: "INV-20250315-002",
            date: "25/03/2568",
            amount: 18500,
            status: "ค้างชำระ",
            items: [
              {
                id: "item3",
                itemName: "อุปกรณ์ซ่อมบำรุง",
                quantity: 5,
                unitPrice: 3700,
                total: 18500,
              },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "บริษัท B ซัพพลาย",
        contactInfo: "0899999999",
        address: "456 ถนนเพชรบุรี กรุงเทพฯ",
        createdAt: "15/03/2568",
        invoices: [
          {
            id: "inv3",
            invoiceNumber: "INV-20250318-003",
            date: "18/03/2568",
            amount: 25000,
            status: "ชำระแล้ว",
            items: [
              {
                id: "item4",
                itemName: "น้ำมันเชื้อเพลิง",
                quantity: 500,
                unitPrice: 50,
                total: 25000,
              },
            ],
          },
        ],
      },
      {
        id: "3",
        name: "ห้างหุ้นส่วน C",
        contactInfo: "0877777777",
        address: "789 ถนนรัชดาภิเษก กรุงเทพฯ",
        createdAt: "22/03/2568",
        invoices: [
          {
            id: "inv4",
            invoiceNumber: "INV-20250325-004",
            date: "25/03/2568",
            amount: 12000,
            status: "ชำระแล้ว",
            items: [
              {
                id: "item5",
                itemName: "อะไหล่รถบรรทุก",
                quantity: 3,
                unitPrice: 4000,
                total: 12000,
              },
            ],
          },
          {
            id: "inv5",
            invoiceNumber: "INV-20250330-005",
            date: "30/03/2568",
            amount: 5500,
            status: "ค้างชำระ",
            items: [
              {
                id: "item6",
                itemName: "อุปกรณ์ซ่อมบำรุง",
                quantity: 11,
                unitPrice: 500,
                total: 5500,
              },
            ],
          },
        ],
      },
    ];

    setSuppliers(mockSuppliers);
  }, []);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
      supplier.contactInfo.includes(searchText)
  );

  const showModal = (supplier = null) => {
    setSelectedSupplier(supplier);
    if (supplier) {
      form.setFieldsValue({
        name: supplier.name,
        contactInfo: supplier.contactInfo,
        address: supplier.address,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSupplier(null);
  };

  const handleSubmit = (values) => {
    if (selectedSupplier) {
      // Update existing supplier
      const updatedSuppliers = suppliers.map((s) =>
        s.id === selectedSupplier.id ? { ...s, ...values } : s
      );
      setSuppliers(updatedSuppliers);
      message.success("ข้อมูลซัพพลายเออร์ได้รับการอัพเดตแล้ว");
    } else {
      // Create new supplier
      const newSupplier = {
        id: (suppliers.length + 1).toString(),
        ...values,
        createdAt: new Date().toLocaleDateString("th-TH"),
        invoices: [],
      };
      setSuppliers([...suppliers, newSupplier]);
      message.success("เพิ่มซัพพลายเออร์ใหม่แล้ว");
    }
    setIsModalVisible(false);
  };

  // Function to show invoice details
  const showInvoiceDetails = (invoiceId) => {
    if (selectedSupplier) {
      const invoice = selectedSupplier.invoices.find(
        (inv) => inv.id === invoiceId
      );
      if (invoice) {
        setSelectedInvoice(invoice);
        setInvoiceDetailsVisible(true);
      }
    }
  };

  // Function to close invoice details drawer
  const closeInvoiceDetails = () => {
    setInvoiceDetailsVisible(false);
  };

  const showDeleteConfirm = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (supplierToDelete) {
      const updatedSuppliers = suppliers.filter(
        (s) => s.id !== supplierToDelete.id
      );
      setSuppliers(updatedSuppliers);
      message.success("ลบซัพพลายเออร์เรียบร้อยแล้ว");
      setIsDeleteModalVisible(false);
      setSupplierToDelete(null);
    }
  };

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
  };

  // Supplier list columns
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
            onClick={() => handleViewSupplier(record)}
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

  // Invoice columns
  const invoiceColumns = [
    {
      title: "เลขใบวางบิล",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
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
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "ชำระแล้ว" ? "#52c41a" : "#f5222d",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => showInvoiceDetails(record.id)}>
          ดูรายละเอียด
        </Button>
      ),
    },
  ];

  // Invoice details columns
  const invoiceItemColumns = [
    {
      title: "รายการ",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "ราคาต่อหน่วย",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => `฿${price.toFixed(2)}`,
    },
    {
      title: "รวม",
      dataIndex: "total",
      key: "total",
      render: (total) => `฿${total.toFixed(2)}`,
    },
  ];

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="ซัพพลายเออร์" toggleSidebar={toggleSidebar} />

        <div className="supplier-container">
          <div className="content-wrapper">
            <Card className="supplier-card">
              <div className="card-header">
                <Title level={4}>รายการซัพพลายเออร์</Title>
                <div className="card-actions">
                  <Input
                    placeholder="ค้นหาซัพพลายเออร์..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 250, marginRight: 16 }}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                  >
                    เพิ่มซัพพลายเออร์ใหม่
                  </Button>
                </div>
              </div>

              {selectedSupplier ? (
                <div className="supplier-detail">
                  <div className="detail-header">
                    <Button
                      type="link"
                      onClick={() => setSelectedSupplier(null)}
                    >
                      &lt; กลับไปยังรายการซัพพลายเออร์
                    </Button>
                  </div>

                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <Card className="info-card">
                        <div className="supplier-avatar ">
                          <ShopOutlined />
                        </div>
                        <Title level={4}>{selectedSupplier.name}</Title>
                        <div className="supplier-info">
                          <p>
                            <strong>ข้อมูลติดต่อ:</strong>{" "}
                            {selectedSupplier.contactInfo}
                          </p>
                          <p>
                            <strong>ที่อยู่:</strong> {selectedSupplier.address}
                          </p>
                          <p>
                            <strong>วันที่สร้าง:</strong>{" "}
                            {selectedSupplier.createdAt}
                          </p>
                        </div>
                        <div className="supplier-actions">
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => showModal(selectedSupplier)}
                          >
                            แก้ไขข้อมูล
                          </Button>
                        </div>
                      </Card>
                    </Col>

                    <Col xs={24} md={16}>
                      <Card className="purchase-card">
                        <Title level={5}>ใบวางบิล</Title>
                        <Table
                          columns={invoiceColumns}
                          dataSource={selectedSupplier.invoices}
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
                                  <Text strong>฿{totalAmount.toFixed(2)}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell></Table.Summary.Cell>
                              </Table.Summary.Row>
                            );
                          }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              ) : (
                <>
                  <Table
                    columns={columns}
                    dataSource={filteredSuppliers.slice(
                      (currentPage - 1) * pageSize,
                      currentPage * pageSize
                    )}
                    pagination={false}
                    rowKey="id"
                  />

                  <div className="pagination-container">
                    <Pagination
                      current={currentPage}
                      total={filteredSuppliers.length}
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

      {/* Add/Edit Supplier Modal */}
      <Modal
        title={
          selectedSupplier ? "แก้ไขข้อมูลซัพพลายเออร์" : "เพิ่มซัพพลายเออร์ใหม่"
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="ชื่อ"
            rules={[{ required: true, message: "กรุณากรอกชื่อซัพพลายเออร์" }]}
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

          <Form.Item
            name="address"
            label="ที่อยู่"
            rules={[{ required: true, message: "กรุณากรอกที่อยู่" }]}
          >
            <Input.TextArea rows={3} />
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
              {selectedSupplier ? "อัพเดต" : "สร้าง"}
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
        <p>คุณแน่ใจที่จะลบซัพพลายเออร์ "{supplierToDelete?.name}" หรือไม่?</p>
        <p>การกระทำนี้จะไม่สามารถเปลี่ยนกลับได้</p>
      </Modal>

      {/* Invoice Details Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            <span>รายละเอียดใบวางบิล: {selectedInvoice?.invoiceNumber}</span>
          </div>
        }
        width={600}
        placement="right"
        onClose={closeInvoiceDetails}
        visible={invoiceDetailsVisible}
      >
        {selectedInvoice && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <p>
                    <strong>เลขที่ใบวางบิล:</strong>{" "}
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <p>
                    <strong>วันที่:</strong> {selectedInvoice.date}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <strong>จำนวนเงินรวม:</strong> ฿
                    {selectedInvoice.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>สถานะ:</strong>{" "}
                    <span
                      style={{
                        color:
                          selectedInvoice.status === "ชำระแล้ว"
                            ? "#52c41a"
                            : "#f5222d",
                      }}
                    >
                      {selectedInvoice.status}
                    </span>
                  </p>
                </Col>
              </Row>
            </div>

            <Title level={5}>รายการสินค้า</Title>
            <Table
              columns={invoiceItemColumns}
              dataSource={selectedInvoice.items}
              pagination={false}
              rowKey="id"
              summary={(pageData) => {
                let totalAmount = 0;
                pageData.forEach(({ total }) => {
                  totalAmount += total;
                });
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>
                      <strong>รวมทั้งหมด</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell>
                      <Text strong>฿{totalAmount.toFixed(2)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </>
        )}
      </Drawer>
    </div>
  );
};

Supplier.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Supplier;
