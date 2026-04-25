import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/user/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard'
import Navbar from '../components/NavBar'
import { Skeleton } from 'boneyard-js/react'
import { AppShellFallback } from '../components/skeletons'

const Home = () => {
    const {userData, isLoading} = useSelector(state => state.user)

    if (isLoading || !userData) {
      return (
        <Skeleton
          name="home-loading"
          loading={true}
          fallback={<AppShellFallback />}
          fixture={<AppShellFallback />}
          animate="shimmer"
        >
          <AppShellFallback />
        </Skeleton>
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
