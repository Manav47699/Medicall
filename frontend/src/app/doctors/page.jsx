"use client";

import { useEffect, useState } from "react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    const res = await fetch("http://127.0.0.1:8000/doctors/");
    const data = await res.json();
    setDoctors(data);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h1>Doctors</h1>

      {doctors.map((doc) => (
        <div
          key={doc.id}
          style={{
            border: "1px solid #ddd",
            margin: "16px 0",
            padding: "16px",
            borderRadius: "10px",
          }}
        >
          <h2>{doc.doctor_name}</h2>

          {/* FIXED IMAGE URL */}
          <img
            src={doc.photo}
            width="200"
            style={{ borderRadius: "8px" }}
          />

          <p><strong>Qualifications:</strong> {doc.qualifications}</p>

          <h4>Certificates:</h4>

          {doc.certificates.length === 0 && <p>No certificates uploaded.</p>}

          {doc.certificates.map((c) => (
            <img
              key={c.id}
              src={c.certificate}
              width="150"
              style={{ margin: "5px", borderRadius: "5px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}


