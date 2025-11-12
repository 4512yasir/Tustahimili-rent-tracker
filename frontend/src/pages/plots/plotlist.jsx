import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utilis/api";
import "../../styles/plot.css";
import AssignModal from "../../components/assignmodal";
import EditPlotModal from "../../components/editplot";

const PlotList = () => {
  const { user } = useContext(AuthContext);
  const [plots, setPlots] = useState([]);
  const [agents, setAgents] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [units, setUnits] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch plots and agents on mount
  useEffect(() => {
    fetchPlots();
    fetchAgents();
  }, []);

  // Fetch all plots
  const fetchPlots = async () => {
    try {
      const res = await api.get("/plots");
      setPlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all agents (for assigning)
  const fetchAgents = async () => {
    try {
      const res = await api.get("/auth/users");
      setAgents(res.data.filter(u => u.role === "agent"));
    } catch (err) {
      console.error(err);
    }
  };

  // Add a new plot (committee only)
  const addPlot = async () => {
    if (user.role !== "committee") return alert("Only committee can add plots");
    try {
      await api.post("/plots", { name, location, units, rentAmount });
      setName(""); setLocation(""); setUnits(""); setRentAmount("");
      fetchPlots();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete plot (committee only)
  const deletePlot = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plot?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/plots/${id}`);
      fetchPlots();
    } catch (err) {
      console.error(err);
    }
    setDeletingId(null);
  };

  // Open modals
  const openAssignModal = (plot) => {
    setSelectedPlot(plot);
    setIsAssignModalOpen(true);
  };

  const openEditModal = (plot) => {
    setSelectedPlot(plot);
    setIsEditModalOpen(true);
  };

  // Assign plot to agent
  const assignPlot = async (agentId) => {
    try {
      await api.post(`/plots/${selectedPlot._id}/assign`, { agentId });
      setIsAssignModalOpen(false);
      fetchPlots();
    } catch (err) {
      console.error(err);
    }
  };

  // Update plot details
  const updatePlot = async (updatedData) => {
    try {
      await api.put(`/plots/${selectedPlot._id}`, updatedData);
      setIsEditModalOpen(false);
      fetchPlots();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="plot-container">
      <h1>Plots ({user.role})</h1>

      {/* Add new plot form for committee */}
      {user.role === "committee" && (
        <div className="plot-form">
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
          <input placeholder="Units" value={units} onChange={e => setUnits(e.target.value)} />
          <input placeholder="Rent Amount" value={rentAmount} onChange={e => setRentAmount(e.target.value)} />
          <button onClick={addPlot}>Add Plot</button>
        </div>
      )}

      <div className="plot-list">
        <h2>All Plots</h2>
        <div className="plot-grid">
          {plots.map(p => (
            <div className="plot-card" key={p._id}>
              <h3>{p.name}</h3>
              <p><strong>📍 Location:</strong> {p.location}</p>
              <p><strong>🏘 Units:</strong> {p.units}</p>
              <p><strong>💰 Rent:</strong> {p.rentAmount}</p>
              <p><strong>👤 Assigned:</strong> {p.assignedAgent?.name || "Unassigned"}</p>

              {user.role === "committee" && (
                <div className="plot-actions">
                  <button className="edit-btn" onClick={() => openEditModal(p)}>Edit</button>
                  <button className="assign-btn" onClick={() => openAssignModal(p)}>Assign</button>
                  <button
                    className="delete-btn"
                    onClick={() => deletePlot(p._id)}
                    disabled={deletingId === p._id}
                  >
                    {deletingId === p._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isAssignModalOpen && (
        <AssignModal
          agents={agents}
          onAssign={assignPlot}
          onClose={() => setIsAssignModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <EditPlotModal
          plot={selectedPlot}
          onSave={updatePlot}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PlotList;
