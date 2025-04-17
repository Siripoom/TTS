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

import "./TruckQueus.css";
import PropTypes from "prop-types";

const { Title } = Typography;

const TruckQueus = ({ sidebarVisible, toggleSidebar }) => {
  return (
    <div className={`admin-layout ${sidebarVisible ? "" : "sidebar-closed"}`}>
      {sidebarVisible && <Sidebar />}

      <div className="content-area">
        <Header title="ต้นทุน" toggleSidebar={toggleSidebar} />

        <div className="truckQueus-container">
          <div className="content-wrapper"></div>
        </div>
      </div>
    </div>
  );
};

TruckQueus.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default TruckQueus;
