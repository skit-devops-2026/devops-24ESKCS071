import React from "react";
import { Routes, Route } from 'react-router';
import Builder from "./Pages/Builder";
import LandingPage from "./Pages/LandingPage";
import Templates from "./Pages/Templates";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Pricing from "./Pages/Pricing";
import NotFound from "./Pages/NotFound";
import PortfolioView from "./Pages/PortfolioView";
import InterviewPrep from "./Pages/InterviewPrep";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/portfolio/:id" element={<PortfolioView />} />
      <Route path="/interview" element={<InterviewPrep />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
