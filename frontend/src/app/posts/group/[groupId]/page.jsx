"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function GroupPostsPage() {
  const router = useRouter();
  const { groupId } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch posts belonging to this group
  const fetchGroupPosts = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/posts/group/${groupId}/`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGroupPosts();
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, [groupId]);

  const handleUpvote = async (postId) => {
    if (!user) return alert("Login to upvote!");
    try {
      const res = await fetch(`http://127.0.0.1:8000/posts/upvote/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, post_id: postId }),
      });
      if (res.ok) fetchGroupPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const goToComments = (postId) => router.push(`/posts/${postId}/comments`);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
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
        ← Back to groups
      </button>

      <h1>Group Posts</h1>

      {posts.length === 0 ? (
        <p>No posts in this group yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 15,
              marginBottom: 20,
            }}
          >
            {/* Post content */}
            <p>
              <b>{post.user}</b>
            </p>
            <p>{post.description}</p>
            {post.photo && (
              <img
                src={post.photo}
                alt="post"
                style={{ width: "100%", borderRadius: 5, marginTop: 10 }}
              />
            )}

            {/* Upvote + Comments buttons */}
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button
                onClick={() => handleUpvote(post.id)}
                style={{
                  padding: "6px 12px",
                  background: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                👍 Upvote ({post.upvotes_count})
              </button>

              <button
                onClick={() => goToComments(post.id)}
                style={{
                  padding: "6px 12px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                💬 Comments ({post.comments_count})
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
