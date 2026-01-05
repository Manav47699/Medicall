"use client";

import { useState, useRef } from "react";

export default function ChatProPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  // 🔊 TTS STATE
  const [ttsEngine, setTtsEngine] = useState(null); // "kitten" | "pyttsx3" | null

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // -----------------------------
  // 1) TEXT CHAT SEND FUNCTION
  // -----------------------------
  async function sendMessage(text) {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8080/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: text,
        history: messages,
        tts_engine: ttsEngine, // 🔊 send selected TTS
      }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.answer };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);

    // 🔊 PLAY AUDIO IF AVAILABLE
    if (data.audio_url && ttsEngine) {
      const audio = new Audio(`http://127.0.0.1:8080${data.audio_url}`);
      audio.play().catch(() => {});
    }
  }

  // -----------------------------
  // 2) START RECORDING
  // -----------------------------
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // -----------------------------
  // 3) STOP → STT → CHAT
  // -----------------------------
  const stopRecording = () => {
    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });

        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        const response = await fetch("http://127.0.0.1:8080/stt", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        await sendMessage(data.text);
        resolve();
      };

      mediaRecorderRef.current.stop();
      setRecording(false);
    });
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-50 text-black">

      {/* HEADER */}
      <header className="w-full bg-white shadow-sm py-4 px-6 mb-4">
        <h1 className="text-2xl font-semibold text-center">
          {/* 🏥 Medical AI Assistant */} CHATBOT WITH RAG, Speech-to-text & Text-to-speech
        </h1>
        <p className="text-center text-sm text-gray-500">
          {/* Not a replacement for professional medical advice */}
        </p>
      </header>

      {/* CHAT WINDOW */}
      <div className="w-full max-w-2xl flex-1 bg-white rounded-xl shadow p-4 overflow-y-auto space-y-3 border">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-3 rounded-xl text-sm leading-relaxed
              ${msg.role === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-100 text-gray-900"
              }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 text-sm animate-pulse">
            Thinking…
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="w-full max-w-2xl flex mt-4 gap-2 px-2">
        <input
          className="flex-1 p-3 border rounded-lg outline-none bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a medical question..."
        />
        <button
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
        >
          Send
        </button>
      </div>

      {/* VOICE CONTROLS */}
      <div className="w-full max-w-2xl flex flex-wrap gap-3 mt-3 justify-center">

        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
             Use Speech instead to typing your query manually
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            ⏹ Stop & Send
          </button>
        )}

        {/* TTS BUTTONS */}
        <button
          onClick={() => setTtsEngine("kitten")}
          className={`px-5 py-2 rounded-lg border
            ${ttsEngine === "kitten"
              ? "bg-purple-600 text-white"
              : "bg-white text-black"
            }`}
        >
           Enable KittenTTS
        </button>

        <button
          onClick={() => setTtsEngine("pyttsx3")}
          className={`px-5 py-2 rounded-lg border
            ${ttsEngine === "pyttsx3"
              ? "bg-orange-600 text-white"
              : "bg-white text-black"
            }`}
        >
           Enable pyttsx3
        </button>

        <button
          onClick={() => setTtsEngine(null)}
          className="px-5 py-2 rounded-lg border bg-gray-200"
        >
          {/* 🔇 Disable TTS */} Enable conversation mode
        </button>
      </div>
    </div>
  );
}
