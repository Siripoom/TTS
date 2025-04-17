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
  Tag,
  Popconfirm,
  message,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
  DollarOutlined,
  BarcodeOutlined,
  TagsOutlined,
} from "@ant-design/icons";

import "./Products.css";
import PropTypes from "prop-types";

const { Title, Text } = Typography;
const { Option } = Select;

const Products = ({ sidebarVisible }) => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalProducts: 0,
    avgCostPrice: 0,
    avgSellingPrice: 0,
    avgProfit: 0,
    categories: [],
  });

  const pageSize = 10;

  // Load mock data for products
  useEffect(() => {
    // Mock data for products
    const mockProducts = [
      {
        id: "1",
        name: "ชิ้นส่วนเครื่องยนต์",
        category: "อะไหล่รถยนต์",
        costPrice: 5000.0,
        sellingPrice: 7500.0,
        createdAt: "2025-03-15",
        updatedAt: "2025-03-15",
      },
      {
        id: "2",
        name: "น้ำมันเครื่อง Premium",
        category: "น้ำมันและสารหล่อลื่น",
        costPrice: 350.0,
        sellingPrice: 499.0,
        createdAt: "2025-03-10",
        updatedAt: "2025-03-10",
      },
      {
        id: "3",
        name: "ยางรถยนต์ขนาด 16 นิ้ว",
        category: "ยางรถยนต์",
        costPrice: 2500.0,
        sellingPrice: 3600.0,
        createdAt: "2025-03-05",
        updatedAt: "2025-03-08",
      },
      {
        id: "4",
        name: "เบรก ABS",
        category: "อะไหล่รถยนต์",
        costPrice: 3200.0,
        sellingPrice: 4800.0,
        createdAt: "2025-03-02",
        updatedAt: "2025-03-02",
      },
      {
        id: "5",
        name: "กระจกมองข้าง",
        category: "อุปกรณ์ตกแต่ง",
        costPrice: 1800.0,
        sellingPrice: 2500.0,
        createdAt: "2025-02-28",
        updatedAt: "2025-02-28",
      },
      {
        id: "6",
        name: "แบตเตอรี่รถยนต์",
        category: "อะไหล่รถยนต์",
        costPrice: 3500.0,
        sellingPrice: 4900.0,
        createdAt: "2025-02-25",
        updatedAt: "2025-02-25",
      },
      {
        id: "7",
        name: "น้ำยาหล่อเย็น",
        category: "น้ำมันและสารหล่อลื่น",
        costPrice: 280.0,
        sellingPrice: 450.0,
        createdAt: "2025-02-20",
        updatedAt: "2025-02-20",
      },
      {
        id: "8",
        name: "ไส้กรองอากาศ",
        category: "อะไหล่รถยนต์",
        costPrice: 450.0,
        sellingPrice: 650.0,
        createdAt: "2025-02-18",
        updatedAt: "2025-02-18",
      },
      {
        id: "9",
        name: "หลอดไฟหน้า LED",
        category: "อุปกรณ์ตกแต่ง",
        costPrice: 1200.0,
        sellingPrice: 1800.0,
        createdAt: "2025-02-15",
        updatedAt: "2025-02-15",
      },
      {
        id: "10",
        name: "น้ำยาล้างหัวฉีด",
        category: "น้ำมันและสารหล่อลื่น",
        costPrice: 180.0,
        sellingPrice: 320.0,
        createdAt: "2025-02-10",
        updatedAt: "2025-02-10",
      },
      {
        id: "11",
        name: "ล้อแม็กซ์",
        category: "อุปกรณ์ตกแต่ง",
        costPrice: 4500.0,
        sellingPrice: 6800.0,
        createdAt: "2025-02-05",
        updatedAt: "2025-02-05",
      },
      {
        id: "12",
        name: "เบาะหนังแท้",
        category: "อุปกรณ์ตกแต่งภายใน",
        costPrice: 8500.0,
        sellingPrice: 12000.0,
        createdAt: "2025-02-01",
        updatedAt: "2025-02-01",
      },
    ];

    setProducts(mockProducts);

    // Calculate statistics
    const totalProducts = mockProducts.length;
    const totalCostPrice = mockProducts.reduce(
      (sum, product) => sum + product.costPrice,
      0
    );
    const totalSellingPrice = mockProducts.reduce(
      (sum, product) => sum + product.sellingPrice,
      0
    );

    // Group by category
    const categoryMap = {};
    mockProducts.forEach((product) => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = {
          count: 0,
          totalCost: 0,
          totalSelling: 0,
        };
      }
      categoryMap[product.category].count += 1;
      categoryMap[product.category].totalCost += product.costPrice;
      categoryMap[product.category].totalSelling += product.sellingPrice;
    });

    const categories = Object.keys(categoryMap).map((category) => ({
      name: category,
      count: categoryMap[category].count,
      avgPrice:
        categoryMap[category].totalSelling / categoryMap[category].count,
    }));

    setStats({
      totalProducts,
      avgCostPrice: totalCostPrice / totalProducts,
      avgSellingPrice: totalSellingPrice / totalProducts,
      avgProfit: (totalSellingPrice - totalCostPrice) / totalProducts,
      categories,
    });
  }, []);

  // Filter products based on search text
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category.toLowerCase().includes(searchText.toLowerCase())
  );

  // Show modal for adding/editing product
  const showModal = (product = null) => {
    setSelectedProduct(product);
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
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (selectedProduct) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              ...values,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : p
      );
      setProducts(updatedProducts);
      message.success("อัพเดตข้อมูลสินค้าเรียบร้อยแล้ว");
    } else {
      // Create new product
      const newProduct = {
        id: (products.length + 1).toString(),
        ...values,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setProducts([...products, newProduct]);
      message.success("เพิ่มสินค้าใหม่เรียบร้อยแล้ว");
    }
    setIsModalVisible(false);
  };

  // Show delete confirmation dialog
  const showDeleteConfirm = (product) => {
    setProductToDelete(product);
    setIsDeleteModalVisible(true);
  };

  // Handle product deletion
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(
        (p) => p.id !== productToDelete.id
      );
      setProducts(updatedProducts);
      message.success("ลบสินค้าเรียบร้อยแล้ว");
      setIsDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  // Table columns
  const columns = [
    {
      title: "รหัสสินค้า",
      dataIndex: "id",
      key: "id",
      width: 100,
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
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?"
            onConfirm={() => showDeleteConfirm(record)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      <div className="costs-container">
        <div className="content-wrapper">
          {/* Statistics Section */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="จำนวนสินค้าทั้งหมด"
                  value={stats.totalProducts}
                  prefix={<BarcodeOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="ราคาต้นทุนเฉลี่ย"
                  value={stats.avgCostPrice}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="฿"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="ราคาขายเฉลี่ย"
                  value={stats.avgSellingPrice}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="฿"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic
                  title="กำไรเฉลี่ย"
                  value={stats.avgProfit}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="฿"
                />
              </Card>
            </Col>
          </Row>

          {/* Category Stats */}
          <Card className="mb-4" title="สถิติตามหมวดหมู่">
            <Row gutter={[16, 16]}>
              {stats.categories.map((category, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card size="small" className="category-card">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TagsOutlined
                        style={{
                          fontSize: "24px",
                          marginRight: "12px",
                          color: "#1890ff",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {category.name}
                        </div>
                        <div>จำนวน: {category.count} รายการ</div>
                        <div>ราคาเฉลี่ย: ฿{category.avgPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Product List Card */}
          <Card className="product-card">
            <div className="card-header">
              <Title level={4}>รายการสินค้า</Title>
              <div className="card-actions">
                <Input
                  placeholder="ค้นหาสินค้า..."
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250, marginRight: 16 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showModal()}
                >
                  เพิ่มสินค้า
                </Button>
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={filteredProducts.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="id"
              pagination={false}
            />

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredProducts.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        title={selectedProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="ลบ"
        cancelText="ยกเลิก"
        okButtonProps={{ danger: true }}
      >
        <p>คุณแน่ใจหรือไม่ที่จะลบสินค้า "{productToDelete?.name}"?</p>
        <p>การกระทำนี้ไม่สามารถย้อนกลับได้</p>
      </Modal>
    </div>
  );
};

Products.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Products;
