import React from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from "./pages/LandingPage";
import DayPage from "./pages/DayPage";
import StagePage from "./pages/StagePage";
import Credits from "./pages/Credits";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage showMenu={true} />} />
        <Route path="/day/:dayId" element={<DayPage />} />
        <Route path="/stage/:stageId" element={<StagePage />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/acknowledgements" element={<Credits />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;

