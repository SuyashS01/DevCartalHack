
#This script return data of issues present in particular repo of user by taking input of username and his language




import requests
from langdetect import detect, LangDetectException
from sentence_transformers import SentenceTransformer, util
# Load the transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')
# ------------------------- Config -------------------------

GITHUB_TOKEN = "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"  # Replace or set to None

def github_headers():
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers


# ------------------- GitHub API Functions -------------------

def get_user_repos(username):
    try:
        url = f"https://api.github.com/users/{username}/repos"
        resp = requests.get(url, headers=github_headers(), params={"per_page": 100})
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"❌ Failed to fetch repos: {e}")
        return []

def get_repo_languages(owner, repo):
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/languages"
        resp = requests.get(url, headers=github_headers())
        resp.raise_for_status()
        return list(resp.json().keys())
    except:
        return []

def get_repo_issues(owner, repo):
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/issues"
        resp = requests.get(url, headers=github_headers(), params={"state": "open", "per_page": 30})
        resp.raise_for_status()
        issues = resp.json()
        print(type(issues))
         
        final_issues = []
        repo_languages = get_repo_languages(owner, repo)

        for issue in issues:
            if "pull_request" in issue:
                continue  # skip PRs

            title = issue["title"]

            try:
                if detect(title) != "en":
                    continue
            except LangDetectException:
                continue

            final_issues.append({
                "title": title,
                "issue_url": issue["html_url"],
                "repo_languages": repo_languages
            })

        return final_issues #list
    except Exception as e:
        print(f"❌ Failed to fetch issues: {e}")
        return []

# ------------------- Transformer Matching -------------------

def calculate_similarity(user_languages, issues):
    user_input = " ".join(user_languages)
    user_embedding = model.encode(user_input, convert_to_tensor=True)

    scored = []

    for issue in issues:
        combined_text = issue["title"] + " " + " ".join(issue["repo_languages"])
        issue_embedding = model.encode(combined_text, convert_to_tensor=True)
        raw_score = util.cos_sim(user_embedding, issue_embedding).item()
        scaled_score = int((raw_score + 1) / 2 * 100)
        final_score = max(scaled_score, 1)

        scored.append({
            "title": issue["title"],
            "issue_url": issue["issue_url"],
            "repo_languages": issue["repo_languages"],
            "score": final_score
        })

    return sorted(scored, key=lambda x: x["score"], reverse=True)

# ------------------- Orchestration -------------------

def match_issues_from_selected_repo(username, user_languages):
    repos = get_user_repos(username)

    if not repos:
        print("⚠️ No public repositories found.")
        return

    print(f"\n📦 Repositories of {username}:\n")
    for idx, repo in enumerate(repos, start=1):
        print(f"{idx}. {repo['name']}")

    try:
        #Take input from frontend to dispaly issues from repo
        selected = int(input("\n👉 Select the repo number to fetch issues from: ")) - 1
        if not (0 <= selected < len(repos)):
            print("❌ Invalid selection.")
            return
    except ValueError:
        print("❌ Invalid input.")
        return

    selected_repo = repos[selected]["name"]
    owner = repos[selected]["owner"]["login"]
    print(f"OWNER: {owner}")

    print(f"\n🔍 Fetching issues from repo: {selected_repo}...\n")

    issues = get_repo_issues(owner, selected_repo)
    if not issues:
        print("⚠️ No open issues found.")
        return

    scored = calculate_similarity(user_languages, issues) #return this in route call
    print(type(scored))
    print(f"\n🎯 Top matching issues in {selected_repo}:\n")
    for issue in scored[:10]:
        print(f"📝 {issue['title']}")
        print(f"🔗 {issue['issue_url']}")
        print(f"🧪 Repo Languages: {', '.join(issue['repo_languages'])}")
        print(f"🎯 Matching Score: {issue['score']}/100")
        print("-" * 60)

#------------------------ Run ------------------------

if __name__ == "__main__":
    user_known_languages = ["Python", "Jupyter Notebook"]
    github_username = input("Enter GitHub username: ").strip()
    match_issues_from_selected_repo(github_username, user_known_languages)
