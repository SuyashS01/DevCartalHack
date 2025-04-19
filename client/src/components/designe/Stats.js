import React from "react";

const Stats = ({ stats }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">📈 Stats</h3>
      <ul className="list-disc ml-6">
        <li>Total Contributions (last year): {stats.contributionsThisYear}</li>
        <li>Open Pull Requests: {stats.openPullRequests}</li>
        <li>Issues Contributed: {stats.contributedIssues}</li>
      </ul>
    </div>
  );
};

export default Stats;
