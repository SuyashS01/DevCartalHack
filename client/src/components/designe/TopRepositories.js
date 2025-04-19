import React from "react";

const TopRepositories = ({ topRepos }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">🌟 Top Repositories (based on stars)</h3>
      <ul className="ml-4">
        {topRepos.map((repo) => (
          <li key={repo.nameWithOwner}>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {repo.nameWithOwner}
            </a> ⭐ {repo.stargazerCount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopRepositories;
