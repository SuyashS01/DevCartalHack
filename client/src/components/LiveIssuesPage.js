import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LiveIssuesPage = () => {
  const [liveIssues, setLiveIssues] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/live-issues", { withCredentials: true })
      .then((res) => setLiveIssues(res.data.issues || []))
      .catch((err) => {
        console.error("Error fetching live issues", err.message);
        setLiveIssues([]);
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h2>🔥 Live GitHub Issues (Last 15 Minutes)</h2>
      {liveIssues.length === 0 ? (
        <p>No fresh issues found at this moment.</p>
      ) : (
        <ul>
          {liveIssues.map((issue, idx) => (
            <li key={idx} style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              <strong>{issue.title}</strong><br />
              <a href={issue.html_url} target="_blank" rel="noopener noreferrer">{issue.html_url}</a><br />
              <span>Repo: {issue.repo}</span><br />
              <small>Created: {new Date(issue.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
      <Link to="/dashboard" style={{ textDecoration: "none", color: "#007bff" }}>← Back to Dashboard</Link>
    </div>
  );
};

export default LiveIssuesPage;
