"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "../../components/PostCard";

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);

  // NEW: state for inline post creation
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    photo: null,
    scope: "local",
    group: "",
  });

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/posts/");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch groups for selection
  const fetchGroups = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/groups/");
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchGroups();
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/global_posts");
  };

  const handleUpvote = async (postId) => {
    if (!user) return alert("You must be logged in to upvote");

    try {
      const res = await fetch("http://127.0.0.1:8000/posts/upvote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, post_id: postId }),
      });

      if (res.ok) fetchPosts();
      else {
        const data = await res.json();
        alert(data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goToComments = (postId) => {
    router.push(`/posts/${postId}/comments`);
  };

  // CREATE POST HANDLER
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to create a post");

    try {
      const formData = new FormData();
      formData.append("description", newPost.description);
      if (newPost.photo) formData.append("photo", newPost.photo);
      formData.append("scope", newPost.scope);
      if (newPost.group) formData.append("group", newPost.group);
      formData.append("user", user.id);

      const res = await fetch("http://127.0.0.1:8000/posts/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Post created!");
        setNewPost({ description: "", photo: null, scope: "local", group: "" });
        setShowForm(false);
        fetchPosts();
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          padding: "10px 0",
        }}
      >
        <h1>All Posts</h1>
        {user && (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>

      {user ? (
        <div style={{ marginBottom: 20 }}>
          Logged in as: <b>{user.username}</b>
        </div>
      ) : (
        <p>You are not logged in</p>
      )}

      <hr />

      {/* CREATE NEW POST BUTTON */}
      {user && (
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "8px 12px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            margin: "20px 0",
          }}
        >
          {showForm ? "Cancel" : "Create New Post"}
        </button>
      )}

      {/* INLINE CREATE POST FORM */}
      {showForm && (
        <form
          onSubmit={handleCreatePost}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <h3>Create Post</h3>

          <label>Description</label>
          <textarea
            value={newPost.description}
            onChange={(e) =>
              setNewPost({ ...newPost, description: e.target.value })
            }
            required
            style={{
              width: "100%",
              padding: 8,
              marginTop: 5,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #999",
            }}
          />

          <label>Scope</label>
          <select
            value={newPost.scope}
            onChange={(e) => setNewPost({ ...newPost, scope: e.target.value })}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 5,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #999",
            }}
          >
            <option value="local">Local</option>
            <option value="global">Global</option>
          </select>

          <label>Group (optional)</label>
          <select
            value={newPost.group}
            onChange={(e) => setNewPost({ ...newPost, group: e.target.value })}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 5,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #999",
            }}
          >
            <option value="">No group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <label>Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPost({ ...newPost, photo: e.target.files[0] })}
            style={{ marginBottom: 15 }}
          />

          <button
            type="submit"
            style={{
              padding: "8px 14px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Post
          </button>
        </form>
      )}

      {/* POSTS LIST */}
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <PostCard post={post} />

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
