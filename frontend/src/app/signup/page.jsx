"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("bio", bio);

    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/signup/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Store logged-in user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            username: data.username,
            profile_pic: null, // no profile pic
          })
        );

        setMessage("Signup successful! Redirecting to posts...");
        router.push("/posts"); // redirect to posts page
      } else {
        setMessage(data.error || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Signup</h1>
      <form
        onSubmit={handleSignup}
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
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <button
          type="submit"
          style={{ padding: "10px", cursor: "pointer" }}
        >
          Sign Up
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
