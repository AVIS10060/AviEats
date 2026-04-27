import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/user/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard'
import Navbar from '../components/NavBar'

const Home = () => {
    const {userData, isLoading} = useSelector(state => state.user)

    if (isLoading || !userData) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading...
        </div>
      )
    }

  return (
  <>
  <div>
  <Navbar></Navbar>
  </div>
  <div className='w-[100vw] h-full  flex flex-col item-center'>
        {userData.role == "user" && <UserDashboard></UserDashboard>}
        {userData.role == "owner" && <OwnerDashboard></OwnerDashboard>}
        {userData.role == "deliveryBoy" && <DeliveryBoyDashboard></DeliveryBoyDashboard>}

  </div>
  </>
  )
}

export default Home
