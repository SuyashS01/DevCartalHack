// const { getEmbeddings } = require("../vertexService"); // Adjust path if needed

// async function matchIssues(userProfile, issues) {
//   const userText = `
//     Languages: ${userProfile.languages.join(", ")}
//     Commits: ${userProfile.recentCommits.join(". ")}
//     Repo Descriptions: ${userProfile.repoDescriptions.join(". ")}
//   `;

//   const issueTexts = issues.map(issue => `${issue.title}. ${issue.body}`);

//   // Get embeddings: first element is user, rest are issues
//   const embeddings = await getEmbeddings([userText, ...issueTexts]);

//   const userEmbedding = embeddings[0];
//   const issueEmbeddings = embeddings.slice(1);

//   // Compute cosine similarities
//   const similarities = issueEmbeddings.map(embedding => cosineSimilarity(userEmbedding, embedding));

//   // Attach similarity score to each issue and sort
//   const rankedIssues = issues
//     .map((issue, idx) => ({
//       ...issue,
//       score: similarities[idx],
//     }))
//     .sort((a, b) => b.score - a.score); // higher score = better match

//   return rankedIssues.slice(0, 5); // Return top 5 matched issues
// }

// function cosineSimilarity(vecA, vecB) {
//   const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
//   const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//   const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//   return dotProduct / (normA * normB);
// }

// module.exports = {
//   matchIssues,
// };
