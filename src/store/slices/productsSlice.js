import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  filteredItems: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    category: 'all',
  },
  selectedProduct: null,
  inventory: [],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    addProduct: (state, action) => {
      // Ensure the product has proper variants structure
      const newProduct = {
        ...action.payload,
        variants: action.payload.variants || [
          {
            id: 1,
            option1: 'Default Title',
            price: action.payload.price || 0,
            sku: action.payload.sku || '',
            inventory: action.payload.inventory || 0,
            requiresShipping: true,
            taxable: true,
          }
        ]
      }
      state.items.push(newProduct)
      // Apply current filters to see if the new product should be in filteredItems
      let shouldInclude = true
      
      if (state.filters.search) {
        shouldInclude = shouldInclude && newProduct.name.toLowerCase().includes(state.filters.search.toLowerCase())
      }
      
      if (state.filters.status !== 'all') {
        shouldInclude = shouldInclude && newProduct.status === state.filters.status
      }
      
      if (state.filters.category !== 'all') {
        shouldInclude = shouldInclude && newProduct.category === state.filters.category
      }
      
      if (shouldInclude) {
        state.filteredItems.push(newProduct)
      }
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
        // Also update in filteredItems if it exists there
        const filteredIndex = state.filteredItems.findIndex(item => item.id === action.payload.id)
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload
        }
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.filteredItems = state.filteredItems.filter(item => item.id !== action.payload)
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    applyFilters: (state) => {
      let filtered = state.items

      if (state.filters.search) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(state.filters.search.toLowerCase())
        )
      }

      if (state.filters.status !== 'all') {
        filtered = filtered.filter(item => item.status === state.filters.status)
      }

      if (state.filters.category !== 'all') {
        filtered = filtered.filter(item => item.category === state.filters.category)
      }

      state.filteredItems = filtered
    },
    setInventory: (state, action) => {
      state.inventory = action.payload
    },
    updateInventory: (state, action) => {
      const index = state.inventory.findIndex(item => item.productId === action.payload.productId)
      if (index !== -1) {
        state.inventory[index] = action.payload
      }
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
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setFilters,
  applyFilters,
  setInventory,
  updateInventory,
  setLoading,
  setError,
} = productsSlice.actions

export default productsSlice.reducer