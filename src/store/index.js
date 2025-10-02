import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import productsSlice from './slices/productsSlice'
import ordersSlice from './slices/ordersSlice'
import rfqsSlice from './slices/rfqsSlice'
import discountsSlice from './slices/discountsSlice'
import analyticsSlice from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    orders: ordersSlice,
    rfqs: rfqsSlice,
    discounts: discountsSlice,
    analytics: analyticsSlice,
  },
})