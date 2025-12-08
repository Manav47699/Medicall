"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CommentsPage() {
  const router = useRouter();
  const { postId } = useParams(); // get postId from URL
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  // Fetch comments for this post
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/posts/${postId}/comments/`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!user) return alert("You must be logged in to comment");
    if (!newComment.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/posts/comment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          post_id: postId,
          text: newComment,
        }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments(); // refresh comments
      } else {
        const data = await res.json();
        alert(data.error || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
      <h2>Comments</h2>
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: 20,
          padding: "6px 12px",
          background: "#ccc",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        ← Back to posts
      </button>

      {user ? (
        <div style={{ marginBottom: 20 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{ width: "100%", padding: 10, borderRadius: 5 }}
          />
          <button
            onClick={handleAddComment}
            style={{
              marginTop: 10,
              padding: "6px 12px",
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p>You must be logged in to comment.</p>
      )}

      <hr />

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <p>
              <b>{comment.user}</b>: {comment.text}
            </p>
            <p style={{ fontSize: "0.8rem", color: "#555" }}>
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
