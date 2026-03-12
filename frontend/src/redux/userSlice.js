import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState:{
        userData:null,
        currentCity:null,
        currentState:null,
        currentAddress:null

    },
    reducers:{
        setUserData: (State,action)=>{
        State.userData = action.payload

        },
        setCurrentCity: (State,action)=>{
        State.currentCity = action.payload

        },
        setCurrentState: (State,action)=>{
        State.currentState = action.payload

        },
        setCurrentAddress: (State,action)=>{
        State.currentAddress = action.payload

        }
    }
})

export const  {setUserData}= userSlice.actions
export const  {setCurrentCity}= userSlice.actions
export const  {setCurrentState}= userSlice.actions
export const  {setCurrentAddress}= userSlice.actions

export default userSlice.reducer