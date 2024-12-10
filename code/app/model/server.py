# server.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import subprocess
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/messages")
async def handle_messages(request: Request):
    data = await request.json()
    current_message = data.get("currentMessage", {})
    previous_messages = data.get("previousMessages", [])

    # Extract the user query from current_message
    user_query = current_message.get("chatContent", "")

    # Call your RAG Python script here, for example using subprocess
    # assuming query_data.py takes a query as a command-line argument and prints the result.
    # Make sure query_data.py returns a JSON or a plain string that you can parse.
    result = subprocess.run(["python", "query_data.py", user_query], capture_output=True, text=True)
    if result.returncode != 0:
        return JSONResponse(status_code=500, content={"error": "Error running query script."})

    # Parse the result. If your script returns a JSON string, parse it directly.
    # If it's just a string, you can return it as is.
    response_text = result.stdout.strip()

    # Return a JSON response
    return {"response": response_text}