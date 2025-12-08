"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: input,
        history: messages,
      }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.answer };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
    setLoading(false);
  }

  return (
    <div className="w-full h-screen flex flex-col items-center p-6 bg-gray-100 text-black">

      <h1 className="text-3xl font-bold mb-4">Medicall Chatbot</h1>

      {/* chat window */}
      <div className="w-full max-w-xl h-[70vh] bg-white rounded-lg shadow p-4 overflow-y-auto border
                      space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed
              ${msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
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

      {/* input area */}
      <div className="w-full max-w-xl flex mt-4">
        <input
          className="flex-1 p-3 border rounded-l-lg outline-none text-black bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
