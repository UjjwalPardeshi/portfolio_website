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

Analyze the following foods from a comprehensive Ayurvedic nutrition perspective Provide a detailed report for each food item including

Dosha impact Identify which dosha or doshas Vata, Pitta, Kapha the food balances or aggravates and explain its effect on each dosha

Taste (Rasa) Describe the primary and secondary tastes of the food and their influence on dosha balance

Energy (Virya) Specify whether the food has a heating or cooling effect on the body

Post digestive effect (Vipaka) Explain the long term digestive outcome and how it affects metabolism

Influence on digestion (Agni) Detail how the food affects digestive fire strength and metabolic processes

Therapeutic benefits Mention healing properties nutritional support and any specific health conditions the food aids

Contraindications Discuss any dosha imbalances health conditions or situations where the food should be avoided or consumed in moderation

Usage recommendations Provide practical guidelines on how to prepare consume and include this food in daily diet for optimal dosha balance and wellbeing

Food list

<profile_prompt>

Please give a clear detailed and actionable Ayurvedic analysis for each listed food item using the bolded Ayurvedic terms for clarity
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
