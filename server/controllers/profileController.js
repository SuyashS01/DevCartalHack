const express = require("express");
const router = express.Router();
const { getCompleteProfile } = require("../services/githubService");

router.get("/profile", async (req, res) => {
  const user = req.user;
  if (!user || !user.accessToken)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const profileData = await getCompleteProfile(user.accessToken);
    if (!profileData)
      return res.status(500).json({ message: "Failed to fetch profile data" });

    res.json(profileData);
  } catch (err) {
    console.error("Error in /profile route:", err.message);
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

module.exports = router;
