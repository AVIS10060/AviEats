import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { setItemsInMyCity, setItemsLoading } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axios'


const useGetItemsByCity = () => {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state => state.user)

    useEffect(() => {
        if (!currentCity) return

        const fetchItems = async () => {
            dispatch(setItemsLoading(true))

            try {
                const response = await api.get(`/item/get-by-city/${currentCity}`)
                dispatch(setItemsInMyCity(response.data))
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
            } finally {
                dispatch(setItemsLoading(false))
            }
        }

        fetchItems()
    }, [currentCity, dispatch])
}

export default useGetItemsByCity
