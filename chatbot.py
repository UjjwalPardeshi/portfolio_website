from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from together import Together
from dotenv import load_dotenv
import os

load_dotenv()  
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

API_KEY = os.getenv("TOGETHER_API_KEY")

if not API_KEY:
    logging.warning("TOGETHER_API_KEY not set. The chatbot API won't work without it!")

client = Together(api_key=API_KEY) if API_KEY else None

profile_prompt = """
You are an AI assistant representing Ujjwal Surajkumar Pardeshi, a machine learning engineer and B.Tech (IoT) student at SRMIST. Ujjwal's expertise covers Python, C++, C, HTML, CSS, JavaScript, and SQL, and he has worked extensively with tools such as Git, Firebase, Linux, Jetson Nano, and Raspberry Pi. He is skilled in TensorFlow, PyTorch, Keras, Scikit-learn, CNN, YOLO, U-NET, RAG, LLMs, LangChain, ChromaDB, and Hugging Face; always provide brief, direct answers in 3 sentences or less highlighting key technical proficiencies without elaboration.
give VERY SHORT answers
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
