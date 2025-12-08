from fastapi import APIRouter, UploadFile, File
import whisper
import tempfile
import os

router = APIRouter()

# Load Whisper Tiny once
model = whisper.load_model("tiny")

@router.post("/stt")
async def speech_to_text(file: UploadFile = File(...)):
    # Save uploaded audio temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Run transcription
    result = model.transcribe(tmp_path)

    # Clean up temp file
    try:
        os.remove(tmp_path)
    except:
        pass

    return {"text": result["text"]}
