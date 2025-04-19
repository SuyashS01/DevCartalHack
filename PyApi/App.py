from flask import Flask,jsonify,request
from flask_cors import CORS
import requests
from GetUserData import extract_user_data 
app = Flask(__name__)
CORS(app)
@app.route('/login_cred', methods=['GET', 'POST'])
def login_cred():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        if not username:
            return jsonify({'error': 'Username not provided'}), 400

        # Fetch user data from GitHub API
    user_data=extract_user_data(username)
    if user_data:
        return jsonify(user_data)
    else:
         return jsonify({'error': 'Cant able fetch user data'}), 400

    

if __name__ == '__main__':
    app.run(debug=True,port=3000)
