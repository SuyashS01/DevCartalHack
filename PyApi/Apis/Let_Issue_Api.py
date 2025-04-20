from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from langdetect import detect, LangDetectException
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# GitHub Token for higher rate limits (if applicable)
GITHUB_TOKEN = "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"
HEADERS = {
    "Accept": "application/vnd.github+json"
}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"

# Load model only once
model = SentenceTransformer('all-MiniLM-L6-v2')

# Function to fetch repository languages
def fetch_repo_languages(repo_url):
    """Fetch languages used in a GitHub repository"""
    try:
        response = requests.get(f"{repo_url}/languages", headers=HEADERS)
        response.raise_for_status()
        return list(response.json().keys())
    except Exception as e:
        print(f"⚠️ Failed to fetch languages for {repo_url}: {e}")
        return []

# Function to fetch the latest issues from GitHub
def fetch_latest_issues(max_issues):
    print(f"\n🔍 Fetching the latest {max_issues} open issues from GitHub...")

    params = {
        "q": "type:issue state:open",
        "sort": "created",
        "order": "desc",
        "per_page": max_issues,
        "page": 1
    }

    issues_data = []

    try:
        response = requests.get("https://api.github.com/search/issues", headers=HEADERS, params=params)
        response.raise_for_status()
        data = response.json()
        issues = data.get("items", [])

        if not issues:
            print("❌ No open issues found.")
            return []

        for issue in issues:
            title = issue['title']
            issue_url = issue['html_url']
            repo_api_url = issue['repository_url']
            languages = fetch_repo_languages(repo_api_url)

            issues_data.append({
                "title": title,
                "issue_url": issue_url,
                "repo_languages": languages
            })

        return issues_data

    except requests.exceptions.HTTPError as err:
        print(f"❌ GitHub API error: {err.response.status_code} - {err.response.text}")
        return []
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return []

# Smart scorer: Match user languages to issues based on semantic similarity
def score_issues_by_language(user_languages, issues):
    user_input = " ".join(user_languages)
    user_embedding = model.encode(user_input, convert_to_tensor=True)

    scored_issues = []
    for issue in issues:
        title = issue.get('title', '')
        if not title:
            continue

        # Skip non-English issues
        try:
            if detect(title) != "en":
                continue
        except LangDetectException:
            continue

        # Combine title and repo languages for context
        combined_text = title + " " + " ".join(issue.get('repo_languages', []))
        issue_embedding = model.encode(combined_text, convert_to_tensor=True)

        # Compute cosine similarity score (scaled to 0–100)
        raw_score = util.cos_sim(user_embedding, issue_embedding).item()
        normalized_score = int((raw_score + 1) / 2 * 100)  # Convert [-1, 1] to [0, 100]
        final_score = max(normalized_score, 1)

        scored_issues.append({
            "title": title,
            "issue_url": issue.get('issue_url'),
            "repo_languages": issue.get('repo_languages', []),
            "score": final_score
        })

    # Sort by highest score
    return sorted(scored_issues, key=lambda x: x["score"], reverse=True)

# API Endpoint: POST /api/match-issues
@app.route('/api/match-issues', methods=['POST'])
def match_issues_api():
    data = request.get_json()
    user_languages = data.get('languages')

    if not user_languages or not isinstance(user_languages, list):
        return jsonify({"error": "Invalid or missing 'languages' list"}), 400

    print("🌐 Received languages:", user_languages)

    try:
        # Fetch issues from GitHub (max 20 issues)
        issue_data = fetch_latest_issues(max_issues=20)
    except Exception as e:
        print("❌ Failed to fetch issues:", e)
        return jsonify({"error": "Failed to fetch issue data."}), 500

    if not issue_data:
        print("⚠️ No issue data returned.")
        return jsonify({"error": "No issue data found."}), 500

    # Score and match issues based on user's known languages
    scored_issues = score_issues_by_language(user_languages, issue_data)

    print("✅ Scored Issues:", scored_issues[:3])  # Show top 3 for debug

    return jsonify({"matched_issues": scored_issues[:10]}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5001)
