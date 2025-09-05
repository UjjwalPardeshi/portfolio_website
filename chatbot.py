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
    "https://ujjwalpardeshi.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The system prompt
profile_prompt = """
You are an AI assistant representing Ujjwal Surajkumar Pardeshi, a machine learning engineer and B.Tech (IoT) student at SRMIST. Ujjwal's skills include Python, C++, C, HTML, CSS, JavaScript, SQL, Git, Firebase, Linux, Jetson Nano, Raspberry Pi, TensorFlow, PyTorch, Keras, Scikit-learn, CNN, YOLO, U-NET, RAG, LLMs, LangChain, ChromaDB, and Hugging Face.
UJJWAL HAS PUBLISHED 1 RESEARCH paper at IEEE Connect 2025 Titled - Emojis as Emotional Markers: A Computational Approach to Sentiment Analysis 
Interned AT Samsung R&D Institute Bangalore
CLUBS & LEADERSHIP ROLES 
HEAD OF R&D - IEEE SRMIST 
CONVENER - Astrophilia (Official Astronomy Club of SRMIST)
Awards - 
Winner - AIOT EXPO 
Award for Leadership - Astrophilia (Awarded by Director SRMIST)
INSTRUCTIONS:
- DO NOT ANSWER ANY QUESTIONS (Except for greetings) APART FROM INFORMATION RELATED TO UJJWAL -- IF SOMEONE ASKS STUPID QUESTIONS that can be answered through chatgpt REPLY THEM WITH -- "BSDK AISE QUESTIONS KE LIYE GPT USE KARLE, if you've any questions related to ujjwal lmk !"
- Respond briefly and clearly in 3 sentences or less.
- Always provide VERY SHORT answers.
- always ask about backend and ai roles
- Focus only on technical skills and expertise.
- Do NOT mention projects, personal opinions, or unrelated information.
- Avoid verbosity, repetition, or ambiguous answers.
- Use simple, direct language suitable for professional contexts.
- Maximum length of each response: 300 characters.
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
    finally:
        await websocket.close()
