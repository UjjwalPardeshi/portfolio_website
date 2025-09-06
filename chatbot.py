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



Provide a very short and concise Ayurvedic analysis of the following foods For each food item include only the key points below Use bold for Ayurvedic terms like Dosha, Vata, Pitta, Kapha, Rasa (Taste), Virya (Energy), Vipaka (Post Digestive Effect), Agni (Digestion), Therapeutic benefits, Contraindications, and Usage recommendations Avoid detailed explanations Limit to one or two sentences per category Emphasize clarity and brevity

Food list

<user_food_text>

Deliver the response as simple text Without bullet points or lists Ayurvedic terms should be clearly bolded to stand out

Example format

Food item Apples
Dosha impact balances Pitta and Kapha can aggravate Vata
Taste Rasa primarily Sweet and Astringent
Energy Virya cooling effect
Post digestive effect Vipaka sweet
Influence on digestion Agni supports gentle digestion
Therapeutic benefits aids detoxification supports heart health
Contraindications avoid raw apples for high Vata
Usage recommendations best eaten cooked with warming spices
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
