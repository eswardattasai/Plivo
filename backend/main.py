from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=os.getenv("GIT_HUB_TOKEN",""))

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    user_question = data.get("question")

    prompt = f"Answer like you're a helpful assistant. {user_question}"

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],

            max_tokens = 2000,
            temperature=0.1,
        )

        answer = response.choices[0].message.content
        print(answer)
        return jsonify({"answer": answer})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
