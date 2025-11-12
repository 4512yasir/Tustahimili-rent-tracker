import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          background: "linear-gradient(to right, #2E8B57, #3CB371)",
          color: "#fff",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
          Tustahimili na Lulu Rent Tracker
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px", marginBottom: "30px" }}>
          Manage plots, rents, repairs, and expenses efficiently. Agents log payments and expenses, 
          while the committee monitors all activities with transparency.
        </p>
        <div>
          <Link
            to="/login"
            style={{
              padding: "12px 30px",
              margin: "10px",
              backgroundColor: "#fff",
              color: "#2E8B57",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              padding: "12px 30px",
              margin: "10px",
              backgroundColor: "#fff",
              color: "#2E8B57",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "20px",
          padding: "40px 20px",
          backgroundColor: "#f9f9f9",
          flexWrap: "wrap",
        }}
      >
        {/* Agent Card */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            flex: "1 1 300px",
            textAlign: "center",
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/80/2E8B57/money.png"
            alt="Agent"
            style={{ marginBottom: "15px" }}
          />
          <h2>Agent</h2>
          <p>Log rent payments, record repairs, and track expenses for assigned plots.</p>
        </div>

        {/* Committee Card */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            flex: "1 1 300px",
            textAlign: "center",
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/80/2E8B57/administrator-male.png"
            alt="Committee"
            style={{ marginBottom: "15px" }}
          />
          <h2>Committee</h2>
          <p>Monitor all plots, rents, repairs, and expenses with full transparency. Assign plots to agents.</p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#2E8B57",
          color: "#fff",
        }}
      >
        &copy; 2025 Tustahimili na Lulu Organization
      </footer>
    </div>
  );
};

export default LandingPage;
