import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import toast from 'react-hot-toast'
import { setShopsInMyCity,setItemsInMyCity, setUserData } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'


const useGetItemsByCity = () => {
    const dispatch = useDispatch()
    const {currentCity} = useSelector(state => state.user)

    useEffect(()=>{

        const fetchItems = async() =>{

            try {
                const response = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
                 dispatch(setItemsInMyCity(response.data))
                 console.log(response.data)
                
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
                
            }

        }
        fetchItems()

    },[currentCity])
}

export default useGetItemsByCity