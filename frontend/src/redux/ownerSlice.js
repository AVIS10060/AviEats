import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name: "owner",
    initialState:{
        myShopData:null,
        isShopLoading:false,
        
    },
    reducers:{
        setMyShopData: (state,action)=>{
        state.myShopData = action.payload

        },
        setShopLoading: (state, action) => {
        state.isShopLoading = action.payload

        },
     
    }
})

export const  {setMyShopData, setShopLoading}= ownerSlice.actions
export const  {setCity}= ownerSlice.actions

export default ownerSlice.reducer
