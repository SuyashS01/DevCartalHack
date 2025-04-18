const axios = require("axios");

// Assume GOOGLE_APPLICATION_CREDENTIALS is already set up
const VERTEX_ENDPOINT = "https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/publishers/google/models/textembedding-gecko@003:predict";

async function getEmbeddings(textArray) {
  const res = await axios.post(
    VERTEX_ENDPOINT,
    {
      instances: textArray.map(text => ({ content: text })),
    },
    {
      headers: {
        Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.predictions; // embeddings
}

module.exports = { getEmbeddings };
// get data form vertex ai creadential file