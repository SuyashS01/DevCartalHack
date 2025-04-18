// /server/services/githubService.js
const axios = require("axios");

const fetchGitHubIssues = async (accessToken, queryString, label = "good first issue") => {
  const query = `
    query {
      search(query: "label:\\"${label}\\" ${queryString} state:open", type: ISSUE, first: 10) {
        edges {
          node {
            ... on Issue {
              title
              url
              body
              labels(first: 5) {
                nodes { name }
              }
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.search.edges.map((edge) => edge.node);
  } catch (err) {
    console.error("GitHub API error:", err.response?.data || err.message);
    return [];
  }
};

const getUserTopRepos = async (accessToken) => {
  try {
    const res = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        per_page: 100,
        sort: "updated"
      }
    });

    const repos = res.data;
    // Sort by stars and return top 10
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map(repo => ({
        name: repo.name,
        full_name: repo.full_name, // 👈 ADD THIS
        html_url: repo.html_url,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        updated_at: repo.updated_at,
      }));      

    return topRepos;
  } catch (err) {
    console.error("Repo fetch error:", err.message);
    return [];
  }
};

const fetchRecentCommits = async (accessToken, topRepos) => {
  const recentCommits = [];

  for (const repo of topRepos.slice(0, 5)) {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${repo.full_name}/commits`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { per_page: 3 }, // last 3 commits per repo
        }
      );

      const commits = res.data.map(commit => ({
        repoName: repo.name,
        message: commit.commit.message,
        url: commit.html_url,
        date: commit.commit.author.date,
        author: commit.commit.author.name,
      }));

      recentCommits.push(...commits);
    } catch (err) {
      console.error(`Failed to fetch commits for ${repo.full_name}`, err.message);
    }
  }

  return recentCommits;
};

module.exports = {
  fetchGitHubIssues,
  getUserTopRepos,
  fetchRecentCommits 
};
// /server/services/githubService.js

// const axios = require("axios");

// const fetchGitHubIssues = async (accessToken, queryString, label = "good first issue") => {
//   const query = `
//     query {
//       search(query: "label:\\"${label}\\" ${queryString} state:open", type: ISSUE, first: 10) {
//         edges {
//           node {
//             ... on Issue {
//               title
//               url
//               body
//               labels(first: 5) {
//                 nodes { name }
//               }
//               repository {
//                 nameWithOwner
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   try {
//     const response = await axios.post(
//       "https://api.github.com/graphql",
//       { query },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data.data.search.edges.map((edge) => edge.node);
//   } catch (err) {
//     console.error("GitHub API error:", err.response?.data || err.message);
//     return [];
//   }
// };

// module.exports = { fetchGitHubIssues };
