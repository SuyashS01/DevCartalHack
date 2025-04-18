const express = require("express");
const router = express.Router();
const { getUserTopRepos } = require("../services/githubService");

router.get("/repos", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken)
    return res.status(401).json({ message: "Unauthorized" });

  const repos = await getUserTopRepos(user.accessToken);
  res.json(repos);
});

// /routes/github.js or similar
router.get("/recent-commits", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const repos = await getUserTopRepos(user.accessToken);
    const commits = await fetchRecentCommits(user.accessToken, repos);
    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent commits", details: err.message });
  }
});


module.exports = router;
