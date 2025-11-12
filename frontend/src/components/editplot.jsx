import React, { useState, useEffect } from "react";
import "../styles/plot.css";

const EditPlotModal = ({ plot, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    units: "",
    rentAmount: "",
  });

  useEffect(() => {
    if (plot) {
      setForm({
        name: plot.name,
        location: plot.location,
        units: plot.units,
        rentAmount: plot.rentAmount,
      });
    }
  }, [plot]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Plot Details</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Plot Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />
          <input
            name="units"
            placeholder="Units"
            type="number"
            value={form.units}
            onChange={handleChange}
          />
          <input
            name="rentAmount"
            placeholder="Rent Amount"
            type="number"
            value={form.rentAmount}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit" className="assign-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlotModal;
