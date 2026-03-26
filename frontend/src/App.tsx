import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import ToastHost from "./components/ToastHost";

import Home from "./pages/Home";
import AskQuery from "./pages/AskQuery";
import MyQueries from "./pages/MyQueries";
import QueryDetail from "./pages/QueryDetail";
import Advisory from "./pages/Advisory";
import DiseaseDetect from "./pages/DiseaseDetect";
import AdvisoryDetail from "./pages/AdvisoryDetail";
import DetectionHistory from "./pages/DetectionHistory";  // ⭐ NEW IMPORT

import { FarmProvider } from "./state/FarmContext";

export default function App() {
  return (
    <FarmProvider>
      {/* ✅ this class must match your index.css background layer */}
      <div className="appBg appShell">
        <Header />

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<DiseaseDetect />} />

            {/* ⭐ NEW ROUTE */}
            <Route path="/history" element={<DetectionHistory />} />

            <Route path="/ask" element={<AskQuery />} />
            <Route path="/queries" element={<MyQueries />} />
            <Route path="/queries/:id" element={<QueryDetail />} />

            <Route path="/advisory" element={<Advisory />} />
            <Route path="/advisory/:id" element={<AdvisoryDetail />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <ToastHost />
        <BottomNav />
      </div>
    </FarmProvider>
  );
}
