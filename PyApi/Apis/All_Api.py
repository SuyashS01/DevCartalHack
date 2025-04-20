from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
from langdetect import detect, LangDetectException
import requests
from flask_cors import CORS
from urllib.parse import urlparse
import google.generativeai as genai
import logging

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# GitHub Token for higher rate limits (if applicable)
GEMINI_API_KEY = "AIzaSyBciSvLma-f_ymmUnaz1eQO_6F_cSWCUls"
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

# Configure API keys
genai.configure(api_key=GEMINI_API_KEY)

# ========== 🪵 LOGGING SETUP ========== #
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ========== 🔐 HEADERS ========== #
def github_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

# ========== 🧠 GEMINI: Interpret Query ========== #
def interpret_query_with_gemini(user_input):
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = f"Convert the following natural language query into GitHub search keywords (Give only keywords): '{user_input}'"
        response = model.generate_content(prompt)
        keywords = response.text.strip()
        logger.info(f"🔍 Gemini interpreted query: {keywords}")
        return keywords
    except Exception as e:
        logger.exception("Gemini query interpretation failed.")
        raise RuntimeError("Failed to interpret query with Gemini") from e

# ========== 🔎 GitHub Search Issues ========== #
def search_issues_by_keywords(keywords, max_results=20):
    try:
        query = f"{keywords} in:title,body is:issue is:open"
        url = f"https://api.github.com/search/issues?q={query}&per_page={max_results}"
        response = requests.get(url, headers=github_headers())
        response.raise_for_status()
        return response.json().get("items", [])
    except Exception as e:
        logger.exception("GitHub issue search failed.")
        raise RuntimeError("GitHub search failed") from e

# ========== 🔍 Repo Info Extract ========== #
def parse_issue_url(issue_url):
    try:
        parts = urlparse(issue_url).path.strip("/").split("/")
        if len(parts) >= 4 and parts[2] == "issues":
            return parts[0], parts[1], parts[3]  # owner, repo, issue_number
    except Exception as e:
        logger.error(f"Invalid issue URL: {issue_url}")
    return None, None, None

# ========== 📋 Fetch Detailed Issue ========== #
def fetch_issue_data(issue_url):
    owner, repo, issue_number = parse_issue_url(issue_url)
    if not all([owner, repo, issue_number]):
        return {"error": "Invalid issue URL"}

    try:
        api_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"
        response = requests.get(api_url, headers=github_headers())
        response.raise_for_status()
        issue = response.json()
        return {
            "title": issue.get("title"),
            "state": issue.get("state"),
            "created_at": issue.get("created_at"),
            "comments": issue.get("comments"),
            "body": issue.get("body"),
            "issue_number": issue.get("number"),
            "repository_url": f"https://github.com/{owner}/{repo}",
            "issue_url": issue_url
        }
    except Exception as e:
        logger.warning(f"Failed to fetch issue details for {issue_url}: {e}")
        return {"error": f"Issue fetch failed for: {issue_url}"}

# ========== 🌐 MAIN API: POST /query_issues ========== #
@app.route('/query_issues', methods=['POST'])
def query_issues():
    data = request.get_json()
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "Missing 'query' in request"}), 400

    try:
        # Step 1: Convert to GitHub search query
        keywords = interpret_query_with_gemini(user_query)

        # Step 2: Search for GitHub issues
        issues = search_issues_by_keywords(keywords)
        issue_urls = [issue["html_url"] for issue in issues]

        # Step 3: Fetch enriched issue details
        enriched_issues = []
        for url in issue_urls:
            detail = fetch_issue_data(url)
            if 'error' not in detail:
                enriched_issues.append(detail)

        return jsonify({
            "query": user_query,
            "keywords": keywords,
            "matched_issues": enriched_issues
        })

    except Exception as e:
        logger.exception("Error handling user query.")
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5001)
