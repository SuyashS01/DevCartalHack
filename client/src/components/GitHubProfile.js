// src/components/GitHubProfile.jsx
import React from "react";

const GitHubProfile = ({ data }) => {
  if (!data) return null;

  const { profile, stats, recentRepos } = data;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👤 GitHub Profile Overview</h2>

      <div className="mb-6">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Username:</strong> {profile.login}</p>
        <p><strong>Email:</strong> {profile.email || "N/A"}</p>
        <p><strong>Followers:</strong> {profile.followers}</p>
        <p><strong>Following:</strong> {profile.following}</p>
        <p><strong>Public Repos:</strong> {profile.public_repos}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">📈 Stats</h3>
      <ul className="list-disc ml-6 mb-6">
        <li>Total Contributions (last year): {stats.contributionsThisYear}</li>
        <li>Open Pull Requests: {stats.openPullRequests}</li>
        <li>Issues Contributed: {stats.contributedIssues}</li>
        <li>Top Repositories (based on stars):</li>
        <ul className="ml-4">
          {stats.topRepos.map((repo) => (
            <li key={repo.nameWithOwner}>
              <a href={repo.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {repo.nameWithOwner}
              </a> ⭐ {repo.stargazerCount}
            </li>
          ))}
        </ul>
      </ul>

      <h3 className="text-xl font-semibold mb-2">📌 Recently Updated Repos</h3>
      <ul className="space-y-2">
        {recentRepos.map((repo) => (
          <li key={repo.full_name} className="border p-3 rounded-md shadow-sm">
            <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-blue-600 font-medium">
              {repo.full_name}
            </a>
            <p>{repo.description || "No description"}</p>
            <p className="text-sm text-gray-500">
              ⭐ {repo.stargazers_count} | {repo.language || "Unknown"} | Updated: {new Date(repo.updated_at).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GitHubProfile;
