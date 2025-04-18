const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/live-issues', async (req, res) => {
  try {
    // Get ISO timestamp for one minute ago
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();

    // GitHub Search API URL
    const query = `type:issue+state:open+created:>${oneMinuteAgo}`;
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`;

    // Optional: Add your GitHub token for higher rate limits
    const headers = {
      Accept: 'application/vnd.github+json',
      // Uncomment below if using a token
      // Authorization: `Bearer YOUR_GITHUB_TOKEN`
    };

    const response = await axios.get(url, { headers });

    res.json({
      count: response.data.total_count,
      issues: response.data.items
    });
  } catch (error) {
    console.error('Error fetching issues:', error.message);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

module.exports = router;
