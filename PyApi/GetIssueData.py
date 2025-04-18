import requests
from urllib.parse import urlparse

# GitHub token for higher rate limits
GITHUB_TOKEN = "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"

def github_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

def parse_repo_url(repo_url):
    """
    Extracts owner and repo name from a GitHub repo URL.
    Example: https://github.com/pcingola/SnpEff → ("pcingola", "SnpEff")
    """
    path_parts = urlparse(repo_url).path.strip("/").split("/")
    if len(path_parts) >= 2:
        return path_parts[0], path_parts[1]
    return None, None

def get_issues_from_repo(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/issues"
    response = requests.get(url, headers=github_headers())
    issues = []
    if response.status_code == 200:
     for issue in response.json():
        if "pull_request" in issue:
            continue  # Skip PRs
        issues.append({
            "title": issue["title"],
            "body": issue.get("body", ""),
            "labels": [label["name"] for label in issue.get("labels", [])],
            "repository_url": issue["repository_url"].replace("api.", "").replace("repos/", "")  # Full GitHub repo URL
        })

    else:
        print("Failed to fetch issues:", response.text)
    return {"issues": issues}

# Example usage
if __name__ == "__main__":
    repo_url = input("Enter GitHub repo URL: ")
    owner, repo = parse_repo_url(repo_url)
    if owner and repo:
        data = get_issues_from_repo(owner, repo)
        print(data)
    else:
        print("❌ Invalid repository URL")
