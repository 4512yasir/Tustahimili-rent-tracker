import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { SummaryContext } from "../context/summarycontext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import { FaHome, FaMoneyBillWave, FaClock, FaTools, FaDollarSign } from "react-icons/fa";

const Dashboard = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { summary, fetchSummary } = useContext(SummaryContext);

  useEffect(() => {
    fetchSummary();
    // Optionally refresh every 30 seconds:
    // const interval = setInterval(fetchSummary, 30000);
    // return () => clearInterval(interval);
  }, [fetchSummary]);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-content">
          {!children && (
            <>
              <h1>Welcome, {user.name}</h1>
              <p>Your role: <strong>{user.role}</strong></p>

              <div className="dashboard-summary">
                <div className="summary-card">
                  <FaHome size={28} color="#007bff" />
                  <h3>Total Plots</h3>
                  <p>{summary.totalPlots}</p>
                </div>
                <div className="summary-card">
                  <FaMoneyBillWave size={28} color="#28a745" />
                  <h3>Rents Collected</h3>
                  <p>{summary.rentsCollected}</p>
                </div>
                <div className="summary-card">
                  <FaClock size={28} color="#ffc107" />
                  <h3>Pending Rents</h3>
                  <p>{summary.pendingRents}</p>
                </div>
                <div className="summary-card">
                  <FaTools size={28} color="#17a2b8" />
                  <h3>Repairs Logged</h3>
                  <p>{summary.repairsLogged}</p>
                </div>
                <div className="summary-card">
                  <FaDollarSign size={28} color="#dc3545" />
                  <h3>Total Expenses</h3>
                  <p>{summary.expenses}</p>
                </div>
              </div>

              {user.role === "agent" && (
                <p>You can add rents, repairs, and expenses for assigned plots.</p>
              )}
              {user.role === "committee" && (
                <p>You can monitor all plots, rents, repairs, expenses, and assign plots to agents.</p>
              )}
            </>
          )}
          {children && children}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
