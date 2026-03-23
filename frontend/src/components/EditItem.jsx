import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaUtensils } from "react-icons/fa"
import toast from "react-hot-toast"
import axios from "axios"
import { serverUrl } from "../App"
import { setMyShopData } from "../redux/ownerSlice"
import { useDispatch, useSelector } from "react-redux"

const EditItem = () => {
    const {MyShopData} = useSelector(state => state.owner)
  const dispatch = useDispatch()
  const {itemId} = useParams()
  console.log(itemId)
  const [loading,setLoading] = useState(false)

  const navigate = useNavigate()
  const [currentItem,setCurrentItem] = useState(null)
  console.log(currentItem)

  const [formData, setFormData] = useState({
    name: "",
    price:0,
    foodType: "veg",
    category:  ""
  })

  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)

 useEffect(() => {

  const fetchItem = async () => {
    try {

      const res = await axios.get(
        `${serverUrl}/api/item/get-by-id/${itemId}`,
        { withCredentials: true }
      )

      setCurrentItem(res.data)
      console.log(res,"this is response")

    } catch (error) {
      console.log(error)
    }
  }

  fetchItem()

}, [``])

 useEffect(() => {

  if (!currentItem) return

  setFormData({
    name: currentItem?.name || "",
    price: currentItem?.price || 0,
    foodType: currentItem?.foodType || "veg",
    category: currentItem?.category || ""
  })

  setFrontendImage(currentItem?.image || null)
  setBackendImage(null)

}, [currentItem])


  const categories = [
    "snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "chinese",
    "Fast Food",
    "others",
  ]

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
    setLoading(true)

    try {

      const data = new FormData()

      data.append("name", formData.name)
      data.append("price", formData.price)
      data.append("foodType", formData.foodType)
      data.append("category", formData.category)

      if (backendImage) {
        data.append("image", backendImage)
      }

      const res = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        data,
        { withCredentials: true }
      )
      dispatch(setMyShopData(res.data))
      console.log(res.data)

      toast.success(res.data.message || "Item added successfully")

      navigate("/")

    } catch (error) {

      toast.error(error?.response?.data?.message || "Something went wrong")

    }
    finally {
    setLoading(false)
  }
  }



 



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-xl">

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
            Edit food item
          </h2>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* Food Name */}

          <input
            type="text"
            name="name"
            placeholder="Food Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded-md"
            required
          />

          {/* Price + Food Type */}

          <div className="flex gap-3">

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded-md w-1/2"
              min="0"
            />

            <select
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className="border p-2 rounded-md w-1/2"
            >
              <option value="veg">Veg</option>
              <option value="non-veg">Non Veg</option>
            </select>

          </div>

          {/* Category */}

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded-md"
          >

            <option value="">Select Category</option>

            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}

          </select>

          {/* Image Upload */}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImage}
            className="border p-2 rounded-md"
          />

          {/* Image Preview */}

          {frontendImage && (
            <img
              src={frontendImage}
              alt="food"
              className="h-48 w-full object-contain rounded-lg"
            />
          )}

          {/* Save Button */}

         <button
 type="submit"
 disabled={loading}
 className="bg-orange-500 text-white py-2 rounded-md"
>
 {loading ? "Saving..." : "Save"}
</button>

        </form>

      </div>

    </div>
  )
}

export default EditItem