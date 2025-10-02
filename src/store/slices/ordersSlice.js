import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  filteredItems: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    fulfillment: 'all',
    dateRange: 'all',
  },
  selectedOrder: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    addOrder: (state, action) => {
      state.items.unshift(action.payload)
      state.filteredItems.unshift(action.payload)
    },
    updateOrder: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        const filteredIndex = state.filteredItems.findIndex(item => item.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload
        }
      }
    },
    deleteOrder: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.filteredItems = state.filteredItems.filter(item => item.id !== action.payload)
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    applyFilters: (state) => {
      let filtered = state.items

      if (state.filters.search) {
        filtered = filtered.filter(item =>
          item.orderNumber.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          item.customer.name.toLowerCase().includes(state.filters.search.toLowerCase())
        )
      }

      if (state.filters.status !== 'all') {
        filtered = filtered.filter(item => item.status === state.filters.status)
      }

      if (state.filters.fulfillment !== 'all') {
        filtered = filtered.filter(item => item.fulfillmentStatus === state.filters.fulfillment)
      }

      state.filteredItems = filtered
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
  setOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  setSelectedOrder,
  setFilters,
  applyFilters,
  setLoading,
  setError,
} = ordersSlice.actions

export default ordersSlice.reducer