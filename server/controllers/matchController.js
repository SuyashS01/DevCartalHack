const express = require("express");
const router = express.Router();
const axios = require("axios");
const { fetchGitHubIssues } = require("../services/githubService");

// Basic GET route (still useful for static query testing)
router.get("/issues", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

  const { language = "JavaScript", label = "good first issue" } = req.query;
  const issues = await fetchGitHubIssues(user.accessToken, language, label);

  res.json(issues);
});

// New POST /api/match route
router.post("/match", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

  const skillsInput = req.body.skills || "";
  const skillTags = skillsInput.split(",").map(s => s.trim()).filter(Boolean);

  if (skillTags.length === 0) {
    return res.status(400).json({ message: "No skills provided" });
  }

  const query = skillTags.map(skill => `language:${skill}`).join(" ");
  const label = "good first issue"; // could customize later

  const issues = await fetchGitHubIssues(user.accessToken, query, label);
  res.json(issues);
});

// /server/controllers/matchController.js
router.get("/user-languages", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const reposRes = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${user.accessToken}` },
      params: { per_page: 100 }
    });

    const languages = {};

    reposRes.data.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);

    res.json(sortedLanguages);
  } catch (err) {
    console.error("Language fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch languages" });
  }
});


module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { fetchGitHubIssues } = require("../services/githubService");

// router.get("/issues", async (req, res) => {
//   const user = req.user;
//   if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

//   const { language = "JavaScript", label = "good 3 issue" } = req.query;

//   const issues = await fetchGitHubIssues(user.accessToken, language, label);
//   res.json(issues);
// });

// module.exports = router;
