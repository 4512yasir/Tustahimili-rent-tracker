import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
   <div className="sidebar">
  <h3 className="sidebar-title">Menu</h3>
  <ul className="sidebar-list">
    <li><Link to="/dashboard">Dashboard</Link></li>
    <li><Link to="/plots">Plots</Link></li>
    <li><Link to="/rents">Rents</Link></li>
    <li><Link to="/repairs">Repairs</Link></li>
    <li><Link to="/expenses">Expenses</Link></li>
    {user?.role === "committee" && (
      <li><Link to="/assign-plots">Assign Plots</Link></li>
    )}
  </ul>
</div>

  );
};

export default Sidebar;
