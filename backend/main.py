from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

from routes.stt import router as stt_router

# Correct import for your structure
from rag.vector import get_relevant_context

app = FastAPI()

app.include_router(stt_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODEL
model = OllamaLLM(model="qwen2.5:1.5b")

# PROMPT TEMPLATE with RAG
prompt_template = ChatPromptTemplate.from_template("""
You are a helpful licensed medical assistant.
Use the following context if relevant:

Context:
{context}

User: {question}

Reply in **one or two short sentences only**.
""")

class ChatRequest(BaseModel):
    question: str

@app.get("/chat")
def chat_get():
    return {"message": "Use POST /chat with JSON body"}

@app.post("/chat")
def chat(request: ChatRequest):

    # Get RAG results
    context = get_relevant_context(request.question)

    # Build prompt
    prompt = prompt_template.format(
        question=request.question,
        context=context
    )

    # Fast blocking call
    answer = model.invoke(prompt)

    return {
        "answer": answer,
        "context_used": context  # Keep for debugging, remove later
    }
