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

import "./Report.css";
import PropTypes from "prop-types";
import { getUser } from "../../services/api";

const { Title } = Typography;

const Report = ({ sidebarVisible, toggleSidebar }) => {
  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="รายงาน-ส่งออก" toggleSidebar={toggleSidebar} />

        <div className="report-container"></div>
      </div>
    </div>
  );
};

Report.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Report;
