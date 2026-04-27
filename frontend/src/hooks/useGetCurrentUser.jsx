import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  setUserLoading,
  setUserSuccess,
  setUserFailure,
} from "../redux/userSlice";
import api from "../api/axios";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // ✅ prevent state update after unmount

    const fetchUser = async () => {
      dispatch(setUserLoading());

      try {
        const response = await api.get("/user/current");

        if (!isMounted) return;

        if (!response.data || !response.data._id) {
          dispatch(setUserFailure(null));
        } else {
          dispatch(setUserSuccess(response.data));
        }

      } catch (error) {
        if (!isMounted) return;

        dispatch(setUserFailure(null));

        if (error.response?.status !== 401) {
          toast.error(error.response?.data?.message || error.message);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useGetCurrentUser;
