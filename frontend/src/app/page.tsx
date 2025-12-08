"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [userCount, setUserCount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    education: ""
  });
  const [emailStatus, setEmailStatus] = useState("");

  // Fetch total users
  const fetchUserCount = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/accounts/count/");
      const data = await res.json();
      setUserCount(data.count);
    } catch (err) {
      console.error("Failed to fetch user count", err);
    }
  };

  useEffect(() => {
    fetchUserCount();
  }, []);

  const smoothScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, age, gender, education } = formData;
    const subject = encodeURIComponent("Team Application");
    const body = encodeURIComponent(
      `Name: ${name}\nAge: ${age}\nGender: ${gender}\nEducation Level: ${education}`
    );
    window.location.href = `mailto:lack47699@gmail.com?subject=${subject}&body=${body}`;
    setEmailStatus("Opening email client...");
    setTimeout(() => {
      setFormData({ name: "", age: "", gender: "", education: "" });
      setEmailStatus("");
    }, 2000);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#2d2d2d" }}>
      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "18px 0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          zIndex: 1000
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 40px"
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#c94040" }}>
            MediPath
          </div>
          <div style={{ display: "flex", gap: "35px" }}>
            {["Sign In", "Join Our Team", "Tech Stack", "About the Developer"].map((item, i) => (
              <button
                key={i}
                onClick={() =>
                  smoothScroll(
                    item === "Sign In"
                      ? "signin"
                      : item === "Join Our Team"
                      ? "join"
                      : item === "Tech Stack"
                      ? "tech"
                      : "developer"
                  )
                }
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "#555",
                  transition: "color 0.3s ease",
                  padding: "8px 0"
                }}
                onMouseEnter={(e) => (e.target.style.color = "#c94040")}
                onMouseLeave={(e) => (e.target.style.color = "#555")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Sign In Section */}
      <section
        id="signin"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fef6f6 0%, #fff 100%)",
          padding: "120px 40px 80px"
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "600px" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              marginBottom: "16px",
              color: "#2d2d2d",
              lineHeight: "1.2"
            }}
          >
            Your All-In-One Medical Journey
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#666",
              marginBottom: "50px",
              fontWeight: "300"
            }}
          >
            Join <span style={{ fontWeight: "700", color: "#c94040" }}>{userCount}</span> others
            already on the path
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              onClick={() => router.push("/signup")}
              style={{
                padding: "16px 42px",
                fontSize: "17px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: "#c94040",
                color: "white",
                border: "none",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 14px rgba(201, 64, 64, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#b23535";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(201, 64, 64, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#c94040";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 14px rgba(201, 64, 64, 0.3)";
              }}
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push("/login")}
              style={{
                padding: "16px 42px",
                fontSize: "17px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: "white",
                color: "#c94040",
                border: "2px solid #c94040",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#c94040";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "#c94040";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section
        id="join"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: "80px 40px"
        }}
      >
        <div style={{ maxWidth: "600px", width: "100%" }}>
          <h2
            style={{
              fontSize: "42px",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#2d2d2d",
              textAlign: "center"
            }}
          >
            Join Our Team
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#666",
              marginBottom: "40px",
              textAlign: "center",
              lineHeight: "1.6"
            }}
          >
            To join us, send us an email mentioning your name, age, gender, and current education
            level.
          </p>
          <div
            style={{
              backgroundColor: "#fafafa",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleFormChange}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "18px",
                fontSize: "16px",
                border: "2px solid #e5e5e5",
                borderRadius: "8px",
                transition: "border 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c94040")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleFormChange}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "18px",
                fontSize: "16px",
                border: "2px solid #e5e5e5",
                borderRadius: "8px",
                transition: "border 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c94040")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "18px",
                fontSize: "16px",
                border: "2px solid #e5e5e5",
                borderRadius: "8px",
                transition: "border 0.3s ease",
                backgroundColor: "white",
                boxSizing: "border-box"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c94040")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="education"
              placeholder="Current Education Level"
              value={formData.education}
              onChange={handleFormChange}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "24px",
                fontSize: "16px",
                border: "2px solid #e5e5e5",
                borderRadius: "8px",
                transition: "border 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#c94040")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e5e5")}
            />
            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "17px",
                fontWeight: "600",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: "#c94040",
                color: "white",
                border: "none",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 14px rgba(201, 64, 64, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#b23535";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#c94040";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Send Application
            </button>
            {emailStatus && (
              <p style={{ marginTop: "16px", textAlign: "center", color: "#c94040" }}>
                {emailStatus}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section
        id="tech"
        style={{
          minHeight: "100vh",
          backgroundColor: "#fafafa",
          padding: "80px 40px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "42px",
              fontWeight: "700",
              marginBottom: "60px",
              color: "#2d2d2d",
              textAlign: "center"
            }}
          >
            Tech Stack
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px"
            }}
          >
            {[
              { title: "REST Framework", body: "Used as the main backend", emoji: "🔧" },
              { title: "Next.js", body: "Used as the main frontend", emoji: "⚛️" },
              { title: "FastAPI", body: "High-performance async API framework", emoji: "⚡" },
              { title: "Ollama", body: "Running local language models efficiently", emoji: "🤖" },
              { title: "LangChain", body: "Building context-aware reasoning chains", emoji: "🔗" },
              { title: "Django SQLite", body: "Default database for rapid development", emoji: "💾" },
              { title: "Django Forms", body: "Handling form validation and rendering", emoji: "📝" },
              { title: "Stripe (Test Mode)", body: "Payment processing integration", emoji: "💳" }
            ].map((tech, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  padding: "32px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  border: "1px solid #f0f0f0"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(201, 64, 64, 0.12)";
                  e.currentTarget.style.borderColor = "#c94040";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                  e.currentTarget.style.borderColor = "#f0f0f0";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontSize: "28px", marginRight: "12px" }}>{tech.emoji}</span>
                  <h3
                    style={{
                      fontSize: "22px",
                      fontWeight: "600",
                      color: "#2d2d2d",
                      margin: 0
                    }}
                  >
                    {tech.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#666",
                    lineHeight: "1.6",
                    margin: 0
                  }}
                >
                  {tech.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section
        id="developer"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: "80px 40px"
        }}
      >
        <div style={{ maxWidth: "700px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "42px",
              fontWeight: "700",
              marginBottom: "28px",
              color: "#2d2d2d"
            }}
          >
            About the Developer
          </h2>
          <p
            style={{
              fontSize: "20px",
              color: "#666",
              lineHeight: "1.8",
              marginBottom: "40px"
            }}
          >
            Hi there, I'm Manav. I built this site as my first fullstack project.
          </p>
          <a
            href="http://manavacharya.com.np/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                padding: "16px 42px",
                fontSize: "17px",
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: "#c94040",
                color: "white",
                border: "none",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 14px rgba(201, 64, 64, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#b23535";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(201, 64, 64, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#c94040";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 14px rgba(201, 64, 64, 0.3)";
              }}
            >
              View My Portfolio
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2d2d2d",
          color: "#aaa",
          textAlign: "center",
          padding: "30px 40px",
          fontSize: "14px"
        }}
      >
        <p style={{ margin: 0 }}>© 2024 MediPath. Built with care.</p>
      </footer>
    </div>
  );
}









// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function HomePage() {
//   const router = useRouter();
//   const [userCount, setUserCount] = useState(0);

//   // Fetch total users
//   const fetchUserCount = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/accounts/count/"); // we need to create this endpoint
//       const data = await res.json();
//       setUserCount(data.count);
//     } catch (err) {
//       console.error("Failed to fetch user count", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserCount();
//   }, []);

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px", fontSize: "24px" }}>
//       <p>
//         Join <b>{userCount}</b> more users on your all-in-one medical journey
//       </p>

//       <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "20px" }}>
//         <button
//           onClick={() => router.push("/signup")}
//           style={{
//             padding: "10px 20px",
//             fontSize: "18px",
//             cursor: "pointer",
//             borderRadius: "5px",
//             backgroundColor: "#4CAF50",
//             color: "white",
//             border: "none",
//           }}
//         >
//           Sign Up
//         </button>

//         <button
//           onClick={() => router.push("/login")}
//           style={{
//             padding: "10px 20px",
//             fontSize: "18px",
//             cursor: "pointer",
//             borderRadius: "5px",
//             backgroundColor: "#008CBA",
//             color: "white",
//             border: "none",
//           }}
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }
