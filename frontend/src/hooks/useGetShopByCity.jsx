import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import toast from 'react-hot-toast'
import { setShopsInMyCity, setUserData } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'


const useGetShopByCity = () => {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state => state.user)

    useEffect(()=>{

        const fetchShops = async() =>{

            try {
                const response = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true})
                 dispatch(setShopsInMyCity(response.data))
                 console.log(response.data)
                
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
                
            }

        }
        fetchShops()

    },[currentCity])
}

export default useGetShopByCity