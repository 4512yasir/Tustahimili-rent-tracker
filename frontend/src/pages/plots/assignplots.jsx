// src/pages/plots/AssignPlots.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utilis/api";
import "../../styles/plot.css";

const AssignPlots = () => {
  const { user } = useContext(AuthContext);
  const [plots, setPlots] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");

  // Fetch plots and agents on mount
  useEffect(() => {
    if (user.role !== "committee") return;
    fetchPlots();
    fetchAgents();
  }, [user]);

  // Fetch all plots
  const fetchPlots = async () => {
    try {
      const res = await api.get("/plots");
      setPlots(res.data);
    } catch (err) {
      console.error("Error fetching plots:", err);
    }
  };

  // Fetch all agents
  const fetchAgents = async () => {
    try {
      const res = await api.get("/users"); // correct route
      setAgents(res.data.filter(a => a.role === "agent"));
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  // Assign selected agent to selected plot
  const assignPlot = async () => {
    if (!selectedPlot || !selectedAgent) return alert("Select both plot and agent");
    try {
      await api.patch(`/plots/${selectedPlot}/assign`, { agentId: selectedAgent });
      alert("Plot assigned successfully");
      setSelectedPlot("");
      setSelectedAgent("");
      fetchPlots(); // refresh the list
    } catch (err) {
      console.error("Error assigning plot:", err);
      alert("Failed to assign plot");
    }
  };

  if (user.role !== "committee") return <p>Only committee members can assign plots.</p>;

  return (
    <div className="assign-container">
      <h1>Assign Plots to Agents</h1>

      <div className="assign-form">
        <select value={selectedPlot} onChange={e => setSelectedPlot(e.target.value)}>
          <option value="">Select Plot</option>
          {plots.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} - Assigned: {p.assignedAgent?.name || "None"}
            </option>
          ))}
        </select>

        <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
          <option value="">Select Agent</option>
          {agents.map(a => (
            <option key={a._id} value={a._id}>{a.name}</option>
          ))}
        </select>

        <button onClick={assignPlot}>Assign</button>
      </div>

      <h2>All Plots</h2>
      <div className="assign-plot-grid">
        {plots.map(p => (
          <div className="assign-plot-card" key={p._id}>
            <p><strong>📌 Name:</strong> {p.name}</p>
            <p><strong>📍 Location:</strong> {p.location}</p>
            <p><strong>👤 Assigned Agent:</strong> {p.assignedAgent?.name || "None"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignPlots;
