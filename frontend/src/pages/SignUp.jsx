import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";

const SignUp = () => {
  const navigate = useNavigate();

  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    role: "user",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Signup
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        formData,
        { withCredentials: true }
      );

      console.log(response.data);

      // Reset form only if success
      setFormData({
        fullName: "",
        email: "",
        password: "",
        mobile: "",
        role: "user",
      });

    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: bgColor }}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border">
        <h2 className="text-2xl font-bold text-center mb-6">AviEats</h2>
        <h3 className="mb-4">Create your account</h3>

        <form className="space-y-5" onSubmit={handleSignUp}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

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

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Role
            </label>
            <div className="flex gap-6">
              {["user", "owner", "delivery"].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="role"
                    value={item}
                    checked={formData.role === item}
                    onChange={handleChange}
                    style={{ accentColor: primaryColor }}
                  />
                  <span className="capitalize">{item}</span>
                </label>
              ))}
            </div>
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Google */}
          <div className="mt-4">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border rounded-lg py-2 font-medium transition duration-200 hover:shadow-md"
            >
              <FcGoogle size={22} />
              <span>Sign up with Google</span>
            </button>
          </div>

          {/* Footer */}
          <button
            type="button"
            className="text-sm text-center text-gray-500 mt-4 w-full"
          >
            Already have an account?{" "}
            <span
              style={{ color: primaryColor }}
              onClick={() => navigate("/signin")}
              className="font-medium cursor-pointer"
            >
              Login
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;