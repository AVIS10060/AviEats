import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isLoading: true,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopsInMyCity: [],
    isShopsLoading: false,
    itemsInMyCity: null,
    isItemsLoading: false,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    isOrdersLoading: false,
    error: null,
    searchItems: null,
    socket: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
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
      state.userData = null; // 🔥 CRITICAL
      state.error = action.payload || null;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setShopsLoading: (state, action) => {
      state.isShopsLoading = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    setItemsLoading: (state, action) => {
      state.isItemsLoading = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find((i) => i.id == cartItem.id);
      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id == id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
    setMyOrders: (state, action) => {
      if (typeof action.payload === "function") {
        state.myOrders = action.payload(state.myOrders);
      } else {
        state.myOrders = action.payload;
      }
    },
    setOrdersLoading: (state, action) => {
      state.isOrdersLoading = action.payload;
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },

    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;

      const order = state.myOrders.find(
        (o) => o._id.toString() === orderId.toString(),
      );

      if (!order || !order.shopOrders) return;

      const shopOrder = order.shopOrders.find(
        (so) => so.shop._id.toString() === shopId.toString(),
      );

      if (shopOrder) {
        shopOrder.status = status;
      }
    },

   updateRealTimeOrderStatus: (state, action) => {
  const { orderId, shopId, status } = action.payload;

  const order = state.myOrders.find(
    (o) => String(o._id) === String(orderId)
  );

  if (!order) return;

  const shopOrders = Array.isArray(order.shopOrders)
    ? order.shopOrders
    : [order.shopOrders];

  order.shopOrders = shopOrders.map((so) =>
    String(so?.shop?._id) === String(shopId)
      ? { ...so, status }
      : so
  );
}
  },
});

export const { setUserData } = userSlice.actions;
export const { setCurrentCity } = userSlice.actions;
export const { setCurrentState } = userSlice.actions;
export const { setCurrentAddress } = userSlice.actions;
export const { setShopsInMyCity } = userSlice.actions;
export const { setShopsLoading } = userSlice.actions;
export const { setItemsInMyCity } = userSlice.actions;
export const { setItemsLoading } = userSlice.actions;
export const { addToCart } = userSlice.actions;
export const { updateQuantity } = userSlice.actions;
export const { removeCartItem } = userSlice.actions;
export const { setMyOrders, addMyOrder, setOrdersLoading } = userSlice.actions;
export const {
  setUserLoading,
  updateRealTimeOrderStatus,
  setUserSuccess,
  setUserFailure,
  updateOrderStatus,
  setSearchItems,
  setSocket,
} = userSlice.actions;

export default userSlice.reducer;
