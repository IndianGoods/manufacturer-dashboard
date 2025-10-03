import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  filteredItems: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
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
      let filtered = [...state.items];

      // Filter by search
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(order =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower) ||
          order.customer.email.toLowerCase().includes(searchLower)
        );
      }

      // Filter by status
      if (state.filters.status !== 'all') {
        if (state.filters.status === 'unfulfilled') {
          filtered = filtered.filter(order => order.fulfillmentStatus === 'unfulfilled');
        } else if (state.filters.status === 'unpaid') {
          filtered = filtered.filter(order => order.paymentStatus === 'unpaid');
        } else if (state.filters.status === 'open') {
          filtered = filtered.filter(order => order.status === 'pending' || order.fulfillmentStatus === 'unfulfilled');
        } else if (state.filters.status === 'archived') {
          filtered = filtered.filter(order => order.status === 'archived');
        } else {
          filtered = filtered.filter(order => order.status === state.filters.status);
        }
      }

      state.filteredItems = filtered;
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