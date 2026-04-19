import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { serverUrl } from '../App'

const DeliveryBoyDashboard = () => {
  const { userData } = useSelector(state => state.user)
  

  const [availableAssignments, setAvailableAssignments] = useState([])

  const getAssignment = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-assignments`,
        { withCredentials: true }
      )

      console.log(result.data, "this is user Data")
      setAvailableAssignments(result.data)

    } catch (error) {
      console.log(error)
    }
  }
  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      )
      console.log(result)

    } catch (error) {
      console.log(error)
    }
  }

  

  useEffect(() => {
    if (userData) getAssignment()
  }, [userData])

  return (
    <div className="p-4 mt-12">

      {/* Header */}
      <div className="mb-4 p-4 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold">
          Welcome, {userData?.fullName}
        </h2>
        <p className="text-sm text-gray-500">
          Latitude: {userData?.location?.coordinates?.[1]} ,
          Longitude: {userData?.location?.coordinates?.[0]}
        </p>
      </div>

      {/* Available Orders */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-md font-semibold mb-3">
          Available Orders
        </h3>

        {availableAssignments.length > 0 ? (
          availableAssignments.map((a, index) => (
            <div
              key={index}
              className="border p-3 mb-3 rounded-lg"
            >
              {/* Shop */}
              <p className="font-semibold text-gray-800">
                {a.shopName}
              </p>

              {/* Address */}
              <p className="text-sm text-gray-600">
                {a.deliveryAddress?.text}
              </p>

              {/* Items */}
              <div className="mt-2">
                {a.items.map((item, i) => (
                  <p key={i} className="text-sm">
                    {item.name} x {item.quantity}
                  </p>
                ))}
              </div>

              {/* Total */}
              <p className="mt-2 font-medium">
                ₹ {a.subTotal}
              </p>

              {/* Accept Button */}
              <button  onClick={()=>acceptOrder(a.assignmentId)}
              className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg font-medium">
                Accept
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">
            No available assignments
          </p>
        )}
      </div>

    </div>
  )
}

export default DeliveryBoyDashboard