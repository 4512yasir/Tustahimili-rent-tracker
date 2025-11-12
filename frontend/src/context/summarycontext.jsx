// src/context/SummaryContext.js
import React, { createContext, useState, useCallback, useContext } from "react";
import api from "../utilis/api";
import { AuthContext } from "./AuthContext";

export const SummaryContext = createContext();

export const SummaryProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({
    totalPlots: 0,
    rentsCollected: 0,
    pendingRents: 0,
    repairsLogged: 0,
    expenses: 0,
  });

  // Wrap fetchSummary in useCallback so it’s stable for useEffect dependencies
  const fetchSummary = useCallback(async () => {
    try {
      const [plotsRes, rentsRes, repairsRes, expensesRes] = await Promise.all([
        api.get("/plots"),
        api.get("/rents"),
        api.get("/repairs"),
        api.get("/expenses"),
      ]);

      const allPlots = plotsRes.data;
      const allRents = rentsRes.data;
      const allRepairs = repairsRes.data;
      const allExpenses = expensesRes.data;

      const filteredRents =
        user.role === "agent"
          ? allRents.filter((r) => r.createdBy?._id === user._id)
          : allRents;

      setSummary({
        totalPlots: allPlots.length,
        rentsCollected: filteredRents.reduce((sum, r) => sum + Number(r.amount), 0),
        pendingRents: filteredRents.filter((r) => !r.paid).length,
        repairsLogged: allRepairs.length,
        expenses: allExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
      });
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  return (
    <SummaryContext.Provider value={{ summary, fetchSummary }}>
      {children}
    </SummaryContext.Provider>
  );
};
