import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { setMyOrders, setOrdersLoading } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axios'

const useGetMyOrders = () => {
    const dispatch = useDispatch()

    // ✅ FIX: correct selector
    const { userData } = useSelector(state => state.user)

    useEffect(() => {

        // ✅ IMPORTANT: wait for user
        if (!userData) return

        const fetchOrders = async () => {
            dispatch(setOrdersLoading(true))
            try {
                const response = await api.get('/order/my-orders')

                dispatch(setMyOrders(response.data))
                console.log(response.data)

            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
            } finally {
                dispatch(setOrdersLoading(false))
            }
        }

        fetchOrders()

    }, [userData, dispatch]) // ✅ FIX: not empty

}

export default useGetMyOrders
