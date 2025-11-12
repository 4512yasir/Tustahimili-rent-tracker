import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/sidebar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Tustahimili na Lulu</h2>
      </div>
      <div className="navbar-user">
        {user && (
          <>
            <span className="navbar-user-info">{user.name} ({user.role})</span>
            <button className="navbar-logout" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
