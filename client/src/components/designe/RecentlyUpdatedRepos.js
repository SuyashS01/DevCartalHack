import React, { useState } from "react";

const RecentlyUpdatedRepos = ({ recentRepos }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show either 4 or all repos based on the expansion state
  const reposToShow = isExpanded ? recentRepos : recentRepos.slice(0, 2);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">📌 Recently Updated Repos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reposToShow.map((repo) => (
          <div key={repo.full_name} className="border p-4 rounded-lg shadow-md">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {repo.full_name}
            </a>
            <p>{repo.description || "No description"}</p>
            <p className="text-sm text-gray-500">
              ⭐ {repo.stargazers_count} | {repo.language || "Unknown"} | Updated: {new Date(repo.updated_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Toggle button for expanding or collapsing */}
      {recentRepos.length > 2 && (
        <div className="mt-4 text-center">
          <button
            onClick={toggleExpand}
            className="text-blue-500 font-medium flex items-center justify-center"
          >
            <span>{isExpanded ? "▲" : "▼"}</span> {isExpanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentlyUpdatedRepos;
