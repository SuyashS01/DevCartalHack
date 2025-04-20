import google.generativeai as genai
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

# ------------------- App Setup -------------------
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Adjust if needed

# ------------------- Logging Setup -------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------- Gemini Config -------------------
GEMINI_API_KEY = "AIzaSyBciSvLma-f_ymmUnaz1eQO_6F_cSWCUls"  # 🔐 Replace with your own key
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# ------------------- Prompt Builder -------------------
def build_prompt(title: str, description: str, languages=None) -> str:
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
1. ✅ *Summary* (in simple words)
2. 🧠 *Possible Cause*
3. 🛠 *Technologies Involved*
4. 📝 *Step-by-Step Solution Plan*
5. 📘 *Extra Tips or Docs*

Use markdown format and keep it beginner-friendly.
"""

# ------------------- LLM Handler -------------------
def analyze_issue_with_gemini(title: str, description: str, languages=None) -> str:
    prompt = build_prompt(title, description, languages)
    try:
        logger.info("🧠 Sending prompt to Gemini model...")
        response = model.generate_content(prompt)
        logger.info("✅ Gemini response received.")
        return response.text
    except Exception as e:
        logger.exception("❌ Error during Gemini model inference")
        raise RuntimeError("LLM processing failed") from e

# ------------------- API Route -------------------
@app.route('/analyze_issueai', methods=['POST'])
def analyze_issue():
    data = request.get_json()

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    languages = data.get("languages", [])

    if not title or not description:
        logger.warning("⚠️ Missing title or description in request.")
        return jsonify({"error": "Title and description are required."}), 400

    try:
        llm_response = analyze_issue_with_gemini(title, description, languages)
        return jsonify({"llm_response": llm_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------- Run the App -------------------
if __name__ == '__main__':
    app.run(debug=True, port=5001)
