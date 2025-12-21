"use client";

import { useState, useRef } from "react";

export default function ChatProPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

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
      }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.answer };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
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
  // 3) STOP → SEND TO /stt → THEN SEND TO CHAT
  // -----------------------------
  const stopRecording = () => {
    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        // send to STT
        const response = await fetch("http://127.0.0.1:8080/stt", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const transcribed = data.text;

        // Show the transcribed text in chat AND send it to the bot
        await sendMessage(transcribed);

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
    <div className="w-full h-screen flex flex-col items-center p-6 bg-gray-100 text-black">

      <h1 className="text-3xl font-bold mb-4">Medicall Pro Chat (Voice Enabled)</h1>

      {/* CHAT WINDOW */}
      <div className="w-full max-w-xl h-[70vh] bg-white rounded-lg shadow p-4 overflow-y-auto border 
                      space-y-3">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed
              ${msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-900"
              }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="p-2 bg-gray-300 text-gray-700 rounded-lg inline-block animate-pulse">
            Thinking…
          </div>
        )}
      </div>

      {/* TEXT INPUT + SEND */}
      <div className="w-full max-w-xl flex mt-4 gap-2">
        <input
          className="flex-1 p-3 border rounded-lg outline-none text-black bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 rounded-lg"
        >
          Send
        </button>
      </div>

      {/* VOICE BUTTONS */}
      <div className="w-full max-w-xl flex mt-3 gap-3 justify-center">

        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            ⏹ Stop & Send
          </button>
        )}
      </div>
    </div>
  );
}
