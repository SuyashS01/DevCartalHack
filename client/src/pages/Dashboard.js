import { useEffect, useState } from "react";
import axios from "axios";
import GitHubGraph from "../components/GitHubGraph";
import RecentCommits from "../components/RecentCommits";
import ProfilePage from "./ProfilePage";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState("");
  const [uquery, setUquery] = useState("");
  const [issues, setIssues] = useState([]);
  const [issues2, setIssues2] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [languageMatchedIssues, setLanguageMatchedIssues] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/user-languages", { withCredentials: true })
      .then(res => setLanguages(res.data))
      .catch(err => console.error("Failed to load languages", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/auth/user", { withCredentials: true })
      .then((res) => setUser(res.data.profile))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/api/repos", { withCredentials: true })
      .then((res) => setRepos(res.data))
      .catch(() => setRepos([]));
  }, []);

  useEffect(() => {
    if (languages.length === 0) return;
  
    console.log("Sending languages to backend:", languages); // Log before POST
  
    axios
      .post("http://localhost:5001/api/match-issues", { languages })
      .then((res) => {
        console.log("Matched issues:", res.data); // Log response
        setLanguageMatchedIssues(res.data.matched_issues || []);
      })
      .catch((err) => {
        console.error("Language-based issue fetch failed:", err.message);
        setLanguageMatchedIssues([]);
      });
  }, [languages]); 


  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/auth/logout", { withCredentials: true });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  useEffect(() => {
    if (!selectedLang) return;

    axios.get(`http://localhost:4000/api/issues?language=${selectedLang}`, { withCredentials: true })
      .then((res) => setIssues(res.data))
      .catch(() => setIssues([]));
  }, [selectedLang]);

  useEffect(() => {
    fetchTopIssues();
  }, []);

  const fetchMatchedIssues = async () => {
    try {
      setLoadingIssues(true);
      const res = await axios.post("http://localhost:4000/api/match", { skills }, { withCredentials: true });
      setIssues(res.data);
    } catch (err) {
      console.error("Issue fetch error:", err.message);
      setIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchMatchedIssuesAiV = async () => {
    try {
      setLoadingIssues(true);
      const res = await axios.post("http://localhost:4000/api/matchAiV", { skills }, { withCredentials: true });
      setIssues(res.data);
    } catch (err) {
      console.error("Issue fetch error:", err.message);
      setIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchTopIssues = async () => {
    try {
      setLoadingIssues(true);
      const res = await axios.get("http://localhost:4000/api/issues", { withCredentials: true });
      setIssues(res.data);
    } catch (err) {
      console.error("Top issues fetch error:", err.message);
      setIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchAIQueryIssues = async () => {
    try {
      setLoadingIssues(true);
      const res = await axios.post("http://localhost:5001/query_issues", {
        query: uquery
      });
      setIssues2(res.data.matched_issues || []); // ✅ Corrected line
    } catch (err) {
      console.error("AI query issue fetch error:", err.message);
      setIssues2([]);
    } finally {
      setLoadingIssues(false);
    }
  };  

  if (!user) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src={user.photos?.[0]?.value}
          alt="avatar"
          width="80"
          style={{ borderRadius: "50%" }}
        />
        <h2 style={{ margin: 0 }}>Welcome, {user.username || user.displayName}</h2>
        <div>
          <ProfilePage />
          <button onClick={handleLogout} style={{
            marginTop: "10px",
            padding: "6px 12px",
            borderRadius: "6px",
            background: "#d9534f",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Pick a Language to Get Matching Issues:</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
          {languages.map((lang, i) => (
            <button
              key={i}
              onClick={() => setSelectedLang(lang)}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                background: selectedLang === lang ? "#007bff" : "#f9f9f9",
                color: selectedLang === lang ? "white" : "#333",
                cursor: "pointer"
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
  <h4>Search Open Source Issues by AI Query</h4>
  <input
    type="text"
    value={uquery}
    onChange={(e) => setUquery(e.target.value)}
    placeholder="e.g., I want to contribute to blockchain projects"
    style={{
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    }}
  />
  <button
    onClick={fetchAIQueryIssues}
    style={{
      padding: "8px 16px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    Search AI-Matched Issues
  </button>
</div>

{loadingIssues ? (
  <p>Loading issues...</p>
) : issues2.length > 0 ? (
  <div style={{ marginTop: "20px" }}>
    <h4>Matching Issues:</h4>
    {issues2.map((issue, idx) => (
      <div key={idx} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>
        <a href={issue.issue_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", fontSize: "16px", color: "#0366d6" }}>
          {issue.title}
        </a>
        <p>{issue.body?.slice(0, 150)}...</p>
        <p style={{ fontSize: "14px", color: "#888" }}>Repo: <a href={issue.repository_url} target="_blank">{issue.repository_url}</a></p>
        <p>Status: {issue.state} | Comments: {issue.comments}</p>
      </div>
    ))}
  </div>
) : (
  <p>No matching issues found.</p>
)}


      <div style={{ marginTop: "20px" }}>
        <h4>✅ Your Known Languages:</h4>
        {languages.length === 0 ? (
          <p>Loading or no languages found.</p>
        ) : (
          <p>{languages.join(", ")}</p>
        )}
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>🧠 Smart Matches from Your Languages</h3>
        {languageMatchedIssues.length === 0 ? (
          <p>No matches found based on your known languages.</p>
        ) : (
          <ul>
            {languageMatchedIssues.map((issue, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px"
                }}
              >
                <strong>{issue.title}</strong><br />
                <a href={issue.issue_url} target="_blank" rel="noopener noreferrer">
                  {issue.issue_url}
                </a><br />
                <span>Languages: {issue.repo_languages.join(", ")}</span><br />
                <span>Score: {issue.score}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3 style={{ marginTop: "40px" }}>🕒 Recent Commits</h3>
      <RecentCommits />

      <h3 style={{ marginTop: "40px" }}>Your GitHub Contributions</h3>
      <GitHubGraph username={user.username} />

      <div style={{ marginTop: "30px" }}>
        <h3>Your Skills</h3>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. JavaScript, React, Node"
          style={{
            padding: "8px",
            width: "100%",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button onClick={fetchMatchedIssuesAiV} style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "6px",
          background: "#0118d6",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}>
          Find VertexAi Matching Issues
        </button>

        <button onClick={fetchMatchedIssues} style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "6px",
          background: "#0275d8",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}>
          Find Matching Issues
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Top Matching GitHub Issues</h3>
        {loadingIssues ? (
          <p>Loading issues...</p>
        ) : issues.length === 0 ? (
          <p>No issues found yet. Enter skills and hit the button!</p>
        ) : (
          <ul>
            {issues.map((issue, idx) => (
              <li key={idx} style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                <strong>{issue.title}</strong><br />
                <a href={issue.url} target="_blank" rel="noopener noreferrer">{issue.url}</a><br />
                {issue.repository && (
                  <span>Repo: {issue.repository.nameWithOwner}</span>
                )}<br />
                <small>
                  Labels: {(issue.labels?.nodes || []).map(l => l.name).join(", ")}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 style={{ marginTop: "40px" }}>Top Repositories</h3>
        <ul>
          {repos.map((repo, idx) => (
            <li key={idx} style={{ marginBottom: "15px" }}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <strong>{repo.name}</strong>
              </a>
              <p>{repo.description}</p>
              <span>⭐ {repo.stargazers_count} | {repo.language}</span><br />
              <small>Updated: {new Date(repo.updated_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "40px" }}>
          <h3>🔥 Explore Live GitHub Issues</h3>
          <a href="/live-issues" style={{
            display: "inline-block",
            marginTop: "10px",
            background: "#ff6600",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            View Issues Posted in Last 15 Minutes →
          </a>
        </div>


        <a
          href={`https://github.com/${user.username || user.login}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "10px",
            background: "#24292e",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none"
          }}
        >
          Go to GitHub Dashboard
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
