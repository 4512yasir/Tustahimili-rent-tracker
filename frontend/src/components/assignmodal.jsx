import React, { useState } from "react";
import "../styles/plot.css"; // reuse modal styles

const AssignModal = ({ agents, onAssign, onClose }) => {
  const [selectedAgent, setSelectedAgent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgent) return alert("Please select an agent");
    onAssign(selectedAgent);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Assign Plot to Agent</h3>
        <form onSubmit={handleSubmit}>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            <option value="">-- Select Agent --</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
          <div className="modal-buttons">
            <button type="submit" className="assign-btn">Assign</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignModal;
