#Python script to get user data related to his repo

import requests





# GitHub token for rate limit handling 
GITHUB_TOKEN = "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"

def github_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

#function to get list of repos of user
def get_user_repos(username):
    url = f"https://api.github.com/users/{username}/repos"
    response = requests.get(url, headers=github_headers())
    return response.json() if response.status_code == 200 else []

#function to get commits of single repo by user
def get_commits(owner, repo, author):
    url = f"https://api.github.com/repos/{owner}/{repo}/commits"
    params = {"author": author}
    response = requests.get(url, headers=github_headers(), params=params)
    if response.status_code == 200:
        return [commit["commit"]["message"] for commit in response.json()]
    return []

#function to get languages used in  single repo
def get_languages(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/languages"
    response = requests.get(url, headers=github_headers())
    return list(response.json().keys()) if response.status_code == 200 else []



def get_repo_description(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    

    response = requests.get(url, headers=github_headers())
    if response.status_code == 200:
        data = response.json()
        
        return data.get("description", "No description found.")
    else:
        print("Failed to fetch repo info:", response.text)
        return None



def extract_user_data(username):
    user_data = {"repos": []}
    repos = get_user_repos(username)
    count=0
    for repo in repos:
        owner = repo["owner"]["login"]
        repo_name = repo["name"]
        commits = get_commits(owner, repo_name, username)
        languages = get_languages(owner, repo_name)
        description=get_repo_description(owner,repo_name)

        user_data["repos"].append({
            "repo_name": repo_name,
            "ownername": owner,
            "commits": commits,
            "languages": languages,
            "description":description
        })
        count+=1
        if count==10:
            break

    return user_data

# === Run ===
if __name__ == "__main__":
    data=extract_user_data('jmschrei')
    # print(len(data['repos']))
    # repos=get_user_repos('jmschrei')
    print(data['repos'][1])
    
    
    pass
