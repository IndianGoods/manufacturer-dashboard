import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  filteredItems: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
  },
  selectedRfq: null,
}

const rfqsSlice = createSlice({
  name: 'rfqs',
  initialState,
  reducers: {
    setRfqs: (state, action) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    addRfq: (state, action) => {
      state.items.unshift(action.payload)
      state.filteredItems.unshift(action.payload)
    },
    updateRfq: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        const filteredIndex = state.filteredItems.findIndex(item => item.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload
        }
      }
    },
    deleteRfq: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.filteredItems = state.filteredItems.filter(item => item.id !== action.payload)
    },
    setSelectedRfq: (state, action) => {
      state.selectedRfq = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    applyFilters: (state) => {
      let filtered = state.items

      if (state.filters.search) {
        filtered = filtered.filter(item =>
          item.rfqNumber.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          item.customer.name.toLowerCase().includes(state.filters.search.toLowerCase())
        )
      }

      if (state.filters.status !== 'all') {
        filtered = filtered.filter(item => item.status === state.filters.status)
      }

      if (state.filters.priority !== 'all') {
        filtered = filtered.filter(item => item.priority === state.filters.priority)
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
  setRfqs,
  addRfq,
  updateRfq,
  deleteRfq,
  setSelectedRfq,
  setFilters,
  applyFilters,
  setLoading,
  setError,
} = rfqsSlice.actions

export default rfqsSlice.reducer