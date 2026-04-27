import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaUtensils } from "react-icons/fa"
import toast from "react-hot-toast"
import { setMyShopData } from "../redux/ownerSlice"
import api from "../api/axios"

const CreateEditShop = () => {

  const navigate = useNavigate()

  const { myShopData } = useSelector((state) => state.owner)
  const { currentCity, currentState, currentAddress } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: ""
  })

  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)

  // Sync Redux data to form
  useEffect(() => {
    const syncForm = () => {
      setFormData({
        name: myShopData?.name || "",
        address: myShopData?.address || currentAddress || "",
        city: myShopData?.city || currentCity || "",
        state: myShopData?.state || currentState || "",
      })

      setFrontendImage(myShopData?.image || null)
    }

    syncForm()
  }, [myShopData, currentCity, currentState, currentAddress])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const data = new FormData()

      data.append("name", formData.name)
      data.append("address", formData.address)
      data.append("city", formData.city)
      data.append("state", formData.state)

      if (backendImage) {
        data.append("image", backendImage)
      }
      const res = await api.post("/shop/create-edit", data)
      dispatch(setMyShopData(res.data.shop))
      console.log(res)

      toast.success(res.data.message || "Shop saved successfully")

      navigate("/")

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-xl transform transition duration-300 hover:scale-[1.02]">

        {/* Back Button */}

        <button
          onClick={() => navigate("/")}
          className="text-blue-600 text-sm mb-4 hover:underline"
        >
          ← Back
        </button>

        {/* Header */}

        <div className="flex flex-col items-center mb-6">

          <FaUtensils className="text-4xl text-orange-500 mb-2 animate-bounce" />

          <h2 className="text-2xl font-semibold">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </h2>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Shop Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />

          {/* Image Upload */}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="border p-2 rounded-md"
          />

          {/* Image Preview */}

          {frontendImage && (
            <img
              src={frontendImage}
              alt="shop"
              className="h-40 w-full object-cover rounded-lg"
            />
          )}

          <button
            type="submit"
            className="bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
          >
            Save
          </button>

        </form>

      </div>

    </div>
  )
}

export default CreateEditShop
