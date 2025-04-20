import requests

# Optional GitHub Token for higher rate limit
GITHUB_TOKEN = "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"
HEADERS = {
    "Accept": "application/vnd.github+json"
}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"

def fetch_repo_languages(repo_url):
    """Fetch languages used in a GitHub repository"""
    try:
        response = requests.get(f"{repo_url}/languages", headers=HEADERS)
        response.raise_for_status()
        return list(response.json().keys())
    except Exception as e:
        print(f"⚠️ Failed to fetch languages for {repo_url}: {e}")
        return []

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
            issue_url = issue['html_url']  # 🆕 Add issue URL
            repo_api_url = issue['repository_url']
            languages = fetch_repo_languages(repo_api_url)

            issues_data.append({
                "title": title,
                "issue_url": issue_url,  # 🆕 Added here
                "repo_languages": languages
            })

        return issues_data

    except requests.exceptions.HTTPError as err:
        print(f"❌ GitHub API error: {err.response.status_code} - {err.response.text}")
        return []
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return []

# ------------------------ Run it ------------------------

if __name__ == "__main__":
    issues = fetch_latest_issues(20)
    for issue in issues[:5]:  # Preview first 5
        print(f"📝 {issue['title']}")
        print(f"🔗 {issue['issue_url']}")
        print(f"🧪 Languages: {issue['repo_languages']}")
        print("-" * 50)


# structure of issues_data

# list
# [
#     {
#         'title':
#         'issue_url':
#         'repo_languages'
#     }
    
# ]