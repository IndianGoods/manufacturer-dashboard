import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  overview: {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalCustomers: 0,
    conversionRate: 0,
  },
  salesData: [],
  topProducts: [],
  recentActivity: [],
  isLoading: false,
  error: null,
  dateRange: '7d', // 7d, 30d, 90d, 1y
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setOverview: (state, action) => {
      state.overview = action.payload
    },
    setSalesData: (state, action) => {
      state.salesData = action.payload
    },
    setTopProducts: (state, action) => {
      state.topProducts = action.payload
    },
    setRecentActivity: (state, action) => {
      state.recentActivity = action.payload
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setOverview,
  setSalesData,
  setTopProducts,
  setRecentActivity,
  setDateRange,
  setLoading,
  setError,
} = analyticsSlice.actions

export default analyticsSlice.reducer