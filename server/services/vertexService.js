// const axios = require("axios");
// const { GoogleAuth } = require("google-auth-library");

// // Load the service account JSON
// const auth = new GoogleAuth({
//   keyFile: "E:/Basic Learning/React_Node/github_opensource_contri_mathchmaker/server/services/vertexcreadentials.json", // <--- your path
//   scopes: "https://www.googleapis.com/auth/cloud-platform",
// });

// // Replace with your real project ID
// const PROJECT_ID = "dynamic-digit-456709-a8";
// const LOCATION = "us-central1";
// const MODEL = "textembedding-gecko@003";

// const VERTEX_ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

// async function getAccessToken() {
//   const client = await auth.getClient();
//   const accessTokenResponse = await client.getAccessToken();
//   return accessTokenResponse.token;
// }

// async function getEmbeddings(textArray) {
//   const token = await getAccessToken();

//   const res = await axios.post(
//     VERTEX_ENDPOINT,
//     {
//       instances: textArray.map(text => ({ content: text })),
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return res.data.predictions; // embeddings
// }

// module.exports = { getEmbeddings };
