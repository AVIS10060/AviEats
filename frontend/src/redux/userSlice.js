import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState:{
        userData:null,
        isLoading:true,
        currentCity:null,
        currentState:null,
        currentAddress:null,
        shopsInMyCity:[],
        itemsInMyCity:null,
        cartItems:[],
        totalAmount:0,
        myOrders:[],
        error:null


    },
    reducers:{
        setUserData: (state,action)=>{
        state.userData = action.payload

        },
        setUserLoading: (state) => {
        state.isLoading = true;
        },
      setUserSuccess: (state, action) => {
  state.isLoading = false;

  // 🔴 guard against empty object
  if (!action.payload || !action.payload._id) {
    state.userData = null;
  } else {
    state.userData = action.payload;
  }
},
      setUserFailure: (state, action) => {
      state.isLoading = false;
      state.userData = null;   // 🔥 CRITICAL
      state.error = action.payload || null;
    },
        setCurrentCity: (state,action)=>{
        state.currentCity = action.payload

        },
        setCurrentState: (state,action)=>{
        state.currentState = action.payload

        },
        setCurrentAddress: (state,action)=>{
        state.currentAddress = action.payload

        },
        setShopsInMyCity: (state,action)=>{
        state.shopsInMyCity = action.payload

        },
        setItemsInMyCity: (state,action)=>{
        state.itemsInMyCity = action.payload

        },
        addToCart: (state,action)=>{
            const cartItem = action.payload
            const existingItem = state.cartItems.find(i=>i.id == cartItem.id)
            if(existingItem){
                existingItem.quantity += cartItem.quantity 
            }
            else{
                state.cartItems.push(cartItem)
            }
            state.totalAmount = state.cartItems.reduce((sum,i)=> sum+i.price*i.quantity,0)
        },
        updateQuantity:(state,action) => {
            const {id,quantity} = action.payload
            const item = state.cartItems.find(i=>i.id == id)
            if(item){
                item.quantity = quantity
            }
            state.totalAmount = state.cartItems.reduce((sum,i)=> sum+i.price*i.quantity,0)
        },
        removeCartItem:(state,action) => {
            state.cartItems = state.cartItems.filter(i=>i.id !== action.payload)
            state.totalAmount = state.cartItems.reduce((sum,i)=> sum+i.price*i.quantity,0)
        },
        setMyOrders:(state,action) =>{
            state.myOrders = action.payload
        },
        addMyOrder:(state,action) =>{
            state.myOrders=[action.payload,...state.myOrders]
        },
        updateOrderStatus: (state, action) => {
  const { orderId, shopId, status } = action.payload;

  const order = state.myOrders.find(
    o => o._id.toString() === orderId.toString()
  );

  if (!order || !order.shopOrders) return;

  const shopOrder = order.shopOrders.find(
    so => so.shop._id.toString() === shopId.toString()
  );

  if (shopOrder) {
    shopOrder.status = status;
  }
}
       


    }
})

export const  {setUserData}= userSlice.actions
export const  {setCurrentCity}= userSlice.actions
export const  {setCurrentState}= userSlice.actions
export const  {setCurrentAddress}= userSlice.actions
export const  {setShopsInMyCity}= userSlice.actions
export const  {setItemsInMyCity}= userSlice.actions
export const  {addToCart}= userSlice.actions
export const  {updateQuantity}= userSlice.actions
export const  {removeCartItem}= userSlice.actions
export const  {setMyOrders,addMyOrder}= userSlice.actions
export const { setUserLoading, setUserSuccess, setUserFailure ,updateOrderStatus} = userSlice.actions;


export default userSlice.reducer