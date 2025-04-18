import { useEffect, useState } from "react";

const GitHubGraph = ({ username }) => {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    if (!username) return;

    fetch(`https://github.com/users/${username}/contributions`)
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const svgElement = doc.querySelector("svg.js-calendar-graph-svg");
        if (svgElement) {
          setSvg(svgElement.outerHTML);
        } else {
          setSvg("<p>Unable to load contribution graph.</p>");
        }
      })
      .catch((err) => {
        console.error("Error fetching contributions:", err);
        setSvg("<p>Error loading graph</p>");
      });
  }, [username]);

  return (
    <div style={{ marginTop: "10px" }}>
      <div
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
      <img
        src={`https://ghchart.rshah.org/${username}`}
        alt={`GitHub contributions for ${username}`}
        style={{
          maxWidth: "100%",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
      <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
        Contributions in the last year for <strong>{username}</strong>
      </div>
    </div>
    </div>
  );
};

export default GitHubGraph;
