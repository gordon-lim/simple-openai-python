# Simple OpenAI Python Chat

A basic chat UI using the OpenAI Python SDK.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

3. Start the server:
```bash
python server.py
```

Or for development with auto-reload (using Flask's debug mode):
```bash
python server.py
```

4. Open your browser and navigate to `http://localhost:3000`

## Features

- Simple chat interface
- Maintains conversation history within a single session
- Uses OpenAI's GPT-4o-mini model
- Clean, modern UI

## Notes

- Conversation history is stored in memory and will be lost when the server restarts
- For production use, consider using a database to persist conversations
