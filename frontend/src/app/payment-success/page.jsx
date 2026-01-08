"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorName = searchParams.get("doctor_name") || "your doctor";

  const goBack = () => {
    router.push("/feed"); // or whatever your main feed page is
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for booking your appointment.</p>

      <p style={{ marginTop: "20px" }}>
        {doctorName} has received an email about your appointment.
      </p>

      <button
        onClick={goBack}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#6772e5",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Go Back to Feed
      </button>
    </div>
  );
}
