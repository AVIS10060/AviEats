import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData, setShopLoading } from '../redux/ownerSlice'

// ✅ use centralized axios instance
import api from '../api/axios'

const useGetMyShop = () => {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)

  useEffect(() => {

    if (!userData) return

    if (userData.role === "owner") {

      const fetchShop = async () => {
        dispatch(setShopLoading(true)) // ✅ keep feature loading

        try {
          const response = await api.get('/shop/get-my') // ✅ no baseURL needed

          dispatch(setMyShopData(response.data.shop))
          console.log(response.data.shop)

        } catch (error) {
          toast.error(error.response?.data?.message || error.message)
        } finally {
          dispatch(setShopLoading(false))
        }
      }

      fetchShop()
    }

  }, [userData, dispatch])
}

export default useGetMyShop