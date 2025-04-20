from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from urllib.parse import urlparse
import google.generativeai as genai
import logging

# ========== ✅ CONFIGURATION ========== #
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Adjust for frontend URL

GEMINI_API_KEY = "AIzaSyBciSvLma-f_ymmUnaz1eQO_6F_cSWCUls"
GITHUB_TOKEN = "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"

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

# ========== 🚀 RUN FLASK APP ========== #
if __name__ == '__main__':
    app.run(debug=True, port=5001)
