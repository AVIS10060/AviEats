import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { setShopsInMyCity, setShopsLoading } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axios'


const useGetShopByCity = () => {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state => state.user)
     
    
    useEffect(() => {
        if (!currentCity) return; 

        const fetchShops = async () => {
            dispatch(setShopsLoading(true))

            try {
                const response = await api.get(`/shop/get-by-city/${currentCity}`)
                dispatch(setShopsInMyCity(response.data))
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
            } finally {
                dispatch(setShopsLoading(false))
            }
        }

        fetchShops()
    }, [currentCity, dispatch])
}

export default useGetShopByCity
