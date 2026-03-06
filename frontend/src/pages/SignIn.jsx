import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";


const SignIn = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${serverUrl}/api/auth/signin`,
        formData,
        { withCredentials: true }
      );

       dispatch(setUserData(data))

      // Optional: Navigate after success
      // navigate("/dashboard");

      // Reset form
      setFormData({
        email: "",
        password: "",
      });
      toast.success(response.data.message);

    } catch (error) {
      toast.error(error.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () =>{
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);    
      console.log(result)
      try {
        const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`,{
          email:result.user.email,
        },
      {withCredentials:true})
      
       dispatch(setUserData(data))
        
      } catch (error) {
        toast.error(error.response?.data?.message || "Signin failed");
        
      }
    }


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: bgColor }}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border">
        <h2 className="text-2xl font-bold text-center mb-6">AviEats</h2>
        <h3 className="mb-4">Sign in to your account</h3>

        <form className="space-y-5" onSubmit={handleSignIn}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-right mb-4 text-xl">
            <button onClick={() => navigate("/forgot-password")}>
              forgot password 
            </button>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = hoverColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Google Sign In */}
          <div className="mt-4">
            <button
              onClick={handleGoogleAuth}
              type="button"
              className="w-full flex items-center justify-center gap-3 border rounded-lg py-2 font-medium transition duration-200 hover:shadow-md"
            >
              <FcGoogle size={22} />
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Footer */}
          <button
            type="button"
            className="text-sm text-center text-gray-500 mt-4 w-full"
          >
            Don’t have an account?{" "}
            <span
              style={{ color: primaryColor }}
              onClick={() => navigate("/signup")}
              className="font-medium cursor-pointer"
            >
              Sign Up
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;