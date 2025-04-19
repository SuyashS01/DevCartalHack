import requests
from urllib.parse import urlparse

# Optional GitHub token to avoid rate limits
GITHUB_TOKEN = "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"  # Replace with env variable for security in production

def github_headers():
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

def parse_issue_url(issue_url):
    """Extract owner, repo, and issue number from a GitHub issue URL"""
    parts = urlparse(issue_url).path.strip("/").split("/")
    if len(parts) >= 4 and parts[2] == "issues":
        return parts[0], parts[1], parts[3]
    return None, None, None

def fetch_issue_data(issue_url):
    owner, repo, issue_number = parse_issue_url(issue_url)
    if not all([owner, repo, issue_number]):
        return {"error": "Invalid issue URL"}
    
    api_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"
    response = requests.get(api_url, headers=github_headers())

    if response.status_code != 200:
        return {"error": f"Failed to fetch issue. Status code: {response.status_code}"}

    issue = response.json()

    # Simulated logic for scoring and tags — replace with ML/AI or user preference matching later
    tags = ["good-first-issue"] if "good first issue" in issue.get("labels", []) else ["general"]
    match_score = 85  # You can later adjust this using AI matching
    match_reasons = [
        "This issue aligns with your interests.",
        "Tagged as beginner-friendly.",
        "The project is currently active."
    ]

    return {
        "id": str(issue.get("number")),
        "title": issue.get("title"),
        "repo": {
            "name": repo,
            "owner": owner,
            "stars": fetch_repo_stars(owner, repo)
        },
        "tags": tags,
        "matchScore": match_score,
        "createdAt": issue.get("created_at"),
        "matchReasons": match_reasons,
        "language": "Markdown",  # Placeholder; dynamic detection can be added
        "experience": "beginner"
    }

def fetch_repo_stars(owner, repo):
    """Fetch number of stars for a GitHub repository"""
    api_url = f"https://api.github.com/repos/{owner}/{repo}"
    response = requests.get(api_url, headers=github_headers())
    if response.status_code == 200:
        repo_data = response.json()
        return repo_data.get("stargazers_count", 0)
    return 0

if __name__ == "__main__":
    issue_url = "https://github.com/microsoft/vscode-remote-try-dotnet/issues/58"
    data = fetch_issue_data(issue_url)
    print(data)
