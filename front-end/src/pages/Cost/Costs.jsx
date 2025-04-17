import { useState } from "react";
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

import "./Costs.css";
import PropTypes from "prop-types";

const { Title } = Typography;

const Costs = ({ sidebarVisible, toggleSidebar }) => {
  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="ต้นทุน" toggleSidebar={toggleSidebar} />

        <div className="costs-container">
          <div className="content-wrapper"></div>
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
