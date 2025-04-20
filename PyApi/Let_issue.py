import requests
from urllib.parse import urlparse
from liveissue import fetch_latest_issues  # This should return title, issue_url, repo_languages
from langdetect import detect, LangDetectException
# GitHub token for rate limit handling (optional)
GITHUB_TOKEN = "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"

def github_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

from sentence_transformers import SentenceTransformer, util

# Load the transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')



def calculate_similarity(user_languages, issue_data):
    user_input = " ".join(user_languages)
    user_embedding = model.encode(user_input, convert_to_tensor=True)

    scored_issues = []

    for issue in issue_data:
        title = issue['title']

        # Skip non-English titles
        try:
            if detect(title) != "en":
                continue
        except LangDetectException:
            continue  # In case detection fails

        combined_text = title + " " + " ".join(issue['repo_languages'])
        issue_embedding = model.encode(combined_text, convert_to_tensor=True)
        raw_score = util.cos_sim(user_embedding, issue_embedding).item()
        normalized_score = int((raw_score + 1) / 2 * 100)  # Scale to 0–100
        final_score = max(normalized_score, 1)  # Clamp to minimum 1

        scored_issues.append({
            "title": title,
            "issue_url": issue['issue_url'],
            "repo_languages": issue['repo_languages'],
            "score": final_score
        })

    return sorted(scored_issues, key=lambda x: x["score"], reverse=True)


#THis is the main function to call with argument (user language)
def toptenscorer(userlanguages):
    issue_data = fetch_latest_issues(20)
    if not issue_data:
        print("❌ No issue data found.")
        return

    scored = calculate_similarity(userlanguages, issue_data)
    
    for issue in scored[:10]:  # Top 10 results
        print(f"📝 Title: {issue['title']}")
        print(f"🔗 URL: {issue['issue_url']}")
        print(f"🧪 Repo Languages: {', '.join(issue['repo_languages'])}")
        print(f"🎯 Matching Score: {issue['score']}")
        print("-" * 60)
    return scored
# Example usage
if __name__ == "__main__":
    user_known_languages = ["Python", "JavaScript", "HTML", "CSS",'C','C++','C#']
    toptenscorer(user_known_languages)


#Structure of scored 
#[{
    # 'title':,
    # 'issue_url':,
    # 'repo_language':,
    # 'score':
    # }]