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

import "./User.css";
import PropTypes from "prop-types";

const { Title } = Typography;

const UserAndTruck = ({ sidebarVisible, toggleSidebar }) => {
  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="จักการรถและผู้ใช้" toggleSidebar={toggleSidebar} />

        <div className="user-container">
          <div className="content-wrapper"></div>
        </div>
      </div>
    </div>
  );
};

UserAndTruck.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default UserAndTruck;
