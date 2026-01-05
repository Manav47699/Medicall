from fastapi import APIRouter
from tts.kitten_tts import generate_kitten_audio
from tts.pyttsx3_tts import generate_pyttsx3_audio

router = APIRouter()

@router.post("/tts")
async def text_to_speech(text: str, engine: str = "kitten"):
    try:
        if engine == "kitten":
            audio = generate_kitten_audio(text)
        else:
            audio = generate_pyttsx3_audio(text)
    except:
        audio = generate_pyttsx3_audio(text)

    return {"audio_url": f"/static/audio/{audio}"}
