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
  Tag,
  Popconfirm,
  Select,
  InputNumber
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
import { addSupplier, getSuppliers, updateSupplier, deleteSupplier, updateProduct, addProduct } from "../../services/api"; // Mock API call

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
  const [productToDelete, setProductToDelete] = useState(null);
  const [form] = Form.useForm();
  const [invoiceDetailsVisible, setInvoiceDetailsVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalProduct, setModalProduct] = useState(false);
  const [modalProductDelete, setModalProductDelete] = useState(false);
  const pageSize = 10;
  const token = localStorage.getItem("token");

  const fetchSuppliers = async () => {
    const res = await getSuppliers(token);
    console.log(res);
    setSuppliers(res.data);
  }
  useEffect(() => {
    // Mock data - replace with actual API call later


    fetchSuppliers();
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

  const showModalProduct = (product = null) => {
    setSelectedProduct(product);
    console.log(product)
    if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
      });
    } else {
      form.resetFields();
    }
    setModalProduct(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSupplier(null);
  };

  const handleSubmitProduct = async (values) => {
    console.log(selectedSupplier)
    values.supplierId = selectedSupplier.id;
    if (selectedProduct) {

      // Update existing product
      const res = await updateProduct(
        values,
        selectedProduct.id,
        token
      );
      if (!res.success) {
        message.error("เกิดข้อผิดพลาดในการอัพเดตสินค้า");
        return;
      }
      const updatedProducts = selectedSupplier.Product.map((p) =>
        p.id === selectedProduct.id ? { ...p, ...values } : p
      );
      setSelectedSupplier({ ...selectedSupplier, Product: updatedProducts });
      message.success("อัพเดตข้อมูลสินค้าเรียบร้อยแล้ว");
    } else {
      // Create new product
      const res = await addProduct(values, token);
      console.log(res)
      if (!res.success) {
        message.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
        return;
      }
      setSelectedSupplier({ ...selectedSupplier, Product: [...selectedSupplier.Product, res.data] });
      
      message.success("เพิ่มสินค้าใหม่เรียบร้อยแล้ว");
    }
    handleCancelProduct();
    fetchSuppliers();
  };

  const handleSubmit = async (values) => {
    if (selectedSupplier) {
      // Update existing supplier
      const res = await updateSupplier(
        values,
        selectedSupplier.id,
        token
      );
      if (!res.success) {
        message.error("เกิดข้อผิดพลาดในการอัพเดตซัพพลายเออร์");
        return;
      }
      const updatedSuppliers = suppliers.map((s) =>
        s.id === selectedSupplier.id ? { ...s, ...values } : s
      );
      setSuppliers(updatedSuppliers);
      message.success("ข้อมูลซัพพลายเออร์ได้รับการอัพเดตแล้ว");
    } else {
      // Create new supplier
      const res = await addSupplier(values, token);
      if (!res.success) {
        message.error("เกิดข้อผิดพลาดในการเพิ่มซัพพลายเออร์");
        return;
      }
      // const newSupplier = {
      //   id: (suppliers.length + 1).toString(),
      //   ...values,
      //   createdAt: new Date().toLocaleDateString("th-TH"),
      //   invoices: [],
      // };
      setSuppliers([...suppliers, res.data]);
      message.success("เพิ่มซัพพลายเออร์ใหม่แล้ว");
    }
    setSelectedSupplier(null);
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

  const handleDeleteConfirm = async () => {
    if (supplierToDelete) {

      const res = await deleteSupplier(supplierToDelete.id, token);
      if (!res.success) {
        message.error("เกิดข้อผิดพลาดในการลบซัพพลายเออร์");
        return;
      }
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

  const handleCancelProduct = () => {
    setModalProduct(false);
    setSelectedProduct(null);
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

  const productColumns = [
    {
      title: "รหัสสินค้า",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "หมวดหมู่",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "ราคาต้นทุน",
      dataIndex: "costPrice",
      key: "costPrice",
      render: (price) => `฿${price.toFixed(2)}`,
      sorter: (a, b) => a.costPrice - b.costPrice,
    },
    {
      title: "ราคาขาย",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      render: (price) => `฿${price.toFixed(2)}`,
      sorter: (a, b) => a.sellingPrice - b.sellingPrice,
    },
    {
      title: "กำไร",
      key: "profit",
      render: (_, record) => {
        const profit = record.sellingPrice - record.costPrice;
        const profitPercent = ((profit / record.costPrice) * 100).toFixed(0);
        return (
          <span style={{ color: profit > 0 ? "#52c41a" : "#f5222d" }}>
            ฿{profit.toFixed(2)} ({profitPercent}%)
          </span>
        );
      },
      sorter: (a, b) =>
        a.sellingPrice - a.costPrice - (b.sellingPrice - b.costPrice),
    },

    {
      title: "ACTION",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModalProduct(record)}
          />
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?"
            onConfirm={() => showProductDelete(record)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
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

                  <Row gutter={[24, 24]} >
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
                  <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col xs={24} md={24}>
                      <Card className="purchase-card">
                        <Row justify={"space-between"} align="middle">
                          <Title level={5}>รายการสินค้า</Title>
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModalProduct()}
                          >
                            เพิ่มสินค้าใหม่
                          </Button>
                        </Row>

                        <Table
                          columns={productColumns}
                          dataSource={selectedSupplier.Product}
                          pagination={false}
                          rowKey="id"
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

      {/* Add/Edit Product Modal */}
      <Modal
        title={selectedProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        visible={modalProduct}
        onCancel={handleCancelProduct}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitProduct}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="ชื่อสินค้า"
                rules={[{ required: true, message: "กรุณากรอกชื่อสินค้า" }]}
              >
                <Input prefix={<ShopOutlined />} placeholder="ชื่อสินค้า" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="category"
                label="หมวดหมู่"
                rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}
              >
                <Select placeholder="เลือกหมวดหมู่">
                  <Option value="อะไหล่รถยนต์">อะไหล่รถยนต์</Option>
                  <Option value="น้ำมันและสารหล่อลื่น">
                    น้ำมันและสารหล่อลื่น
                  </Option>
                  <Option value="ยางรถยนต์">ยางรถยนต์</Option>
                  <Option value="อุปกรณ์ตกแต่ง">อุปกรณ์ตกแต่ง</Option>
                  <Option value="อุปกรณ์ตกแต่งภายใน">อุปกรณ์ตกแต่งภายใน</Option>
                  <Option value="อื่นๆ">อื่นๆ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="costPrice"
                label="ราคาต้นทุน (บาท)"
                rules={[
                  { required: true, message: "กรุณากรอกราคาต้นทุน" },
                  { type: "number", min: 0, message: "ราคาต้องเป็นจำนวนบวก" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="฿"
                  precision={2}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sellingPrice"
                label="ราคาขาย (บาท)"
                rules={[
                  { required: true, message: "กรุณากรอกราคาขาย" },
                  { type: "number", min: 0, message: "ราคาต้องเป็นจำนวนบวก" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("costPrice") <= value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("ราคาขายต้องมากกว่าหรือเท่ากับราคาต้นทุน")
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="฿"
                  precision={2}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="form-actions">
            <Space>
              <Button type="default" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedProduct ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสินค้า"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="ยืนยันการลบสินค้า"
        visible={modalProductDelete}
        onCancel={() => setModalProductDelete(false)}
        onOk={handleDeleteConfirm}
        okText="ลบ"
        cancelText="ยกเลิก"
        okButtonProps={{ danger: true }}
      >
        <p>คุณแน่ใจหรือไม่ที่จะลบสินค้า "{productToDelete?.name}"?</p>
        <p>การกระทำนี้ไม่สามารถย้อนกลับได้</p>
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
