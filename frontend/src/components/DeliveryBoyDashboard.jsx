import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import api from '../api/axios'


const DeliveryBoyDashboard = () => {
  // const [otp,setOtp] = useState(null)
  const { userData ,socket} = useSelector(state => state.user)
  // const [showOtpBox ,setShowOtpBox] = useState(false)
  const [deliveryBoyLoca,setDeliveryBoyLocation] = useState(null)
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)



  useEffect(() => {
    if (!socket || userData?.role !== 'deliveryBoy') return;

    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setDeliveryBoyLocation({ lat: latitude, lon: longitude });

          socket.emit('update-location', {
            latitude,
            longitude,
            userId: userData?._id,
          });
        },
        (error) => {
          console.error(error);
          // toast.error('Unable to track location. Please allow location access.');
        },
        {
          enableHighAccuracy: true,
        },
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);


  const [currentOrder, setCurrentOrder] = useState(null)
  const [availableAssignments, setAvailableAssignments] = useState([])

  const getAssignment = async () => {
    try {
      const result = await api.get('/order/get-assignments')

      setAvailableAssignments(result.data)
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Unable to load assignments')
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      await api.get(`/order/accept-order/${assignmentId}`)

      // ✅ after accept → refresh current order
      await getCurrentOrder()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Accept order failed')
    }
  }

  const getCurrentOrder = async () => {
    try {
      const result = await api.get('/order/get-current-order')
     
      setCurrentOrder(result.data)

    } catch (error) {
      console.error(error)
      setCurrentOrder(null)
    }
  }

  useEffect(() => {
    if (!userData) return

    const loadDashboard = async () => {
      setIsDashboardLoading(true)
      await Promise.allSettled([getAssignment(), getCurrentOrder()])
      setIsDashboardLoading(false)
    }

    loadDashboard()
  }, [userData])

   console.log(currentOrder)


//  const sendOtp = async (orderId, shopOrderId) => {
//     try {
//       await api.post(
//         '/order/send-delivery-otp',
//         { orderId, shopOrderId },
//       )
//       setShowOtpBox(true)
//     } catch (error) {
//       console.error(error)
//       toast.error(error.response?.data?.message || 'Unable to send OTP')
//     }
//   }
//   const verifyOtp = async (orderId, shopOrderId, otp) => {
//     try {
//       await api.post(
//         '/order/verify-delivery-otp',
//         { orderId, shopOrderId, otp },
//       )
//       toast.success('OTP verified successfully')
//     } catch (error) {
//       console.error(error)
//       toast.error(error.response?.data?.message || 'OTP verification failed')
//     }
//   }



  const markAsDelivered = async (orderId, shopOrderId) => {
  try {
    await api.post('/order/mark-delivered', {
  orderId,
  shopOrderId,
})

    toast.success('Order delivered successfully')

    await getCurrentOrder()
  } catch (error) {
    console.error(error)
    toast.error(
      error.response?.data?.message ||
      'Unable to mark order delivered'
    )
  }
}
  // console.log(currentOrder?.shoporder?._id)


  useEffect(()=>{

    socket?.on('new-assignment',(data) =>{
      console.log('event reciecved',data)
      if(data.sentTo == userData._id){
        setAvailableAssignments((prev)=>[...prev,data])
      }
    })
    return ()=> socket?.off('new-assignment')


  },[socket , userData])



  if (isDashboardLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-4 mt-12">

      {/* Header */}
      <div className="mb-4 p-4 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold">
          Welcome, {userData?.fullName}
        </h2>
        <p className="text-sm text-gray-500">
          Latitude: {deliveryBoyLoca?.lat} ,
          Longitude: {deliveryBoyLoca?.lon}
        </p>
      </div>

      {/* ✅ IF CURRENT ORDER EXISTS */}
      {currentOrder ? (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-md font-semibold mb-3">
            Current Order
          </h3>

          {/* Shop Name */}
          <p className="font-semibold text-gray-800">
            {currentOrder?.shoporder?.shop?.name}
          </p>

          {/* Address */}
          <p className="text-sm text-gray-600">
            {currentOrder?.deliveryAddress?.text}
          </p>

          {/* Items count */}
          <p className="mt-2 text-sm">
            {currentOrder?.shoporder?.shopOrderItems?.length || 0} items
          </p>

          {/* Total */}
          <p className="mt-2 font-medium">
            ₹ {currentOrder?.shoporder?.subTotal}
          </p>

          <DeliveryBoyTracking data={
                     {deliveryBoyLocation: deliveryBoyLoca || {
                        lat: userData.location.coordinates[1],
                        lon: userData.location.coordinates[0],
                      },
                      customerLocation: {
                        lat:currentOrder.deliveryAddress.latitude,
                        lon:currentOrder.deliveryAddress.longitude,
                      }
          }}></DeliveryBoyTracking>

       {/* {!showOtpBox ? (
  <button
    onClick={() =>
      sendOtp(currentOrder?._id, currentOrder?.shoporder?._id)
    }
    className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
  >
    Mark as Delivered
  </button>
) : (
  <div className="mt-4 w-full bg-white shadow rounded-xl p-4 flex flex-col gap-3">

    <p className="text-sm text-gray-700">
      Enter OTP sent to{" "}
      <span className="font-semibold">
        {currentOrder?.user?.fullName}
      </span>
    </p>

    <input
      onChange={(e) => setOtp(e.target.value)}
      value={otp}
      placeholder="Enter OTP"
      type="text"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
    />

    <button
      onClick={() =>
        verifyOtp(
          currentOrder?._id,
          currentOrder?.shoporder?._id,
          otp
        )
      }
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition"
    >
      Submit OTP
    </button>

  </div>
)} */}
<button
  onClick={() =>
    markAsDelivered(
      currentOrder?._id,
      currentOrder?.shoporder?._id
    )
  }
  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
>
  Mark as Delivered
</button>
          



        </div>
      ) : (
        /* ✅ ELSE SHOW AVAILABLE ORDERS */
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
                  {a.items?.map((item, i) => (
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
                <button
                  onClick={() => acceptOrder(a.assignmentId)}
                  className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg font-medium"
                >
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
      )}

    </div>
  )
}

export default DeliveryBoyDashboard
