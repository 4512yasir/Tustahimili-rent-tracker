import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utilis/api";
import "../../styles/transaction.css";

const RepairPage = () => {
  const { user } = useContext(AuthContext);
  const [repairs, setRepairs] = useState([]);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [plotId, setPlotId] = useState("");
  const [plots, setPlots] = useState([]);

  useEffect(() => {
    fetchRepairs();
    fetchPlots();
  }, []);

  const fetchRepairs = async () => {
    try {
      const res = await api.get("/repairs");
      setRepairs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlots = async () => {
    try {
      const res = await api.get("/plots");
      setPlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addRepair = async () => {
    if (user.role !== "agent") return alert("Only agents can log repairs");
    try {
      await api.post("/repairs", { plot: plotId, description, cost });
      setDescription(""); setCost(""); setPlotId("");
      fetchRepairs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="transaction-container">
      <h1>Repairs ({user.role})</h1>

      {user.role === "agent" && (
        <div className="transaction-form">
          <select value={plotId} onChange={e => setPlotId(e.target.value)}>
            <option value="">Select Plot</option>
            {plots.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <input type="number" placeholder="Cost" value={cost} onChange={e => setCost(e.target.value)} />
          <button onClick={addRepair}>Log Repair</button>
        </div>
      )}

      <div className="transaction-list">
        <h2>All Repairs</h2>
        <div className="transaction-grid">
          {repairs.map(r => (
            <div className="transaction-card" key={r._id}>
              <p><strong>📍 Plot:</strong> {r.plot?.name || r.plot}</p>
              <p><strong>📝 Description:</strong> {r.description}</p>
              <p><strong>💰 Cost:</strong> {r.cost}</p>
              <p><strong>👤 Logged by:</strong> {r.createdBy?.name || r.createdBy}</p>
              <p><strong>Status:</strong> {r.completed ? "Completed" : "Pending"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepairPage;
