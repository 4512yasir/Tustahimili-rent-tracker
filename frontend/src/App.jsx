import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SummaryProvider } from "./context/summarycontext"; // <--- import summary provider
import LandingPage from "./pages/landingpage";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import PlotList from "./pages/plots/plotlist";
import AssignPlots from "./pages/plots/assignplots";
import RentPage from "./pages/rents/rentspage";
import RepairPage from "./pages/repairs/repairspage";
import ExpensePage from "./pages/expenses/expensespage";

function App() {
  return (
    <AuthProvider>
      <SummaryProvider> {/* wrap app so dashboard summary is live */}
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plots" element={<Dashboard><PlotList /></Dashboard>} />
            <Route path="/assign-plots" element={<Dashboard><AssignPlots /></Dashboard>} />
            <Route path="/rents" element={<Dashboard><RentPage /></Dashboard>} />
            <Route path="/repairs" element={<Dashboard><RepairPage /></Dashboard>} />
            <Route path="/expenses" element={<Dashboard><ExpensePage /></Dashboard>} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </Router>
      </SummaryProvider>
    </AuthProvider>
  );
}

export default App;
