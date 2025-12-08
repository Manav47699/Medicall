from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import pandas as pd
from pathlib import Path

# -------------------------
# PATHS
# -------------------------
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "instructions_one.csv"
DB_DIR = BASE_DIR / "vectorstore"
COLLECTION_NAME = "instructions_one"

# -------------------------
# EMBEDDINGS MODEL
# -------------------------
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

# -------------------------
# CHECK IF DB EXISTS
# -------------------------
add_documents = not DB_DIR.exists()

documents = []
ids = []

if add_documents:
    # Load CSV
    df = pd.read_csv(DATA_PATH)

    for i, row in df.iterrows():
        title = str(row.get("title", ""))
        content = str(row.get("content", ""))
        doc_id = str(row.get("id", i))

        text = (title + " " + content).strip()

        if not text:
            continue

        documents.append(
            Document(
                page_content=text,
                metadata={"title": title},
                id=doc_id
            )
        )
        ids.append(doc_id)

# -------------------------
# VECTOR STORE
# -------------------------
vector_store = Chroma(
    collection_name=COLLECTION_NAME,
    persist_directory=str(DB_DIR),
    embedding_function=embeddings
)

# Add documents only once
if add_documents and documents:
    vector_store.add_documents(documents=documents, ids=ids)

# -------------------------
# RETRIEVER
# -------------------------
retriever = vector_store.as_retriever(
    search_kwargs={"k": 5}
)

# -------------------------
# Helper: return combined text
# -------------------------
def get_relevant_context(query: str) -> str:
    # NEW LangChain API (fast + stable)
    results = retriever.invoke(query)

    return "\n\n".join([doc.page_content for doc in results])
