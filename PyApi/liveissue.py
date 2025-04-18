import requests
from datetime import datetime, timezone

# Optional GitHub Token for higher rate limit
GITHUB_TOKEN = "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"  # <-- Add your token here (optional)
HEADERS = {
    "Accept": "application/vnd.github+json"
}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"

def fetch_latest_issues(max_issues=100):
    print(f"\n🔍 Fetching the latest {max_issues} open issues from GitHub...")

    # GitHub API allows max 100 per page
    params = {
        "q": "type:issue state:open",
        "sort": "created",
        "order": "desc",
        "per_page": max_issues,
        "page": 1
    }

    try:
        response = requests.get("https://api.github.com/search/issues", headers=HEADERS, params=params)
        response.raise_for_status()
        data = response.json()
        issues = data.get("items", [])

        if not issues:
            print("❌ No open issues found.")
            return

        print(f"\n✅ Found {len(issues)} latest open issue(s):\n")
        for i, issue in enumerate(issues, 1):
            print(f"{i}. 📝 {issue['title']}")
            print(f"   🔗 {issue['html_url']}")
            print(f"   📅 Created at: {issue['created_at']}")
            print(f"   🧪 Repo: {' / '.join(issue['repository_url'].split('/')[-2:])}")
            print(f"   🏷️ Labels: {[l['name'] for l in issue.get('labels', [])]}")
            print("-" * 80)

    except requests.exceptions.HTTPError as err:
        print(f"❌ GitHub API error: {err.response.status_code} - {err.response.text}")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

# ------------------------ Run it ------------------------

if __name__ == "__main__":
    fetch_latest_issues(100)
