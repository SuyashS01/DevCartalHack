import { useEffect, useState } from "react";

const RecentCommits = () => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/recent-commits", {
      credentials: "include", // 🔐 include cookies for session-based auth
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch commits");
        return res.json();
      })
      .then((data) => setCommits(data))
      .catch((err) => {
        console.error("Error fetching recent commits:", err);
        setCommits([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      {loading ? (
        <p>Loading recent commits...</p>
      ) : commits.length === 0 ? (
        <p>No recent commits found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {commits.map((commit, idx) => (
            <li key={idx} style={{ marginBottom: "12px" }}>
              <strong>{commit.repoName}</strong>:&nbsp;
              <a href={commit.url} target="_blank" rel="noreferrer">
                {commit.message}
              </a>
              <div style={{ fontSize: "12px", color: "#555" }}>
                {commit.author} &middot;{" "}
                {new Date(commit.date).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentCommits;
