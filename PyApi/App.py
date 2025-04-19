from flask import Flask, jsonify, request
from flask_cors import CORS
from GetUserData import extract_user_data
from FetchUserQueryIssues import main as extract_repo_info
from PostIssueDetails import fetch_issue_data

app = Flask(__name__)
CORS(app)

@app.route('/login_cred', methods=['GET', 'POST'])
def login_cred():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        if not username:
            return jsonify({'error': 'Username not provided'}), 400

        user_data = extract_user_data(username)
        if user_data:
            return jsonify(user_data)
        else:
            return jsonify({'error': 'Unable to fetch user data'}), 400


@app.route('/query_issues', methods=['POST'])
def query_issues():
    data = request.get_json()
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Step 1: Get issue URLs from user query
        issue_urls = extract_repo_info(user_query)

        # Step 2: Get detailed data for each issue
        enriched_issues = []
        for url in issue_urls:
            detail = fetch_issue_data(url)
            if 'error' not in detail:
                enriched_issues.append(detail)

        return jsonify({"query": user_query, "issues": enriched_issues})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=3000)





# from flask import Flask, jsonify, request
# from flask_cors import CORS

# from FetchUserQueryIssues import main as fetch_issues_main
# from PostIssueDetails import fetch_issue_data

# app = Flask(__name__)
# CORS(app)

# @app.route('/login_cred', methods=['POST'])
# def login_cred():
#     data = request.get_json()
#     username = data.get('username')
#     if not username:
#         return jsonify({'error': 'Username not provided'}), 400

#     from GetUserData import extract_user_data
#     user_data = extract_user_data(username)
#     if user_data:
#         return jsonify(user_data)
#     else:
#         return jsonify({'error': 'Unable to fetch user data'}), 400


# @app.route('/fetch_combined_data', methods=['POST'])
# def fetch_combined_data():
#     data = request.get_json()
#     username = data.get('username')
#     user_input = data.get('user_input')

#     if not username or not user_input:
#         return jsonify({"error": "username or user_input missing"}), 400

#     # Step 1: Get basic issue list and user info
#     result = fetch_issues_main(user_input, username)

#     issue_urls = result.get("issues", [])
#     user_info = result.get("user_info")

#     # Step 2: For each issue URL, fetch full details
#     detailed_issues = []
#     for url in issue_urls:
#         issue_data = fetch_issue_data(url)
#         detailed_issues.append(issue_data)

#     # Step 3: Combine all in one response
#     final_result = {
#         "user_info": user_info,
#         "issues": detailed_issues
#     }

#     return jsonify(final_result)


# if __name__ == '__main__':
#     app.run(debug=True, port=3000)



# from flask import Flask,jsonify,request
# from flask_cors import CORS
# import requests
# from GetUserData import extract_user_data 
# app = Flask(__name__)
# CORS(app)
# @app.route('/login_cred', methods=['GET', 'POST'])
# def login_cred():
#     if request.method == 'POST':
#         data = request.get_json()
#         username = data.get('username')
#         if not username:
#             return jsonify({'error': 'Username not provided'}), 400

#         # Fetch user data from GitHub API
#     user_data=extract_user_data(username)
#     if user_data:
#         return jsonify(user_data)
#     else:
#          return jsonify({'error': 'Cant able fetch user data'}), 400

# if __name__ == '__main__':
#     app.run(debug=True,port=3000)
