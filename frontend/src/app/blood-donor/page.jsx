"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

/* ---------------- DYNAMIC IMPORTS (NO SSR) ---------------- */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
/* ---------------------------------------------------------- */

/* ---------------- DISTANCE FUNCTION (Haversine formula 🌍✨) ---------------- */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
/* --------------------------------------------------- */

export default function BloodDonorMap() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);

  // TEMP: user city + coords (later from profile)
  const userCity = "Dharan";
  const userLat = 26.8129;
  const userLng = 87.2840;

  /* ---------------- FETCH DONORS ---------------- */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/accounts/blood-donors/")
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching donors:", err);
        setLoading(false);
      });
  }, []);
  /* ---------------------------------------------- */

  /* ---------------- FIX LEAFLET ICONS ---------------- */
  useEffect(() => {
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);
  /* ---------------------------------------------- */

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading map...</h2>;
  }

  const donorsWithDistance = donors.map((d) => ({
    ...d,
    distance: getDistanceKm(userLat, userLng, d.latitude, d.longitude),
  }));

  const cityDonors = donorsWithDistance.filter(
    (d) => d.city?.toLowerCase() === userCity.toLowerCase()
  );

  const nearestDonors = [...donorsWithDistance]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  const sidebarDonors = selectedCity
    ? donorsWithDistance.filter((d) => d.city === selectedCity)
    : null;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ---------------- SIDEBAR ---------------- */}
      <div
        style={{
          width: "350px",
          padding: "15px",
          background: "#f9f9f9",
          color: "#000", // 👈 BLACK TEXT FIX
          overflowY: "auto",
          borderRight: "1px solid #ddd",
        }}
      >
        {!selectedCity ? (
          <>
            <h3>Medicall users in your city ({userCity})</h3>
            {cityDonors.length === 0 && <p>No donors found.</p>}
            {cityDonors.map((d) => (
              <div key={d.id} style={{ marginBottom: "12px" }}>
                <strong>{d.username}</strong>
                <br />
                Age: {d.age ?? "N/A"} | {d.gender || "N/A"}
                <br />
                📞 {d.phone || "N/A"}
              </div>
            ))}

            <hr />

            <h3>Nearest to your city</h3>
            {nearestDonors.map((d) => (
              <div key={d.id} style={{ marginBottom: "12px" }}>
                <strong>{d.username}</strong>
                <br />
                {d.city} • {d.distance.toFixed(1)} km
                <br />
                📞 {d.phone || "N/A"}
              </div>
            ))}
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedCity(null)}
              style={{ marginBottom: "10px" }}
            >
              ← Back
            </button>
            <h3>Medicall users in {selectedCity}</h3>
            {sidebarDonors.map((d) => (
              <div key={d.id} style={{ marginBottom: "12px" }}>
                <strong>{d.username}</strong>
                <br />
                Age: {d.age ?? "N/A"}
                <br />
                Gender: {d.gender || "N/A"}
                <br />
                📞 {d.phone || "N/A"}
              </div>
            ))}
          </>
        )}
      </div>

      {/* ---------------- MAP ---------------- */}
      <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        style={{ flex: 1 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {donors.map((donor) => (
          <Marker
            key={donor.id}
            position={[donor.latitude, donor.longitude]}
          >
            <Popup>
              <strong>{donor.username}</strong>
              <br />
              City: {donor.city}
              <br />
              Age: {donor.age ?? "N/A"}
              <br />
              Gender: {donor.gender || "N/A"}
              <br />
              📞 {donor.phone || "N/A"}
              <br />
              <button
                style={{ marginTop: "5px" }}
                onClick={() => setSelectedCity(donor.city)}
              >
                View more
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
