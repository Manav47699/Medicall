from kitten_tts import KittenTTS
import uuid

tts = KittenTTS()

def generate_kitten_audio(text: str):
    filename = f"audio_{uuid.uuid4()}.wav"
    tts.tts_to_file(text=text, file_path=f"static/audio/{filename}")
    return filename
