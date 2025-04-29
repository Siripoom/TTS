import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Button,
  Space,
  Dropdown,
  Table,
  Pagination,
} from "antd";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  DownOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

import "./Dashboard.css";
import PropTypes from "prop-types";
import { getUser } from "../../services/api";

const { Title } = Typography;

const Dashboard = ({ sidebarVisible, toggleSidebar }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      name: "A",
      phone: "0000000009",
      date: "12/05/2568",
      time: "06:00",
    },
    {
      key: "2", 
      name: "B",
      phone: "092xxxxxxx",
      date: "13/05/2568",
      time: "18:00",
    },
    {
      key: "3",
      name: "C",
      phone: "092xxxxxxx",
      date: "15/05/2568",
      time: "16:00",
    },
  ]);

  const findUserDriver = async () => {
    const res = await getUser();
    const userDriver = res.data.filter((user) => user.role === "driver");
    setDataSource(userDriver);
  }

  useEffect(() => {
    findUserDriver();
  }, []);

  const items = [
    {
      label: "Today",
      key: "1",
    },
    {
      label: "Yesterday",
      key: "2",
    },
    {
      label: "Last 7 days",
      key: "3",
    },
    {
      label: "Last 30 days",
      key: "4",
    },
    {
      label: "Custom",
      key: "5",
    },
  ];

  const columns = [
    {
      title: "ชื่อคนขับรถ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "วันที่ขับ",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "จำนวนเที่ยว",
      dataIndex: "time",
      key: "time",
    },
  ];
  const menuProps = {
    items,
  };

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="ภาพรวม" toggleSidebar={toggleSidebar} />

        <div className="dashboard-container">
          <div className="content-wrapper">
            {/* Data Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <Title level={5} className="section-title">
                  ข้อมูล
                </Title>
                <Dropdown menu={menuProps}>
                  <Button size="small" className="date-filter-btn">
                    <Space>
                      Today
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} md={8}>
                  <Card className="stat-card pink-card">
                    <div className="stat-icon">
                      <BarChartOutlined />
                    </div>
                    <div className="stat-value">$1k</div>
                    <div className="stat-desc">ยอดส่ง</div>
                  </Card>
                </Col>
                <Col xs={24} sm={8} md={8}>
                  <Card className="stat-card yellow-card">
                    <div className="stat-icon">
                      <FileTextOutlined />
                    </div>
                    <div className="stat-value">300</div>
                    <div className="stat-desc">จำนวนรถ</div>
                  </Card>
                </Col>
                <Col xs={24} sm={8} md={8}>
                  <Card className="stat-card green-card">
                    <div className="stat-icon">
                      <CheckCircleOutlined />
                    </div>
                    <div className="stat-value">5</div>
                    <div className="stat-desc">ส่งสำเร็จ</div>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Row with Cost and Invoice Sections */}
            <Row gutter={[16, 16]}>
              {/* ต้นทุนรถ Section */}
              <Col xs={24} md={12}>
                <div className="dashboard-section">
                  <div className="section-header">
                    <Title level={5} className="section-title">
                      ต้นทุนรถ
                    </Title>
                    <Dropdown menu={menuProps}>
                      <Button size="small" className="date-filter-btn">
                        <Space>
                          Today
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                  </div>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Card className="stat-card pink-card">
                        <div className="stat-icon">
                          <BarChartOutlined />
                        </div>
                        <div className="stat-value">$1k</div>
                        <div className="stat-desc">เชื้อเพลง</div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card className="stat-card yellow-card">
                        <div className="stat-icon">
                          <FileTextOutlined />
                        </div>
                        <div className="stat-value">300</div>
                        <div className="stat-desc">ค่าซ่อมบำรุง</div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>

              {/* ยอดใบขนขีส Section */}
              <Col xs={24} md={12}>
                <div className="dashboard-section">
                  <div className="section-header">
                    <Title level={5} className="section-title">
                      ยอดใบวางบิล
                    </Title>
                    <Dropdown menu={menuProps}>
                      <Button size="small" className="date-filter-btn">
                        <Space>
                          Today
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                  </div>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Card className="stat-card purple-card">
                        <div className="stat-icon">
                          <BarChartOutlined />
                        </div>
                        <div className="stat-value">$1k</div>
                        <div className="stat-desc">ยอดรวมใบวางบิล</div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card className="stat-card yellow-card">
                        <div className="stat-icon">
                          <FileTextOutlined />
                        </div>
                        <div className="stat-value">300</div>
                        <div className="stat-desc">ใบที่ค้างชำระ</div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            {/* Transport Report Section */}
            <div className="dashboard-section">
              <div className="section-header">
                <Title level={5}>รายการการเดินรถของหน่วยงานขับรถบรรทุก</Title>
                <Dropdown menu={menuProps}>
                  <Button size="small">
                    <Space>
                      Today
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={14}>
                  <Card className="table-card">
                    <Table
                      dataSource={dataSource}
                      columns={columns}
                      pagination={false}
                      size="middle"
                    />
                    <div className="custom-pagination">
                      <Pagination
                        current={currentPage}
                        onChange={setCurrentPage}
                        total={50}
                        showSizeChanger={false}
                        size="small"
                        itemRender={(page, type) => {
                          if (type === "prev") {
                            return <Button size="small">&lt;</Button>;
                          }
                          if (type === "next") {
                            return <Button size="small">&gt;</Button>;
                          }
                          return <Button size="small">{page}</Button>;
                        }}
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={10}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Card className="stat-summary-card success-card">
                        <div className="stat-summary-content">
                          <span className="stat-summary-value">45</span>
                          <div className="stat-summary-badge">รถ</div>
                        </div>
                        <div className="stat-summary-label">จำนวนรถทั้งหมด</div>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card className="stat-summary-card failed-card">
                        <div className="stat-summary-content">
                          <span className="stat-summary-value">02</span>
                          <div className="stat-summary-badge">รถ</div>
                        </div>
                        <div className="stat-summary-label">จำนวนเสียหาย</div>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Dashboard;
