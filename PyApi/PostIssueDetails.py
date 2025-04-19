#In this script we get output/structure of data as
# {
#   "title": "Ajuda na função soma",
#   "state": "open",
#   "created_at": "2023-08-22T18:57:00Z",
#   "comments": 2,
#   "body": "Estou tentando somar dois números...",
#   "issue_number": 1,
#   "repository_url": "https://github.com/Bielmfp18/programacaoC"
# }

#In this we send issue detail to frontend to display
import requests
from urllib.parse import urlparse

# Optional GitHub token to avoid rate limits
GITHUB_TOKEN = "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"  # Replace or set to None

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
        owner = parts[0]
        repo = parts[1]
        issue_number = parts[3]
        return owner, repo, issue_number
    return None, None, None

def fetch_issue_data(issue_url):
    owner, repo, issue_number = parse_issue_url(issue_url)
    if not all([owner, repo, issue_number]):
        return {"error": "Invalid issue URL"}
    
    api_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"
    response = requests.get(api_url, headers=github_headers())
    
    if response.status_code == 200:
        issue = response.json()
        return {
            "title": issue.get("title"),
            "state": issue.get("state"),
            "created_at": issue.get("created_at"),
            "comments": issue.get("comments"),
            "body": issue.get("body"),
            "issue_number": issue.get("number"),
            "repository_url": f"https://github.com/{owner}/{repo}",
            "issue_url":issue_url
        }
    else:
        return {"error": f"Failed to fetch issue. Status code: {response.status_code}"}

if __name__=="__main__":
    
# Example usage
 issue_url = "https://github.com/microsoft/vscode-remote-try-dotnet/issues/58"
 data = fetch_issue_data(issue_url)
#print(data)




