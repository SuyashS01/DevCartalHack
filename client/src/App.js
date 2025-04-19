// /client/src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // capital L
import Dashboard from "./pages/Dashboard";
import LiveIssuesPage from "./components/LiveIssuesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-issues" element={<LiveIssuesPage />} />
      </Routes>
    </Router>
  );
}

export default App;



// npm start