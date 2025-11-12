import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utilis/api";
import "../../styles/transaction.css";

const ExpensePage = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [plotId, setPlotId] = useState("");
  const [plots, setPlots] = useState([]);

  useEffect(() => {
    fetchExpenses();
    fetchPlots();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
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

  const addExpense = async () => {
    if (user.role !== "agent") return alert("Only agents can add expenses");
    try {
      await api.post("/expenses", { plot: plotId, amount, description });
      setAmount(""); setDescription(""); setPlotId("");
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="transaction-container">
      <h1>Expenses ({user.role})</h1>

      {user.role === "agent" && (
        <div className="transaction-form">
          <select value={plotId} onChange={e => setPlotId(e.target.value)}>
            <option value="">Select Plot</option>
            {plots.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <button onClick={addExpense}>Add Expense</button>
        </div>
      )}

      <div className="transaction-list">
        <h2>All Expenses</h2>
        <div className="transaction-grid">
          {expenses.map(e => (
            <div className="transaction-card" key={e._id}>
              <p><strong>📍 Plot:</strong> {e.plot?.name || e.plot}</p>
              <p><strong>💰 Amount:</strong> {e.amount}</p>
              <p><strong>📝 Description:</strong> {e.description}</p>
              <p><strong>👤 Logged by:</strong> {e.createdBy?.name || e.createdBy}</p>
              <p><strong>📅 Date:</strong> {new Date(e.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
