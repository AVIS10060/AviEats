import { useEffect } from "react";
import api from "../api/axios";

const useUpdateLocation = () => {
  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      try {
        const result = await api.post(
          "/user/update-location",
          { lat, lon },
          { skipGlobalLoading: true }
        );
        console.log(result.data);
      } catch (error) {
        console.error("Location update failed:", error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateLocation(
          pos.coords.latitude,   // ✅ latitude
          pos.coords.longitude   // ✅ longitude
        );
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    // cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
};

export default useUpdateLocation;
