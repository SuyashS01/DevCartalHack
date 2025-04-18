import { useEffect, useState } from "react";
import axios from "axios";
import GitHubGraph from "../components/GitHubGraph";
import RecentCommits from "../components/RecentCommits";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState("");
  const [issues, setIssues] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);

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
        <div>
          <h2 style={{ margin: 0 }}>Welcome, {user.username || user.displayName}</h2>
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


      <h3 style={{ marginTop: "40px" }}>Your Recent Commits</h3>
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


// import { useEffect, useState } from "react";
// import axios from "axios";
// import GitHubGraph from "../components/GitHubGraph";
// import RecentCommits from "../components/RecentCommits";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [skills, setSkills] = useState("");
//   const [issues, setIssues] = useState([]);
//   const [repos, setRepos] = useState([]);
//   const [loadingIssues, setLoadingIssues] = useState(false);
//   // const [languages, setLanguages] = useState([]);
//   const [selectedLang, setSelectedLang] = useState(null);

// // add temporary languages
// const tempLanguages = [
// "JavaScript", "Python", "Java", "C++", "Ruby", "Go", "PHP", "Swift"];


//   // useEffect(() => {
//   //   axios.get("http://localhost:4000/api/user-languages", { withCredentials: true })
//   //     .then(res => setLanguages(res.data))
//   //     .catch(err => console.error("Failed to load languages", err));
//   // }, []);

//   useEffect(() => {
//     axios.get("http://localhost:4000/auth/user", { withCredentials: true })
//       .then((res) => setUser(res.data.profile))
//       .catch(() => setUser(null));
//   }, []);

//   useEffect(() => {
//     axios.get("http://localhost:4000/api/repos", { withCredentials: true })
//       .then((res) => setRepos(res.data))
//       .catch(() => setRepos([]));
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.get("http://localhost:4000/auth/logout", { withCredentials: true });
//       setUser(null);
//       window.location.href = "/";
//     } catch (err) {
//       console.error("Logout error:", err.message);
//     }
//   };

//   useEffect(() => {
//     if (!selectedLang) return;
  
//     axios.get(`http://localhost:4000/api/issues?language=${selectedLang}`, { withCredentials: true })
//       .then((res) => setIssues(res.data))
//       .catch(() => setIssues([]));
//   }, [selectedLang]);
  

//   const fetchMatchedIssues = async () => {
//     try {
//       setLoadingIssues(true);
//       const res = await axios.post("http://localhost:4000/api/match", { skills }, { withCredentials: true });
//       setIssues(res.data);
//     } catch (err) {
//       console.error("Issue fetch error:", err.message);
//       setIssues([]);
//     } finally {
//       setLoadingIssues(false);
//     }
//   };

//   if (!user) return <h2>Loading...</h2>;

//   return (
//     <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px", margin: "auto" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
//         <img
//           src={user.photos?.[0]?.value}
//           alt="avatar"
//           width="80"
//           style={{ borderRadius: "50%" }}
//         />
//         <div>
//           <h2 style={{ margin: 0 }}>Welcome, {user.username || user.displayName}</h2>
//           <button onClick={handleLogout} style={{
//             marginTop: "10px",
//             padding: "6px 12px",
//             borderRadius: "6px",
//             background: "#d9534f",
//             color: "white",
//             border: "none",
//             cursor: "pointer"
//           }}>
//             Logout
//           </button>
//         </div>
//       </div>

//       <div style={{ marginTop: "20px" }}>
//         <h4>Pick a Language to Get Matching Issues:</h4>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
//           {tempLanguages.map((lang, i) => (
//             <button
//               key={i}
//               onClick={() => setSelectedLang(lang)}
//               style={{
//                 padding: "6px 12px",
//                 borderRadius: "20px",
//                 border: "1px solid #ccc",
//                 background: selectedLang === lang ? "#007bff" : "#f9f9f9",
//                 color: selectedLang === lang ? "white" : "#333",
//                 cursor: "pointer"
//               }}
//             >
//               {lang}
//             </button>
//           ))}
//         </div>
//       </div>


//       <h3 style={{ marginTop: "40px" }}>Your Recent Commits</h3>
//       <RecentCommits />

//       <h3 style={{ marginTop: "40px" }}>Your GitHub Contributions</h3>
//       <GitHubGraph username={user.username} />

//       <div style={{ marginTop: "30px" }}>
//         <h3>Your Skills</h3>
//         <input
//           type="text"
//           value={skills}
//           onChange={(e) => setSkills(e.target.value)}
//           placeholder="e.g. JavaScript, React, Node"
//           style={{
//             padding: "8px",
//             width: "100%",
//             borderRadius: "6px",
//             border: "1px solid #ccc"
//           }}
//         />
//         <button onClick={fetchMatchedIssues} style={{
//           marginTop: "10px",
//           padding: "10px 20px",
//           borderRadius: "6px",
//           background: "#0275d8",
//           color: "white",
//           border: "none",
//           cursor: "pointer"
//         }}>
//           Find Matching Issues
//         </button>
//       </div>

//       <div style={{ marginTop: "40px" }}>
//         <h3>Top Matching GitHub Issues</h3>
//         {loadingIssues ? (
//           <p>Loading issues...</p>
//         ) : issues.length === 0 ? (
//           <p>No issues found yet. Enter skills and hit the button!</p>
//         ) : (
//           <ul>
//             {issues.map((issue, idx) => (
//               <li key={idx} style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
//                 <strong>{issue.title}</strong><br />
//                 <a href={issue.url} target="_blank" rel="noopener noreferrer">{issue.url}</a><br />
//                 {issue.repository && (
//                   <span>Repo: {issue.repository.nameWithOwner}</span>
//                 )}<br />
//                 <small>
//                   Labels: {(issue.labels?.nodes || []).map(l => l.name).join(", ")}
//                 </small>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <div>
//         <h3 style={{ marginTop: "40px" }}>Top Repositories</h3>
//         <ul>
//           {repos.map((repo, idx) => (
//             <li key={idx} style={{ marginBottom: "15px" }}>
//               <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
//                 <strong>{repo.name}</strong>
//               </a>
//               <p>{repo.description}</p>
//               <span>⭐ {repo.stargazers_count} | {repo.language}</span><br />
//               <small>Updated: {new Date(repo.updated_at).toLocaleString()}</small>
//             </li>
//           ))}
//         </ul>


//         <a
//           href={`https://github.com/${user.username || user.login}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{
//             display: "inline-block",
//             marginTop: "10px",
//             background: "#24292e",
//             color: "#fff",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             textDecoration: "none"
//           }}
//         >
//           Go to GitHub Dashboard
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
