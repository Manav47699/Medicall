"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [shareLocation, setShareLocation] = useState(false);

  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("phone_number", phoneNumber);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("city", city);
    formData.append("share_location_for_blood", shareLocation);

    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/signup/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.id, username: data.username })
        );
        setMessage("Signup successful! Redirecting...");
        router.push("/posts"); // or wherever you want to redirect
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
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <input
          type="text"
          placeholder="City (for blood donation location)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required={shareLocation} // only required if user opts in
        />
        <label>
          <input
            type="checkbox"
            checked={shareLocation}
            onChange={(e) => setShareLocation(e.target.checked)}
          />{" "}
          Share my location for blood donation
        </label>
        <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
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
