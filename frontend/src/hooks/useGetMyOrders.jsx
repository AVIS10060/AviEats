import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import toast from 'react-hot-toast'
import { setMyOrders } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'



const useGetMyOrders = () => {
    const dispatch = useDispatch()
    const userData = useSelector(state => state.user)

    useEffect(()=>{

        const fetchOrders = async() =>{

            try {
                const response = await axios.get(`${serverUrl}/api/order/my-orders`,{withCredentials:true})
                 dispatch(setMyOrders(response.data))
                 console.log(response.data)
                
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
                
            }

        }
        fetchOrders()

    },[])
}

export default useGetMyOrders