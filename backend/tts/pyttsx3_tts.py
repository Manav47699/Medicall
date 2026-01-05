import pyttsx3
import uuid

engine = pyttsx3.init()

def generate_pyttsx3_audio(text):
    filename = f"audio_{uuid.uuid4()}.wav"
    engine.save_to_file(text, f"static/audio/{filename}")
    engine.runAndWait()
    return filename
