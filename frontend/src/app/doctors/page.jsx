"use client";

import { useEffect, useState } from "react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_age: "",
    sex: "",
    reason: "",
    visit_time: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch all doctors
  useEffect(() => {
    fetch("http://localhost:8000/doctors/doctors/") // Django endpoint
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching doctors: ${text}`);
        }
        return res.json();
      })
      .then((data) => setDoctors(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMakeAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setFormVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      alert("Please select a doctor first!");
      return;
    }
    setLoading(true);

    try {
      // 1️⃣ Create Appointment
      const createRes = await fetch(
        `http://localhost:8000/doctors/doctors/${selectedDoctor.id}/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const createData = await createRes.json();
      const appointmentId = createData.appointment_id;

      // 2️⃣ Create Stripe Checkout Session
      const checkoutRes = await fetch(
        "http://localhost:8000/doctors/stripe/create-checkout-session/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointment_id: appointmentId }),
        }
      );
      const checkoutData = await checkoutRes.json();

      // 3️⃣ Redirect to Stripe Checkout
      window.location.href = checkoutData.checkout_url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Book a Doctor Appointment
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {doctors.map((doc) => (
          <div
            key={doc.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Doctor Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <img
                src={doc.image || "/default-doctor.jpg"} // default if no image
                alt={doc.name}
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{doc.name}</h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                  {doc.qualifications}
                </p>
              </div>
            </div>

            {/* Fees + Button */}
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>$50</p>
              <button
                onClick={() => handleMakeAppointment(doc)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6772e5",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Make Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Form */}
      {formVisible && selectedDoctor && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Appointment Details for {selectedDoctor.name}</h2>

          <input
            type="text"
            name="patient_name"
            placeholder="Your Name"
            value={formData.patient_name}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <input
            type="number"
            name="patient_age"
            placeholder="Your Age"
            value={formData.patient_age}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="reason"
            placeholder="Reason for visit"
            value={formData.reason}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <input
            type="datetime-local"
            name="visit_time"
            value={formData.visit_time}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "10px", width: "100%" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6772e5",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : "Book & Pay $50"}
          </button>
        </form>
      )}
    </div>
  );
}
