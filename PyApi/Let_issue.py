from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from langdetect import detect, LangDetectException
from sentence_transformers import SentenceTransformer, util
import uuid

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

# Optional GitHub Token
GITHUB_TOKEN = "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"

def github_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

# 🧪 Mocked GitHub Issues (replace with real fetch logic if needed)
def fetch_latest_issues(limit=20):
    return [
        {
            "title": "Improve documentation for API endpoints",
            "issue_url": "https://github.com/api-platform/rest-api/issues/6",
            "repo_languages": ["Markdown", "YAML"],
            "repo": {
                "name": "rest-api",
                "owner": "api-platform",
                "stars": 952
            },
            "created_at": "2023-04-15",
            "tags": ["documentation", "api", "good-first-issue"],
            "experience": "beginner"
        },
        {
            "title": "Fix bug in JavaScript input handler",
            "issue_url": "https://github.com/js-lib/handler/issues/14",
            "repo_languages": ["JavaScript"],
            "repo": {
                "name": "handler",
                "owner": "js-lib",
                "stars": 320
            },
            "created_at": "2023-04-10",
            "tags": ["bug", "frontend", "javascript"],
            "experience": "intermediate"
        }
        # ➕ Add more issues or fetch dynamically
    ]

# 🧠 Matching Logic
def calculate_similarity(user_languages: List[str], issue_data: List[dict]):
    user_input = " ".join(user_languages)
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    matched = []

    for issue in issue_data:
        try:
            if detect(issue["title"]) != "en":
                continue
        except LangDetectException:
            continue

        combined_text = issue["title"] + " " + " ".join(issue["repo_languages"])
        issue_embedding = model.encode(combined_text, convert_to_tensor=True)
        raw_score = util.cos_sim(user_embedding, issue_embedding).item()
        normalized_score = int((raw_score + 1) / 2 * 100)

        matched.append({
            "id": str(uuid.uuid4()),
            "title": issue["title"],
            "repo": issue["repo"],
            "tags": issue.get("tags", []),
            "matchScore": normalized_score,
            "createdAt": issue["created_at"],
            "matchReasons": [
                "Matches your language preferences",
                "Open source project with relevant tags",
                "Title has high similarity with your skills"
            ],
            "language": issue["repo_languages"][0] if issue["repo_languages"] else "Unknown",
            "experience": issue.get("experience", "unknown"),
            "issue_url": issue["issue_url"]
        })

    return sorted(matched, key=lambda x: x["matchScore"], reverse=True)

# 📦 Request Body
class IssueRequest(BaseModel):
    user_languages: List[str]

# 🚀 API Endpoint
@app.post("/match-issues")
def get_matched_issues(payload: IssueRequest):
    raw_issues = fetch_latest_issues(30)
    matched_issues = calculate_similarity(payload.user_languages, raw_issues)
    return matched_issues[:10]
02