import { useState } from "react";
import { Card, Typography, Breadcrumb, Tabs } from "antd";
import {
  ShopOutlined,
  DollarOutlined,
  CarOutlined,
  ToolOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Products from "./Products";

import "./Costs.css";
import PropTypes from "prop-types";

const { Title } = Typography;
const { TabPane } = Tabs;

const Costs = ({ sidebarVisible, toggleSidebar }) => {
  const [activeKey, setActiveKey] = useState("products");

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="ต้นทุน" toggleSidebar={toggleSidebar} />

        <div className="costs-container">
          <div className="content-wrapper">
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              className="costs-tabs"
              tabPosition="top"
              type="card"
            >
              <TabPane
                tab={
                  <span>
                    <ShopOutlined />
                    สินค้า
                  </span>
                }
                key="products"
              >
                <Products
                  sidebarVisible={sidebarVisible}
                  toggleSidebar={toggleSidebar}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <DollarOutlined />
                    น้ำมันเชื้อเพลิง
                  </span>
                }
                key="fuel"
              >
                <div className="placeholder-content">
                  <Title level={4}>ข้อมูลน้ำมันเชื้อเพลิง</Title>
                  <p>ส่วนนี้จะแสดงข้อมูลเกี่ยวกับต้นทุนน้ำมันเชื้อเพลิง</p>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <ToolOutlined />
                    ซ่อมบำรุง
                  </span>
                }
                key="maintenance"
              >
                <div className="placeholder-content">
                  <Title level={4}>ข้อมูลซ่อมบำรุง</Title>
                  <p>ส่วนนี้จะแสดงข้อมูลเกี่ยวกับต้นทุนการซ่อมบำรุง</p>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CarOutlined />
                    ค่าใช้จ่ายอื่นๆ
                  </span>
                }
                key="other"
              >
                <div className="placeholder-content">
                  <Title level={4}>ค่าใช้จ่ายอื่นๆ</Title>
                  <p>
                    ส่วนนี้จะแสดงข้อมูลเกี่ยวกับค่าใช้จ่ายอื่นๆ
                    ที่เกี่ยวข้องกับต้นทุน
                  </p>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

Costs.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Costs;
