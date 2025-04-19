import requests
from bs4 import BeautifulSoup

# achievments data in the formate
# {
#     "achievement_name":"image url"
# }

def scrape_unique_achievements(username):
    url = f"https://github.com/{username}?tab=achievements"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Failed to fetch page. Status code: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')

    achievements = {}
    for a in soup.select('a[href*="achievement="]'):
        img = a.find('img')
        if img and 'alt' in img.attrs and 'src' in img.attrs:
            name = img['alt'].replace("Achievement: ", "").strip()
            src = img['src']
            achievements[name] = src  # Dictionary automatically handles duplicates

    return achievements

# Example usage
if __name__ == "__main__":
    username = "ashishpatel26"
    data = scrape_unique_achievements(username)

    for name, link in data.items():
        print(f"{name}: {link}")
