import { useEffect, useState } from "react";

const RecentCommits = () => {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    fetch("/api/recent-commits") ///github
      .then((res) => res.json())
      .then((data) => setCommits(data))
      .catch((err) => console.error("Error fetching recent commits:", err));
  }, []);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>🕒 Recent Commits</h3>
      {commits.length === 0 ? (
        <p>Loading recent commits...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {commits.map((commit, idx) => (
            <li key={idx} style={{ marginBottom: "12px" }}>
              <strong>{commit.repoName}</strong>:&nbsp;
              <a href={commit.url} target="_blank" rel="noreferrer">
                {commit.message}
              </a>
              <div style={{ fontSize: "12px", color: "#555" }}>
                {commit.author} &middot; {new Date(commit.date).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentCommits;
