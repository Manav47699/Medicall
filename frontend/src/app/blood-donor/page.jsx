"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

/* -------- DYNAMIC LEAFLET IMPORTS -------- */
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

/* -------- DISTANCE FUNCTION -------- */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function BloodDonorMap() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentCity, setCurrentCity] = useState("Your area");

  /* -------- FETCH DONORS AND CURRENT USER -------- */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    fetch("http://127.0.0.1:8000/accounts/blood-donors/")
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);

        // Filter backend donors to get the current user's data
        const currentBackendUser = data.find(
          (d) => d.username === parsedUser.username
        );

        if (currentBackendUser) {
          setCurrentLocation({
            latitude: currentBackendUser.latitude,
            longitude: currentBackendUser.longitude,
          });
          setCurrentCity(currentBackendUser.city || "Your area");
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* -------- LEAFLET ICON FIX -------- */
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

  /* -------- LOGOUT -------- */
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/global_posts";
  };

  /* -------- USER COORDINATES -------- */
  const userLat = currentLocation?.latitude || 26.8129;
  const userLng = currentLocation?.longitude || 87.2840;

  /* -------- DONORS WITH DISTANCE -------- */
  const donorsWithDistance = donors.map((d) => ({
    ...d,
    distance: getDistanceKm(userLat, userLng, d.latitude, d.longitude),
  }));

  const cityDonors = donorsWithDistance.filter((d) => d.city === currentCity);
  const nearestDonors = [...donorsWithDistance]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading donors...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-96 bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto border-r-4 border-red-200 p-6">
        {user && (
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-red-600">
              Hello, {user.username}
            </h2>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-600 mb-3">
            Donors in {currentCity} (your city)
          </h3>
          {cityDonors.length === 0 ? (
            <p className="text-gray-600">No donors found in your city.</p>
          ) : (
            cityDonors.map((d) => (
              <div
                key={d.id}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-3"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-red-700">{d.username}</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {d.blood_group || "N/A"}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <p>Age: {d.age ?? "N/A"}</p>
                  <p>Gender: {d.gender || "N/A"}</p>
                  <p>📞 {d.phone || "N/A"}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-rose-600 mb-3">
            Nearest Donors (from {currentCity})
          </h3>
          {nearestDonors.map((d) => (
            <div
              key={d.id}
              className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-3"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-rose-700">{d.username}</span>
                <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                  {d.blood_group || "N/A"}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                <p>City: {d.city}</p>
                <p>Distance: {d.distance.toFixed(1)} km</p>
                <p>📞 {d.phone || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={[userLat, userLng]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
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
                <div>
                  <h4 className="font-bold text-red-600">{donor.username}</h4>
                  <p>City: {donor.city}</p>
                  <p>Blood Group: {donor.blood_group || "N/A"}</p>
                  <p>Age: {donor.age ?? "N/A"}</p>
                  <p>Gender: {donor.gender || "N/A"}</p>
                  <p>📞 {donor.phone || "N/A"}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
