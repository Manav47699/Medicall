"use client";
import { useState, useRef, useEffect } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState('global');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    photo: null,
    scope: "local",
    group: "",
  });

  const tabs = [
    { id: 'global', label: 'Global Feed' },
    { id: 'your', label: 'Your Feed' },
    { id: 'ai', label: 'Dr AI' },
    { id: 'doctors', label: 'Our Doctors' },
    { id: 'shop', label: 'Shop' },
    { id: 'groups', label: 'Groups' }
  ];

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

  // Fetch groups
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

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isDragging) return;

    const scroll = () => {
      if (container && !isDragging) {
        container.scrollLeft += 0.5;
        
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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

  const handleCreatePost = async () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Home Feed</h1>
            <p className="text-gray-600">Welcome to your community</p>
          </div>
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
        {user && (
          <div className="mt-3 text-sm text-gray-600">
            Logged in as: <span className="font-semibold">{user.username}</span>
          </div>
        )}
      </div>

      {/* Sliding Navigation Bar */}
      <div className="bg-white shadow-lg mt-4 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex gap-2 p-4">
            {[...tabs, ...tabs, ...tabs].map((tab, index) => (
              <button
                key={`${tab.id}-${index}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0
                  ${activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 max-w-3xl mx-auto">
        {/* Create Post Button */}
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full mb-6 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            {showForm ? "Cancel" : "✏️ Create New Post"}
          </button>
        )}

        {/* Create Post Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Post</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newPost.description}
                  onChange={(e) =>
                    setNewPost({ ...newPost, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope
                </label>
                <select
                  value={newPost.scope}
                  onChange={(e) => setNewPost({ ...newPost, scope: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="local">Local</option>
                  <option value="global">Global</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group (optional)
                </label>
                <select
                  value={newPost.group}
                  onChange={(e) => setNewPost({ ...newPost, group: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">No group</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPost({ ...newPost, photo: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Posted by {post.user?.username || 'Unknown'} • {post.scope}
                  </p>
                  <p className="text-gray-800">{post.description}</p>
                  {post.photo && (
                    <img
                      src={`http://127.0.0.1:8000${post.photo}`}
                      alt="Post"
                      className="mt-4 rounded-lg max-w-full h-auto"
                    />
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    👍 Upvote ({post.upvotes_count || 0})
                  </button>

                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    💬 Comments ({post.comments_count || 0})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}