import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentCity,setCurrentAddress,setCurrentState } from '../redux/userSlice'


const useGetCity = () => {
    const dispatch = useDispatch()
    const apikey = import.meta.env.VITE_GEOAPIKEY
    const {userData} = useSelector(state => state.user)

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(async (position)=>{
            console.log(position)
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            try {
            const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apikey}`)
            dispatch(setCurrentCity(response?.data?.results[0].city))
            dispatch(setCurrentState(response?.data?.results[0].state))
            dispatch(setCurrentAddress(response?.data?.results[0].address_line1))
            console.log(response.data.results[0].address_line1)
            console.log(response.data.results[0].state)
            
        } catch (error) {
            console.log(error)
            
        }

        })
        

},[userData])



  return (
    <div></div>
  )
}

export default useGetCity