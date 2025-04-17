import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Admin Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customer";
import Suppliers from "./pages/Suppliers/Supplier";
// import TruckQueues from "./pages/TruckQueues/TruckQueues";
// import Drivers from "./pages/Drivers/Drivers";
import Costs from "./pages/Cost/Costs";
// import Finance from "./pages/Finance/Finance";
// import Reports from "./pages/Reports/Reports";

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <BrowserRouter>
      <div
        className={`app-container ${
          sidebarVisible ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <Dashboard
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/admin/customers"
            element={
              <Customers
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/admin/suppliers"
            element={
              <Suppliers
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          {/* <Route
            path="/admin/truck-queues"
            element={
              <TruckQueues
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <Drivers
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />*/}
          <Route
            path="/admin/costs"
            element={
              <Costs
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          {/* <Route
            path="/admin/finance"
            element={
              <Finance
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/admin/reports"
            element={
              <Reports
                sidebarVisible={sidebarVisible}
                toggleSidebar={toggleSidebar}
              />
            }
          />  */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
