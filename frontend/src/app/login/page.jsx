"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username,
            profile_pic: null, // no profile pic
          })
        );

        setMessage("Login successful! Redirecting to posts...");
        router.push("/posts");
      } else {
        setMessage(data.error || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{ padding: "10px", cursor: "pointer" }}
        >
          Login
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "20px", color: "red", wordBreak: "break-word" }}>
          {message}
        </p>
      )}
    </div>
  );
}
