"use client";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Account created successfully!");
    } else {
      setMessage(data.error || "Signup failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username"
          onChange={handleChange}
        /><br/>

        <input 
          type="email" 
          name="email" 
          placeholder="Email"
          onChange={handleChange}
        /><br/>

        <input 
          type="password" 
          name="password" 
          placeholder="Password"
          onChange={handleChange}
        /><br/>

        <button type="submit">Sign Up</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
