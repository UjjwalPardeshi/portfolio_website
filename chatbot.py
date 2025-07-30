from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from together import Together
from dotenv import load_dotenv
import os

load_dotenv()  # Loads variables from .env into environment

app = FastAPI()

origins = [
    "http://localhost:5500",  # your local dev URL or used port
    "https://ujjwalpardeshi.vercel.app"  # your domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("TOGETHER_API_KEY")

if not API_KEY:
    logging.warning("TOGETHER_API_KEY not set. The chatbot API won't work without it!")

client = Together(api_key=API_KEY) if API_KEY else None

profile_prompt = """
You are a helpful assistant who knows this profile:
'Ujjwal Surajkumar Pardeshi is a machine learning engineer and researcher focusing on AI, computer vision, and more.'
Respond only based on this profile.
"""

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    history = [{"role": "system", "content": profile_prompt}]
    try:
        while True:
            try:
                message = await websocket.receive_text()
                history.append({"role": "user", "content": message})
                
                if not client:
                    await websocket.send_text("Error: API key not configured.")
                    continue
    
                response = client.chat.completions.create(
                    model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
                    messages=history
                )
                answer = response.choices[0].message.content
                history.append({"role": "assistant", "content": answer})
                await websocket.send_text(answer)
            except Exception as e:
                logging.error(f"Error in chat loop: {e}")
                await websocket.send_text("Sorry, an error occurred while processing your message.")
    except WebSocketDisconnect:
        logging.info("Client disconnected")
    except Exception as e:
        logging.error(f"Unexpected exception: {e}")
    finally:
        await websocket.close()
