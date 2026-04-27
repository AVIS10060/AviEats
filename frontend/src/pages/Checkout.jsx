import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import axios from "axios"
import "leaflet/dist/leaflet.css"
import { setLocation } from "../redux/mapSlice"
import OrderPaymentSummary from "../components/user/OrderPaymentSummary"
import { Skeleton } from "boneyard-js/react"
import { CheckoutFallback } from "../components/skeletons"
import toast from "react-hot-toast"



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
const isUserTyping = useRef(false);


  const { location, address } = useSelector((state) => state.map);
  const { userData } = useSelector((state) => state.user);

  const [search, setSearch] = useState(address || "");

  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  // 🔁 Sync Redux address → input
  useEffect(() => {
    const syncSearchInput = () => {
      if (!isUserTyping.current) {
        setSearch(address || "")
      }
    }

    syncSearchInput()
  }, [address])

  const getCurrentLocation = () =>{
      
      const latitude = userData.location.coordinates[1];
      const longitude = userData.location.coordinates[0];
      dispatch(setLocation({
        lat:latitude,
        lon: longitude,
      }));

      // ✅ update input immediately
      setSearch(address);

      // ❗ prevent debounce from triggering
      isUserTyping.current = false;
    
         
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
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to fetch address for location')
    }
  };

  

  // ⌨️ Enter key support
  const handleSearch = async () => {
    if (!search || search.trim().length < 3) {
      toast.error('Type at least 3 characters to search')
      return
    }

    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(search)}&apiKey=${apiKey}`,
      )

      const result = res?.data?.features?.[0]?.properties
      if (!result) {
        toast.error('No address found for that search')
        return
      }

      dispatch(
        setLocation({
          lat: result.lat,
          lon: result.lon,
          address: result.address_line2 || result.formatted,
        }),
      )
      setSearch(result.address_line2 || result.formatted)
      isUserTyping.current = false
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Address search failed')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

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
      console.error(error)
      toast.error(error.response?.data?.message || 'Address search failed')
    }

  }, 600);

  return () => clearTimeout(delay);

}, [search, dispatch, apiKey]);

  // Safety check
  if (!location?.lat || !location?.lon) {
    return (
      <Skeleton
        name="checkout-page"
        loading
        fallback={<CheckoutFallback />}
        fixture={<CheckoutFallback />}
        animate="shimmer"
        snapshotConfig={{ excludeSelectors: [".leaflet-container"] }}
      >
        <CheckoutFallback />
      </Skeleton>
    );
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

        <button
          type="button"
          onClick={handleSearch}
          className="bg-orange-500 text-white px-4 rounded-lg"
        >
          Search
        </button>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-gray-200 text-gray-700 px-4 rounded-lg"
        >
          Use current location
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
