import os
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# Load env variables
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")  # Set on Render dashboard or .env

# Initialize Gemini (Google Generative AI)
if not API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not set")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# FastAPI app setup
app = FastAPI()

origins = [
    "http://localhost:5500",
    "https://ujjwalpardeshi.vercel.app",
    "https://portfolio-website-95m0.onrender.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The system prompt
profile_prompt = """

You are the interactive portfolio assistant for Ujjwal Surajkumar Pardeshi, a Computer Science undergraduate specializing in AI/ML, deep learning, computer vision, and backend engineering. Greet every user professionally and answer their questions about Ujjwal’s background, research, technical projects, experience, and AI skills.

Share concise and accurate information based on Ujjwal’s real achievements:


If a question is outside Ujjwal’s professional background, politely mention you’re focused on his portfolio, skills, and research.

Always be friendly, helpful, and clear—make it easy for visitors to learn what makes Ujjwal stand out as an AI engineer and researcher!


"""

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        # Create Gemini chat session (history stored internally)
        chat = model.start_chat(history=[{"role": "user", "parts": [profile_prompt]}])
        while True:
            message = await websocket.receive_text()
            try:
                # Send user message to Gemini chat session
                response = chat.send_message(message)
                await websocket.send_text(response.text)
            except Exception as e:
                logging.error(f"Error in Gemini chat: {e}")
                await websocket.send_text("Sorry, an error occurred while processing your message.")
    except WebSocketDisconnect:
        logging.info("Client disconnected")
    except Exception as e:
        logging.error(f"Unexpected exception: {e}")
    
