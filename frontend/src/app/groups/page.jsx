"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('groups');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  // Toggle & form state
  const [showForm, setShowForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: 'global', label: 'Global Feed' },
    { id: 'your', label: 'Your Feed' },
    { id: 'ai', label: 'Dr AI' },
    { id: 'doctors', label: 'Our Doctors' },
    { id: 'shop', label: 'Shop' },
    { id: 'groups', label: 'Groups' }
  ];

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
    fetchGroups();
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/global_posts";
  };

  const handleBack = () => {
    router.back();
  };

  // Join group
  const handleJoinGroup = async (groupId) => {
    if (!user) return alert("You must be logged in to join a group");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/groups/${groupId}/join/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Joined group!");
        fetchGroups();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate to posts
  const goToGroupPosts = (groupId) => {
    router.push(`/posts/group/${groupId}`);
  };

  // Create Group
  const handleCreateGroup = async () => {
    if (!user) {
      alert("You must be logged in to create a group");
      return;
    }

    if (!newGroup.name || !newGroup.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/groups/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroup),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Group created!");
        setNewGroup({ name: "", description: "" });
        setShowForm(false);
        fetchGroups();
      } else {
        alert(data.error || "Failed to create group");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
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

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex-1 flex justify-start">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                  ← Back
                </button>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Community Groups
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
              Join communities and connect with people who share your interests
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
          {/* Create Group Button */}
          {user && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl font-medium"
              >
                {showForm ? '✕ Cancel' : '➕ Create New Group'}
              </button>
            </div>
          )}

          {/* Inline Create Group Form */}
          {showForm && (
            <div className="bg-white/90 backdrop-blur-md border-2 border-red-200 rounded-2xl p-6 shadow-xl mb-6">
              <h3 className="text-2xl font-bold text-red-600 mb-6">Create a New Group</h3>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-red-100 rounded-xl focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="Enter group name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-red-100 rounded-xl focus:border-red-400 focus:outline-none transition-colors"
                  placeholder="Describe your group"
                />
              </div>

              <button
                onClick={handleCreateGroup}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl font-medium"
              >
                ✨ Create Group
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 border-2 border-red-200 rounded-2xl focus:border-red-400 focus:outline-none transition-colors shadow-md bg-white/90 backdrop-blur-md"
                placeholder="🔍 Search groups by name or description..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-xl font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Groups List */}
          {filteredGroups.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg">
              <p className="text-gray-500 text-lg">
                {searchQuery ? "No groups match your search." : "No groups yet. Be the first to create one!"}
              </p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white/90 backdrop-blur-md border-2 border-red-100 rounded-2xl p-6 shadow-lg mb-6 hover:shadow-xl transition-all duration-300"
              >
                <h3
                  onClick={() => goToGroupPosts(group.id)}
                  className="text-2xl font-bold text-red-600 cursor-pointer hover:text-rose-600 transition-colors mb-3"
                >
                  {group.name}
                </h3>

                <p className="text-gray-700 text-lg leading-relaxed mb-4">{group.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-red-100">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">👥 {group.members?.length || 0} Members</span>
                  </div>

                  {user && (
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-medium"
                    >
                      ➕ Join Group
                    </button>
                  )}
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