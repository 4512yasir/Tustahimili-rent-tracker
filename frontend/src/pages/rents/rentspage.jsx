import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utilis/api";
import "../../styles/rent.css";

const RentPage = () => {
  const { user } = useContext(AuthContext);
  const [rents, setRents] = useState([]);
  const [plots, setPlots] = useState([]);
  const [plotId, setPlotId] = useState("");
  const [amount, setAmount] = useState("");
  const [tenantName, setTenantName] = useState("");

  // Fetch rents and plots once user is loaded
  useEffect(() => {
    if (user && user._id) {
      fetchRents();
      fetchPlots();
    }
  }, [user]);

  // Fetch all rents
  const fetchRents = async () => {
    try {
      const res = await api.get("/rents", { headers: { 'Cache-Control': 'no-cache' } });
      console.log("Rents fetched:", res.data);
      setRents(res.data);
    } catch (err) {
      console.error("Error fetching rents:", err.response?.data || err.message);
    }
  };

  // Fetch all plots
  const fetchPlots = async () => {
    try {
      const res = await api.get("/plots", { headers: { 'Cache-Control': 'no-cache' } });
      console.log("Plots fetched:", res.data);

      // Filter plots for agent
      const filteredPlots =
        user.role === "agent"
          ? res.data.filter(
              (p) => p.assignedAgent?._id?.toString() === user._id?.toString()
            )
          : res.data;

      console.log("Filtered plots:", filteredPlots);
      setPlots(filteredPlots);
    } catch (err) {
      console.error("Error fetching plots:", err.response?.data || err.message);
    }
  };

  // Add new rent
  const addRent = async () => {
    if (user.role !== "agent") return alert("Only agents can add rent");
    if (!plotId || !amount || !tenantName) return alert("Fill all fields");

    try {
      await api.post("/rents", { plot: plotId, amount, tenantName });
      setPlotId("");
      setAmount("");
      setTenantName("");
      fetchRents();
    } catch (err) {
      console.error("Error adding rent:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add rent");
    }
  };

  // Mark rent as paid
  const markPaid = async (rentId) => {
    try {
      await api.patch(`/rents/${rentId}/mark-paid`);
      fetchRents();
    } catch (err) {
      console.error("Error marking as paid:", err.response?.data || err.message);
    }
  };

  // Delete rent
  const deleteRent = async (rentId) => {
    if (!window.confirm("Are you sure you want to delete this rent?")) return;
    try {
      await api.delete(`/rents/${rentId}`);
      fetchRents();
    } catch (err) {
      console.error("Error deleting rent:", err.response?.data || err.message);
    }
  };

  // Edit rent
  const editRent = async (rent) => {
    const newTenantName = prompt("Tenant Name:", rent.tenantName);
    const newAmount = prompt("Amount:", rent.amount);
    if (!newTenantName || !newAmount) return;

    try {
      await api.put(`/rents/${rent._id}`, {
        tenantName: newTenantName,
        amount: Number(newAmount),
      });
      fetchRents();
    } catch (err) {
      console.error("Error editing rent:", err.response?.data || err.message);
    }
  };

  return (
    <div className="rent-container">
      <h1>Rents ({user.role})</h1>

      {/* Agent can add rent */}
      {user.role === "agent" && (
        <div className="rent-form">
          <select value={plotId} onChange={(e) => setPlotId(e.target.value)}>
            <option value="">Select Plot</option>
            {plots.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.location})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tenant Name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={addRent}>Add Rent</button>
        </div>
      )}

      {/* Rent list */}
      <div className="rent-list">
        <h2>All Rents</h2>
        <div className="rent-grid">
          {rents.map((r) => {
            const canEditOrDelete =
              user.role === "committee" || r.user?._id === user._id;
            const canMarkPaid =
              r.status !== "paid" &&
              (user.role === "committee" || r.user?._id === user._id);

            return (
              <div className="rent-card" key={r._id}>
                <p>
                  <strong>📍 Plot:</strong> {r.plot?.name} ({r.plot?.location})
                </p>
                <p>
                  <strong>💰 Amount:</strong> {r.amount}
                </p>
                <p>
                  <strong>👤 Tenant:</strong> {r.tenantName}
                </p>
                <p>
                  <strong>📝 Logged by:</strong> {r.user?.name}
                </p>
                <p>
                  <strong>📅 Date:</strong>{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
                <p>
                        <strong>✅ Status:</strong>{" "}
                    <span className={`status ${r.status || "unpaid"}`}>
                 {r.status || "unpaid"}
                </span>
                     </p>


                {canMarkPaid && (
                  <button onClick={() => markPaid(r._id)}>Mark as Paid</button>
                )}
                {canEditOrDelete && (
                  <>
                    <button onClick={() => editRent(r)}>Edit</button>
                    <button onClick={() => deleteRent(r._id)}>Delete</button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RentPage;
