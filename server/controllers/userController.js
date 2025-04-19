const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getUserTopRepos } = require("../services/githubService");

router.get("/repos", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken)
    return res.status(401).json({ message: "Unauthorized" });

  const repos = await getUserTopRepos(user.accessToken);
  res.json(repos);
});

// Fetch recent commits made by the authenticated user
const fetchUserCommits = async (accessToken, topRepos, username) => {
  const recentCommits = [];

  for (const repo of topRepos.slice(0, 5)) {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${repo.full_name}/commits`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            per_page: 5,
            author: username, // ✅ only fetch user's commits
          },
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
      console.error(`Failed to fetch user commits for ${repo.full_name}`, err.message);
    }
  }

  return recentCommits;
};

// GET /api/recent-commits — commits by logged-in user only
router.get("/recent-commits", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const topRepos = await getUserTopRepos(user.accessToken);
    const username = user.profile.username; // ✅ from GitHub login
    const commits = await fetchUserCommits(user.accessToken, topRepos, username);
    res.json(commits);
  } catch (err) {
    console.error("Commit fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch commits" });
  }
});

module.exports = router;
