const express = require("express");
const router = express.Router();
const axios = require("axios");
const { fetchGitHubIssues } = require("../services/githubService");
const { matchIssues } = require("../services/matchService"); 

// Basic GET route (still useful for static query testing)
router.get("/issues", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

  const { language = "JavaScript", label = "good first issue" } = req.query;
  const issues = await fetchGitHubIssues(user.accessToken, language, label);

  res.json(issues);
});

// router.get("/issues", async (req, res) => {
//   const user = req.user;
//   if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     // Step 1: Fetch user's repositories and determine top languages
//     const reposRes = await axios.get("https://api.github.com/user/repos", {
//       headers: { Authorization: `Bearer ${user.accessToken}` },
//       params: { per_page: 100 }
//     });

//     const languages = {};
//     reposRes.data.forEach(repo => {
//       if (repo.language) {
//         languages[repo.language] = (languages[repo.language] || 0) + 1;
//       }
//     });

//     const sortedLanguages = Object.entries(languages)
//       .sort((a, b) => b[1] - a[1])
//       .map(([lang]) => lang);

//     const topLanguages = sortedLanguages.slice(0, 1); // Top 1 languages

//     if (topLanguages.length === 0) {
//       return res.status(404).json({ message: "No languages found in user's GitHub repositories." });
//     }

//     // Step 2: Fetch issues for each top language
//     const label = req.query.label || "good first issue"; // still allow label override

//     const issuesPromises = topLanguages.map(lang =>
//       fetchGitHubIssues(user.accessToken, lang, label)
//     );

//     const issuesResults = await Promise.all(issuesPromises);

//     // Combine issues from both languages
//     const combinedIssues = issuesResults.flat();

//     res.json(combinedIssues);

//   } catch (err) {
//     console.error("Issues fetch error:", err.message);
//     res.status(500).json({ message: "Failed to fetch issues" });
//   }
// });

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

// Updated POST /api/match route
router.post("/matchAiV", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken) return res.status(401).json({ message: "Unauthorized" });

  const skillsInput = req.body.skills || "";
  const skillTags = skillsInput.split(",").map(s => s.trim()).filter(Boolean);

  if (skillTags.length === 0) {
    return res.status(400).json({ message: "No skills provided" });
  }

  try {
    // Step 1: Prepare a fake 'userProfile' object based on skills
    const userProfile = {
      languages: skillTags,
      recentCommits: [], // Optional: can keep empty if not available
      repoDescriptions: [], // Optional: can keep empty
    };

    // Step 2: Fetch issues from GitHub
    const query = skillTags.map(skill => `language:${skill}`).join(" ");
    const label = "good first issue";

    const issues = await fetchGitHubIssues(user.accessToken, query, label);

    if (issues.length === 0) {
      return res.status(404).json({ message: "No issues found" });
    }

    // Step 3: Match issues using Vertex AI embeddings
    const topMatchedIssues = await matchIssues(userProfile, issues);

    res.json(topMatchedIssues);
  } catch (err) {
    console.error("Match error:", err.message);
    res.status(500).json({ message: "Failed to match issues" });
  }
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
