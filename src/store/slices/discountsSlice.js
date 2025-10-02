import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  filteredItems: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    type: 'all',
  },
  selectedDiscount: null,
}

const discountsSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {
    setDiscounts: (state, action) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    addDiscount: (state, action) => {
      state.items.unshift(action.payload)
      state.filteredItems.unshift(action.payload)
    },
    updateDiscount: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        const filteredIndex = state.filteredItems.findIndex(item => item.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload
        }
      }
    },
    deleteDiscount: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.filteredItems = state.filteredItems.filter(item => item.id !== action.payload)
    },
    setSelectedDiscount: (state, action) => {
      state.selectedDiscount = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    applyFilters: (state) => {
      let filtered = state.items

      if (state.filters.search) {
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          item.code.toLowerCase().includes(state.filters.search.toLowerCase())
        )
      }

      if (state.filters.status !== 'all') {
        filtered = filtered.filter(item => item.status === state.filters.status)
      }

      if (state.filters.type !== 'all') {
        filtered = filtered.filter(item => item.type === state.filters.type)
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
  setDiscounts,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  setSelectedDiscount,
  setFilters,
  applyFilters,
  setLoading,
  setError,
} = discountsSlice.actions

export default discountsSlice.reducer