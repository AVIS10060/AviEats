import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/user/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard'
import Navbar from '../components/NavBar'

const Home = () => {
    const {userData} = useSelector(state => state.user)
  return (
  <>
  <div>
  <Navbar></Navbar>
  </div>
  <div className='w-[100vw] h-full  flex flex-col item-center'>
        {userData.role == "user" && <UserDashboard></UserDashboard>}
        {userData.role == "owner" && <OwnerDashboard></OwnerDashboard>}
        {userData.role == "deliveryboy" && <DeliveryBoyDashboard></DeliveryBoyDashboard>}

  </div>
  </>
  )
}

export default Home