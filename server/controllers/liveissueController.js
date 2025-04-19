const express = require('express');
const axios = require('axios');
const router = express.Router();

// Optional: GitHub Token for higher rate limits
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set in .env
const headers = {
  Accept: 'application/vnd.github+json',
};
if (GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
}

router.get('/live-issues', async (req, res) => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // 15 mins ago

    const query = `type:issue state:open created:>${fifteenMinutesAgo}`;
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=100`;

    const response = await axios.get(url, { headers });

    // Format similar to your Python version
    const issues = response.data.items.map((issue) => ({
      title: issue.title,
      url: issue.html_url,
      created_at: issue.created_at,
      labels: issue.labels.map((l) => l.name),
      repo: issue.repository_url.split('/').slice(-2).join(' / ')
    }));

    res.json({ count: response.data.total_count, issues });
  } catch (error) {
    console.error('Error fetching issues:', error.message);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

module.exports = router;
