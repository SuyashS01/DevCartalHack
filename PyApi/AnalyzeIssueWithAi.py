import google.generativeai as genai

import google.generativeai as genai

# ------------------- CONFIG -------------------
GEMINI_API_KEY = "AIzaSyBciSvLma-f_ymmUnaz1eQO_6F_cSWCUls"  # Replace this with your key

# Initialize Gemini Pro
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# ------------------- Prompt Template -------------------

def build_prompt(title: str, description: str, languages=None):
    lang_text = ", ".join(languages) if languages else "N/A"
    return f"""
You are a helpful AI assistant that helps developers understand and solve GitHub issues.

Issue Title:
{title}

Issue Description:
{description}

Languages/Technologies involved:
{lang_text}

Provide a response in the following format:
1. ✅ **Summary** (in simple words)
2. 🧠 **Possible Cause**
3. 🛠️ **Technologies Involved**
4. 📝 **Step-by-Step Solution Plan**
5. 📘 **Extra Tips or Docs**

Use markdown format and keep it beginner-friendly.
"""

# ------------------- Main Logic -------------------

def analyze_issue_with_gemini(title, description, languages=None):
    prompt = build_prompt(title, description, languages)
    response = model.generate_content(prompt)
    return response.text #get string output from AI

# ------------------- CLI Runner -------------------

if __name__ == "__main__":
    # Sample values — you can replace this with GitHub API scraped values
    issue_title = input("🔹 Enter issue title: ")
    issue_description = input("📝 Enter issue description: ")
    lang_input = input("💻 Enter repo languages (comma separated): ")
    languages = [lang.strip() for lang in lang_input.split(",")] if lang_input else []
    print(languages)
	
    # print("\n🤖 Generating solution with Gemini...\n")
    # output = analyze_issue_with_gemini(issue_title, issue_description, languages)
    # print(output)





