import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'
import { Skeleton } from 'boneyard-js/react'
import { TrackOrderFallback } from '../components/skeletons'
import api from '../api/axios'

const TrackOrderPage = () => {

  const { orderId } = useParams()
  const [currentOrder, setCurrentOrder] = useState(null)
  const [isOrderLoading, setIsOrderLoading] = useState(true)
  const {socket} = useSelector(state=>state.user)
  const [livelocation,setLiveLocation] = useState({})

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      setIsOrderLoading(true)
      try {
        const result = await api.get(`/order/get-order-by-id/${orderId}`)
        setCurrentOrder(result.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsOrderLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  useEffect(()=>{

    socket.on('updateDeliveryLocation',({deliveryBoyId,latitude,longitude})=>{
        console.log("event recieved")
        setLiveLocation((prev)=>({
            ...prev,
            [deliveryBoyId]:{lat:latitude,lon:longitude}
        }))

    })
  },[socket])

  return (
    <Skeleton
      name="track-order-page"
      loading={isOrderLoading}
      fallback={<TrackOrderFallback />}
      fixture={<TrackOrderFallback />}
      animate="shimmer"
      transition
      snapshotConfig={{ excludeSelectors: [".leaflet-container"] }}
    >
    {!currentOrder ? <TrackOrderFallback /> : (
    <div className="p-4 space-y-4">

      <h2 className="text-xl font-semibold">Track Order</h2>

      {currentOrder?.shopOrders?.map((shopOrder, index) => {

        const itemsText = shopOrder?.shopOrderItems
          ?.map(i => i.item?.name)
          .join(", ")

        return (
          <div key={index} className="bg-white p-4 rounded-lg shadow">

            {/* Order Info */}
            <p className="text-sm text-gray-500">
              Order ID: {currentOrder._id}
            </p>

            <p className="font-semibold">
              {shopOrder?.shop?.name}
            </p>

            <p className="text-sm">
              Items: {itemsText}
            </p>

            <p className="font-medium">
              ₹ {shopOrder?.subTotal}
            </p>

            <p className="text-sm text-gray-500">
              Address: {currentOrder?.deliveryAddress?.text}
            </p>

            {/* Status */}
            {shopOrder?.status !== "delivered" ? (
              <div className="mt-3">
                <h3 className="font-medium">Delivery Boy</h3>

                {shopOrder?.assignedDeliveryBoy ? (
                  <div className="text-sm">
                    <p>{shopOrder.assignedDeliveryBoy.fullName}</p>
                    <p>{shopOrder.assignedDeliveryBoy.mobile}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Delivery boy not assigned yet
                  </p>
                )}
              </div>
            ) : (
              <p className="text-green-600 mt-2">Delivered</p>
            )}

            {/* ✅ MAP (ONLY FIXED PART) */}
            {shopOrder?.assignedDeliveryBoy?.location?.coordinates &&
               shopOrder.status!== "delivered" && (

                <div className="mt-4">
                  <DeliveryBoyTracking
                    data={{
                      deliveryBoyLocation:livelocation[shopOrder.assignedDeliveryBoy?._id] || {
                        lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                        lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                      },
                      customerLocation: {
                        lat:currentOrder.deliveryAddress.latitude,
                        lon:currentOrder.deliveryAddress.longitude,
                      }
                    }}
                  />
                </div>
              )}

          </div>
        )
      })}

    </div>
    )}
    </Skeleton>
  )
}

export default TrackOrderPage
