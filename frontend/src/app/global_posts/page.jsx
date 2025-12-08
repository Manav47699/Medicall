"use client";
import { useEffect, useState, useRef } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('global');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const [user, setUser] = useState(null);

  const tabs = [
    { id: 'global', label: 'Global Feed' },
    { id: 'your', label: 'Your Feed' },
    { id: 'ai', label: 'Dr AI' },
    { id: 'doctors', label: 'Our Doctors' },
    { id: 'shop', label: 'Shop' },
    { id: 'groups', label: 'Groups' }
  ];

  // Fetch posts from Django
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/global_posts/");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/global_posts";
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
    window.location.href = `/posts/${postId}/comments`;
  };

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-red-50 to-pink-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b-4 border-red-500">
          <div className="max-w-4xl mx-auto px-6 py-8 text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1"></div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Global Posts
              </h1>
              <div className="flex-1 flex justify-end">
                {user && (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Discover posts from the community around the world
            </p>
          </div>
        </div>

        {/* Sliding Navigation Bar */}
        <div className="bg-white/90 backdrop-blur-md shadow-xl mt-2 overflow-hidden border-y-2 border-red-100">
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
            <div className="flex gap-3 p-5">
              {[...tabs, ...tabs, ...tabs].map((tab, index) => (
                <button
                  key={`${tab.id}-${index}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-8 py-3 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0 font-medium shadow-md
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-xl scale-110 shadow-red-300' 
                      : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Posts List */}
          {posts.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg">
              <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/90 backdrop-blur-md border-2 border-red-100 rounded-2xl p-6 shadow-lg mb-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {post.user_profile_pic ? (
                        <img 
                          src={post.user_profile_pic} 
                          alt={post.user}
                          className="w-10 h-10 rounded-full object-cover border-2 border-red-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-600 font-semibold">
                          {post.user_name ? post.user_name[0].toUpperCase() : 'A'}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-red-600">{post.user || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed">{post.description}</p>
                  {post.photo && (
                    <img 
                      src={`http://127.0.0.1:8000${post.photo}`} 
                      alt="Post" 
                      className="mt-4 rounded-xl w-full object-cover max-h-96 shadow-md"
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-red-100">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-medium"
                  >
                    👍 Upvote ({post.upvotes_count || 0})
                  </button>

                  <button
                    onClick={() => goToComments(post.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-medium"
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
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}