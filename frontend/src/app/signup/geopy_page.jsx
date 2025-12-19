"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState(""); // new optional city field
  const [shareLocation, setShareLocation] = useState(false);

  // Geolocation
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [message, setMessage] = useState("");

  // Force fresh location every time
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        console.log(
          "High-accuracy coordinates:",
          position.coords.latitude,
          position.coords.longitude,
          "Accuracy (m):",
          position.coords.accuracy
        );
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Could not get your precise location. Please enable GPS and allow location access."
        );
      },
      {
        enableHighAccuracy: true, // use GPS if available
        timeout: 10000,           // wait max 10 seconds
        maximumAge: 0,            // do not use cached coordinates
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("phone_number", phoneNumber);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("city", city); // send city to backend
    formData.append("share_location_for_blood", shareLocation);

    if (latitude !== null) formData.append("latitude", latitude.toFixed(6));
    if (longitude !== null) formData.append("longitude", longitude.toFixed(6));

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
        setMessage("Signup successful! Redirecting to posts...");
        router.push("/posts");
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
          placeholder="City (for location fallback)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
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
