import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import toast from 'react-hot-toast'
import { setUserData } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice'


const useGetMyShop = () => {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user)

    useEffect(()=>{

        const fetchShop = async() =>{

            try {
                const response = await axios.get(`${serverUrl}/api/shop/get-my`,{withCredentials:true})
                 dispatch(setMyShopData(response.data))
                
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
                
            }

        }
        fetchShop()

    },[userData])
}

export default useGetMyShop