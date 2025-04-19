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

const fetchUserProfile = async (accessToken) => {
  try {
    const res = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { name, email = null, login, followers, following, public_repos } = res.data;
    return { name, email, login, followers, following, public_repos };
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    return null;
  }
};

const fetchUserStats = async (accessToken, username) => {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
        pullRequests(states: OPEN) {
          totalCount
        }
        issues {
          totalCount
        }
        repositoriesContributedTo(first: 5, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE], includeUserRepositories: false) {
          nodes {
            nameWithOwner
            url
          }
        }
        topRepositories(first: 5, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            nameWithOwner
            url
            stargazerCount
          }
        }
      }
    }
  `;

  try {
    const res = await axios.post(
      "https://api.github.com/graphql",
      { query },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const user = res.data.data.user;

    return {
      contributionsThisYear: user.contributionsCollection.contributionCalendar.totalContributions,
      openPullRequests: user.pullRequests.totalCount,
      contributedIssues: user.issues.totalCount,
      topRepos: user.topRepositories.nodes,
      activeContributions: user.repositoriesContributedTo.nodes,
    };
  } catch (err) {
    console.error("GraphQL error:", err.response?.data || err.message);
    return null;
  }
};

const getCompleteProfile = async (accessToken) => {
  const profile = await fetchUserProfile(accessToken);

  if (!profile) return null;

  const stats = await fetchUserStats(accessToken, profile.login);
  const repos = await getUserTopRepos(accessToken);

  return {
    profile,
    stats,
    recentRepos: repos,
  };
};

module.exports = {
  fetchGitHubIssues,
  getUserTopRepos,
  fetchRecentCommits,
  getCompleteProfile
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
