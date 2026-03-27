import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import { useRef } from "react";
import OrderPaymentSummary from "../components/user/OrderPaymentSummary";
import { serverUrl } from "../App";



// Recenter component
const RecenterMap = ({ location }) => {
  const map = useMap();

  if (location?.lat && location?.lon) {
    map.setView([location.lat, location.lon], 16, {
      animate: true,
    });
  }

  return null;
};



const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
const latestRequest = useRef(0);
const isFirstLoad = useRef(true);
const isUserTyping = useRef(false);


  const { location, address } = useSelector((state) => state.map);

  const [search, setSearch] = useState(address || "");

  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  // 🔁 Sync Redux address → input
  useEffect(() => {

  // only update search if user is NOT typing
  if (!isUserTyping.current) {
    setSearch(address || "");
  }

}, [address]);

  const getCurrentLocation = () =>{
      navigator.geolocation.getCurrentPosition(async (position) => {
      console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({
        lat:latitude,
        lon: longitude,
      }));

      // ✅ update input immediately
      setSearch(address);

      // ❗ prevent debounce from triggering
      isUserTyping.current = false;
    });
         
  }




  // 🔁 Drag → Reverse Geocoding
  const handleDragEnd = async (e) => {
    const { lat, lng } = e.target.getLatLng();

    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );

      const newAddress = res?.data?.results?.[0]?.address_line2;

      dispatch(
        setLocation({
          lat,
          lon: lng,
          address: newAddress,
        })
      );

      setSearch(newAddress || "");
    } catch (error) {
      console.log(error);
    }
  };

  

  // ⌨️ Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
useEffect(() => {

  // ❌ only run if user actually typed
  if (!isUserTyping.current) return;

  if (!search || search.trim().length < 3) return;

  const currentRequest = ++latestRequest.current;

  const delay = setTimeout(async () => {

    try {

      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(search)}&apiKey=${apiKey}`
      );

      if (currentRequest !== latestRequest.current) return;

      const result = res?.data?.features?.[0]?.properties;
      if (!result) return;

      dispatch(setLocation({
        lat: result.lat,
        lon: result.lon,
        address: result.address_line2 || result.formatted
      }));

    } catch (error) {
      console.log(error);
    }

  }, 600);

  return () => clearTimeout(delay);

}, [search]);

  // Safety check
  if (!location?.lat || !location?.lon) {
    return <div className="p-10 text-center">Loading Map...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      {/* Header */}
      <div className="relative mb-6">

        <button
          onClick={() => navigate("/")}
          className="absolute left-0 text-blue-600 text-sm hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-center text-2xl font-semibold">
          Checkout
        </h1>

      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-4 flex gap-2">

        <input
          type="text"
          value={search}
          onChange={(e) => {
  isUserTyping.current = true;
  setSearch(e.target.value);
}}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="w-full p-3 border rounded-lg"
        />

        {/* <button
          onClick={handleSearch}
          className="bg-orange-500 text-white px-4 rounded-lg"
        >
          Search
        </button> */}
        <button onClick={getCurrentLocation}>
            Location
        </button>

      </div>

      {/* Map */}
      <div className="max-w-2xl mx-auto h-[300px] overflow-hidden rounded-xl shadow-md">

        <MapContainer
          center={[location.lat, location.lon]}
          zoom={16}
          className="w-full h-full"
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap location={location} />

          <Marker
            position={[location.lat, location.lon]}
            draggable={true}
            eventHandlers={{
              dragend: handleDragEnd,
            }}
          />

        </MapContainer>

      </div>
      <OrderPaymentSummary address = {address} lat = {location.lat} lon = {location.lon} ></OrderPaymentSummary>

    </div>
  );
};

export default Checkout;