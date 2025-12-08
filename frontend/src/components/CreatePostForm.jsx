"use client";

import { useState } from "react";

export default function CreatePostForm({ onPostCreated }) {
  const [user, setUser] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user", user);
    formData.append("description", description);
    formData.append("photo", photo);

    await fetch("http://127.0.0.1:8000/post_all/", {
      method: "POST",
      body: formData,
    });

    onPostCreated(); // refresh posts
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input 
        type="text"
        placeholder="Your Name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        required
      />

      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <br /><br />

      <input 
        type="file" 
        onChange={(e) => setPhoto(e.target.files[0])}
        required
      />

      <br /><br />

      <button type="submit">Create Post</button>
    </form>
  );
}
