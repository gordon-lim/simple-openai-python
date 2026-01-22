from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from openai import OpenAI
import os
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='public')
CORS(app)

# Serve static files from public directory
app.static_url_path = ''
app.static_folder = 'public'

PORT = int(os.getenv('PORT', 3003))

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Store conversation history in memory (in production, use a database)
conversations = {}

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message')
        conversation_id = data.get('conversationId')

        if not message:
            return jsonify({'error': 'Message is required'}), 400

        # Get or create conversation history
        conversation_id_to_use = conversation_id or f'conv_{int(time.time() * 1000)}'
        messages = conversations.get(conversation_id_to_use, [])

        # Add user message to history
        messages.append({'role': 'user', 'content': message})

        # Generate response using OpenAI
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=messages
        )

        assistant_message = response.choices[0].message.content

        # Add assistant response to history
        messages.append({'role': 'assistant', 'content': assistant_message})

        # Store updated conversation
        conversations[conversation_id_to_use] = messages

        return jsonify({
            'response': assistant_message,
            'conversationId': conversation_id_to_use
        })
    except Exception as error:
        print(f'Error: {error}')
        error_message = str(error) if isinstance(error, Exception) else 'Failed to generate response'
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    print(f'Server running on http://localhost:{PORT}')
    app.run(port=PORT, debug=True)
