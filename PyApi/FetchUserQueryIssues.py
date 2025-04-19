#In this script when user enters a query he gets list of url of issues

import requests
from urllib.parse import urlparse
import google.generativeai as genai
genai.configure(api_key="AIzaSyBciSvLma-f_ymmUnaz1eQO_6F_cSWCUls")
# Optional: GitHub token for higher rate limits
GITHUB_TOKEN = "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"
def interpret_query_with_gemini(user_input):
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = f"Convert the following natural language query into GitHub search keywords:(Give only keywords ) '{user_input}'."
    response = model.generate_content(prompt)
    return response.text.strip()

def github_headers():
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

def search_issues_by_keywords(keywords, max_results=20):
    query = f"{keywords} in:title,body is:issue is:open"
    url = f"https://api.github.com/search/issues?q={query}&per_page={max_results}"
    response = requests.get(url, headers=github_headers())
    if response.status_code == 200:
        return response.json().get("items", [])
    else:
        print("Failed to fetch issues:", response.text)
        return []

def extract_repo_info(issue_url):
    parts = urlparse(issue_url).path.strip("/").split("/")
    if len(parts) >= 3:
        return parts[0], parts[1]  # owner, repo
    return None, None

def get_repo_languages(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/languages"
    response = requests.get(url, headers=github_headers())
    if response.status_code == 200:
        return response.json()
    return {}

def main():
    user_input = input("Enter the input for issue: ")
    search_keywords = interpret_query_with_gemini(user_input)
    print(search_keywords)
    issues = search_issues_by_keywords(search_keywords)
    #print(f"🔍 Interpreted keywords: {search_keywords}")
    issue_data=[]
    count=0
    print(type(issues))
    for issue in issues:
        
        issue_url = issue["html_url"]
        issue_data.append(issue_url)
        
    return issue_data

      
    
if __name__ == "__main__":
    main()

