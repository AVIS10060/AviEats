import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentCity,
  setCurrentAddress,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

const useGetCity = () => {
  const dispatch = useDispatch();
  const apikey = import.meta.env.VITE_GEOAPIKEY;
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        dispatch(setLocation({ lat: latitude, lon: longitude }));

        try {
          const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`,
          )
          dispatch(setCurrentCity(response?.data?.results?.[0]?.city))
          dispatch(setCurrentState(response?.data?.results?.[0]?.state))
          dispatch(setCurrentAddress(response?.data?.results?.[0]?.address_line1))
          dispatch(setAddress(response?.data?.results?.[0]?.address_line2))
        } catch (error) {
          console.error(error)
        }
      },
      (error) => {
        console.error(error)
      },
    )
  }, [userData, apikey, dispatch])

  return null
};

export default useGetCity;
