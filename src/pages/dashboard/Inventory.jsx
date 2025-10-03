import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockProducts } from '../../data/mockData'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Inventory = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [selectedVariants, setSelectedVariants] = useState({})
  const [editingValues, setEditingValues] = useState({})
  const [showModals, setShowModals] = useState({})
  const [products, setProducts] = useState(mockProducts)
  const [selectAll, setSelectAll] = useState(false)
  const containerRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Always close dropdowns when clicking outside the container
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdowns({})
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdowns({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  // Extract all products with their variants
  const allInventoryItems = useMemo(() => {
    const items = []
    products.forEach(product => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          items.push({
            id: `${product.id}-${variant.id}`,
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variantName: variant.name,
            sku: variant.sku,
            category: product.category,
            price: variant.price,
            stock: variant.inventory?.available || 0,
            onHand: variant.inventory?.onHand || variant.inventory?.available || 0,
            committed: variant.inventory?.committed || 0,
            unavailable: variant.inventory?.unavailable || {},
            totalUnavailable: Object.values(variant.inventory?.unavailable || {}).reduce((sum, val) => sum + val, 0),
            location: variant.location,
            barcode: variant.barcode || '',
            weight: variant.weight || 0,
            product,
            variantData: variant
          })
        })
      } else {
        items.push({
          id: product.id,
          productId: product.id,
          variantId: null,
          name: product.name,
          variantName: 'Default',
          sku: product.sku,
          category: product.category,
          price: product.price,
          stock: product.inventory?.available || 0,
          onHand: product.inventory?.onHand || product.inventory?.available || 0,
          committed: product.inventory?.committed || 0,
          unavailable: product.inventory?.unavailable || {},
          totalUnavailable: Object.values(product.inventory?.unavailable || {}).reduce((sum, val) => sum + val, 0),
          location: product.location,
          barcode: product.barcode || '',
          weight: product.weight || 0,
          product,
          variantData: null
        })
      }
    })
    return items
  }, [products])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allInventoryItems.map(item => item.category))]
    return ['all', ...cats]
  }, [allInventoryItems])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = allInventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'name') {
        aVal = `${a.name} ${a.variantName}`
        bVal = `${b.name} ${b.variantName}`
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [allInventoryItems, searchTerm, selectedCategory, sortBy, sortOrder])

  const handleProductClick = (item) => {
    navigate(`/dashboard/products/${item.productId}`)
  }

  const toggleDropdown = (itemId, dropdownType = 'main', event = null) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    const key = `${itemId}-${dropdownType}`
    setOpenDropdowns(prev => {
      const isCurrentlyOpen = prev[key]
      
      // For nested dropdowns (unavailable sub-dropdowns), keep main dropdown open
      if (dropdownType.startsWith('unavailable-') && dropdownType !== 'unavailable') {
        return {
          [`${itemId}-unavailable`]: true, // Keep main unavailable dropdown open
          [key]: !isCurrentlyOpen // Toggle the sub-dropdown
        }
      }
      
      // For main dropdowns, close others and toggle this one
      return isCurrentlyOpen ? {} : { [key]: true }
    })
  }

  const handleVariantSelection = (itemId) => {
    setSelectedVariants(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVariants({})
      setSelectAll(false)
    } else {
      const newSelected = {}
      filteredAndSortedItems.forEach(item => {
        newSelected[item.id] = true
      })
      setSelectedVariants(newSelected)
      setSelectAll(true)
    }
  }

  const handleValueChange = (itemId, field, value) => {
    setEditingValues(prev => ({
      ...prev,
      [`${itemId}-${field}`]: value
    }))
  }

  const handleSortByName = (order) => {
    setSortBy('name')
    setSortOrder(order)
  }

  const showModal = (itemId, modalType) => {
    setShowModals(prev => ({
      ...prev,
      [`${itemId}-${modalType}`]: true
    }))
  }

  const hideModal = (itemId, modalType) => {
    setShowModals(prev => ({
      ...prev,
      [`${itemId}-${modalType}`]: false
    }))
  }

  // Update inventory data in products and persist to mockData
  const updateInventoryData = (productId, variantId, field, value, reason = '') => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => {
        if (product.id === productId) {
          if (variantId && product.variants) {
            // Update variant inventory
            const updatedVariants = product.variants.map(variant => {
              if (variant.id === variantId) {
                const updatedInventory = { ...variant.inventory }
                
                if (field === 'available') {
                  updatedInventory.available = parseInt(value) || 0
                } else if (field === 'onHand') {
                  updatedInventory.onHand = parseInt(value) || 0
                } else if (field === 'committed') {
                  updatedInventory.committed = parseInt(value) || 0
                } else if (field.startsWith('unavailable.')) {
                  const unavailableType = field.split('.')[1]
                  updatedInventory.unavailable = {
                    ...updatedInventory.unavailable,
                    [unavailableType]: parseInt(value) || 0
                  }
                }
                
                return { ...variant, inventory: updatedInventory }
              }
              return variant
            })
            return { ...product, variants: updatedVariants }
          } else {
            // Update product inventory (for products without variants)
            const updatedInventory = { ...product.inventory }
            
            if (field === 'available') {
              updatedInventory.available = parseInt(value) || 0
            } else if (field === 'onHand') {
              updatedInventory.onHand = parseInt(value) || 0
            } else if (field === 'committed') {
              updatedInventory.committed = parseInt(value) || 0
            } else if (field.startsWith('unavailable.')) {
              const unavailableType = field.split('.')[1]
              updatedInventory.unavailable = {
                ...updatedInventory.unavailable,
                [unavailableType]: parseInt(value) || 0
              }
            }
            
            return { ...product, inventory: updatedInventory }
          }
        }
        return product
      })
      
      // Log the update for debugging
      console.log(`Updated ${field} for product ${productId}, variant ${variantId} to ${value}. Reason: ${reason}`)
      
      return updatedProducts
    })
  }

  // Handle unavailable actions with validation
  const handleUnavailableAction = (item, type, action, value = 0) => {
    const currentValue = item.unavailable[type] || 0
    
    switch (action) {
      case 'change':
        const newValue = Math.max(0, parseInt(value) || 0)
        updateInventoryData(item.productId, item.variantId, `unavailable.${type}`, newValue)
        console.log(`Changed ${type} from ${currentValue} to ${newValue}`)
        break
      case 'addToAvailable':
        if (currentValue > 0) {
          // Move from unavailable to available
          updateInventoryData(item.productId, item.variantId, `unavailable.${type}`, 0)
          updateInventoryData(item.productId, item.variantId, 'available', item.stock + currentValue)
          console.log(`Moved ${currentValue} from ${type} to available`)
        }
        break
      case 'delete':
        updateInventoryData(item.productId, item.variantId, `unavailable.${type}`, 0)
        console.log(`Deleted ${currentValue} from ${type}`)
        break
    }
    
    // Close all dropdowns after action
    setOpenDropdowns({})
  }

  // Handle available/onhand adjustments with validation
  const handleInventoryAdjustment = (item, field, adjustment, reason) => {
    const currentValue = field === 'available' ? item.stock : item.onHand
    const newValue = Math.max(0, currentValue + parseInt(adjustment))
    
    updateInventoryData(item.productId, item.variantId, field, newValue, reason)
    console.log(`Adjusted ${field} from ${currentValue} to ${newValue}. Reason: ${reason}`)
    
    // Close all dropdowns after action
    setOpenDropdowns({})
  }

  // Apply editable field changes
  const applyFieldChange = (item, field) => {
    const editKey = `${item.id}-${field}`
    const newValue = editingValues[editKey]
    
    if (newValue !== undefined && newValue !== null) {
      updateInventoryData(item.productId, item.variantId, field, newValue)
      // Clear editing value
      setEditingValues(prev => {
        const updated = { ...prev }
        delete updated[editKey]
        return updated
      })
    }
  }

  const isDropdownOpen = (itemId, dropdownType = 'main') => {
    return openDropdowns[`${itemId}-${dropdownType}`]
  }

  const isModalOpen = (itemId, modalType) => {
    return showModals[`${itemId}-${modalType}`]
  }

  const getCommittedOrdersText = (committed) => {
    return committed === 0 ? 'No committed orders' : `${committed} committed`
  }

  const getStockStatus = (stock, totalUnavailable) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' }
    if (stock < 10) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-50' }
    return { text: 'In Stock', color: 'text-green-600 bg-green-50' }
  }

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">Inventory Management</h1>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Sort:</span>
            <button
              onClick={() => handleSortByName('asc')}
              className={`p-1 rounded ${sortBy === 'name' && sortOrder === 'asc' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={() => handleSortByName('desc')}
              className={`p-1 rounded ${sortBy === 'name' && sortOrder === 'desc' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline">Bulk Actions</Button>
          <Button size="sm">Export</Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              console.log('Current products state:', products)
              alert('Check browser console for current products data')
            }}
          >
            Debug
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-xl shadow-md">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search products, variants, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs h-7"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1 text-xs h-7 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}
            className="px-2 py-1 text-xs h-7 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="stock-desc">Stock High-Low</option>
            <option value="stock-asc">Stock Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="price-asc">Price Low-High</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left font-medium text-gray-700 text-xs w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-3 w-3 text-blue-600 focus:ring-blue-500 rounded-sm"
                  />
                </th>
                <th className="px-2 py-1 text-left font-medium text-gray-700 text-xs w-1/3">Product</th>
                <th className="px-2 py-1 text-left font-medium text-gray-700 text-xs w-24">SKU</th>
                <th className="px-2 py-1 text-left font-medium text-gray-700 text-xs w-24">Unavailable</th>
                <th className="px-2 py-1 text-left font-medium text-gray-700 text-xs w-24">Committed</th>
                <th className="px-2 py-1 text-left font-medium text-gray-700 text-xs w-28">Available</th>
                <th className="px-2 py-1 text-left font-medium text-gray-700 text-xs w-28">On Hand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* Selection Checkbox */}
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedVariants[item.id] || false}
                      onChange={() => handleVariantSelection(item.id)}
                      className="h-3 w-3 text-blue-600 focus:ring-blue-500 rounded-sm"
                    />
                  </td>

                  {/* Product Name & Variant */}
                  <td className="px-2 py-1">
                    <div 
                      className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 text-xs leading-tight"
                      onClick={() => handleProductClick(item)}
                    >
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight">
                      {item.variantName}
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-2 py-1">
                    <span className="text-xs text-gray-700 font-mono">{item.sku}</span>
                  </td>

                  {/* Unavailable with Enhanced Dropdowns */}
                  <td className="px-2 py-1">
                    <div className="relative">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-gray-900">{item.totalUnavailable}</span>
                        <button
                          onClick={(e) => toggleDropdown(item.id, 'unavailable', e)}
                          className="p-0.5 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      
                      {isDropdownOpen(item.id, 'unavailable') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg z-20 min-w-40">
                          <div className="p-2 space-y-1 text-xs">
                            {['damaged', 'qualityControl', 'safetyStock', 'other'].map((type) => {
                              const value = item.unavailable[type] || 0
                              const label = type === 'qualityControl' ? 'QC' : 
                                          type === 'safetyStock' ? 'Safety' : 
                                          type.charAt(0).toUpperCase() + type.slice(1)
                              
                              return (
                                <div key={type} className="border-b border-gray-100 pb-1 last:border-0">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-xs">{label}:</span>
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium text-xs">{value}</span>
                                      <button
                                        onClick={(e) => toggleDropdown(item.id, `unavailable-${type}`, e)}
                                        className="p-0.5 hover:bg-gray-100 rounded"
                                      >
                                        <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {isDropdownOpen(item.id, `unavailable-${type}`) && (
                                    <div className="bg-gray-50 p-1 rounded mt-1 space-y-1" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex gap-1">
                                        <input
                                          type="number"
                                          placeholder="Value"
                                          className="w-12 p-1 text-xs border rounded"
                                          id={`${item.id}-${type}-input`}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            const input = document.getElementById(`${item.id}-${type}-input`)
                                            const newValue = parseInt(input.value) || 0
                                            handleUnavailableAction(item, type, 'change', newValue)
                                          }}
                                          className="px-1 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                          Set
                                        </button>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleUnavailableAction(item, type, 'addToAvailable')
                                        }}
                                        className={`w-full text-left px-1 py-0.5 text-xs rounded ${value > 0 ? 'hover:bg-green-100 text-green-700' : 'text-gray-400 cursor-not-allowed'}`}
                                        disabled={value === 0}
                                      >
                                        → Available ({value})
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleUnavailableAction(item, type, 'delete')
                                        }}
                                        className={`w-full text-left px-1 py-0.5 text-xs rounded ${value > 0 ? 'hover:bg-red-100 text-red-700' : 'text-gray-400 cursor-not-allowed'}`}
                                        disabled={value === 0}
                                      >
                                        Delete ({value})
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Committed */}
                  <td className="px-2 py-1">
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdown(item.id, 'committed', e)}
                        className="flex items-center gap-1 text-xs hover:text-blue-600"
                      >
                        <span className="font-medium">
                          {item.committed === 0 ? '0' : item.committed}
                        </span>
                        <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isDropdownOpen(item.id, 'committed') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg z-20 min-w-24">
                          <div className="p-1 space-y-0.5">
                            <div className="text-xs text-gray-600">Committed: {item.committed}</div>
                            <button className="w-full text-left px-1 py-0.5 text-xs hover:bg-gray-50 rounded">
                              View Orders
                            </button>
                            <button className="w-full text-left px-1 py-0.5 text-xs hover:bg-gray-50 rounded">
                              Adjust
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Available with Adjustment Dropdown */}
                  <td className="px-2 py-1">
                    <div className="relative flex items-center gap-0.5">
                      <input
                        type="number"
                        value={editingValues[`${item.id}-available`] ?? item.stock}
                        onChange={(e) => handleValueChange(item.id, 'available', e.target.value)}
                        onBlur={() => applyFieldChange(item, 'available')}
                        onKeyPress={(e) => e.key === 'Enter' && applyFieldChange(item, 'available')}
                        className="w-12 p-0.5 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={(e) => toggleDropdown(item.id, 'available-actions', e)}
                        className="p-0.5 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isDropdownOpen(item.id, 'available-actions') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg z-20 min-w-36">
                          <div className="p-2 space-y-1">
                            <div className="text-xs font-medium text-gray-700 mb-1">Adjust Available</div>
                            
                            <div className="space-y-1">
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  placeholder="±Amt"
                                  className="w-12 p-0.5 text-xs border rounded"
                                  id={`${item.id}-available-amount`}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <select
                                  className="flex-1 p-0.5 text-xs border rounded"
                                  id={`${item.id}-available-reason`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="">Reason</option>
                                  <option value="correction">Correction</option>
                                  <option value="received">Received</option>
                                  <option value="returned">Returned</option>
                                  <option value="damaged">→ Damaged</option>
                                  <option value="count">Count</option>
                                </select>
                              </div>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const amountInput = document.getElementById(`${item.id}-available-amount`)
                                    const reasonSelect = document.getElementById(`${item.id}-available-reason`)
                                    const amount = parseInt(amountInput.value) || 0
                                    const reason = reasonSelect.value
                                    
                                    if (reason) {
                                      handleInventoryAdjustment(item, 'available', amount, reason)
                                      amountInput.value = ''
                                      reasonSelect.value = ''
                                    }
                                  }}
                                  className="flex-1 px-1 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenDropdowns({})
                                  }}
                                  className="px-1 py-0.5 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* On Hand with Adjustment Dropdown */}
                  <td className="px-2 py-1">
                    <div className="relative flex items-center gap-0.5">
                      <input
                        type="number"
                        value={editingValues[`${item.id}-onhand`] ?? item.onHand}
                        onChange={(e) => handleValueChange(item.id, 'onhand', e.target.value)}
                        onBlur={() => applyFieldChange(item, 'onHand')}
                        onKeyPress={(e) => e.key === 'Enter' && applyFieldChange(item, 'onHand')}
                        className="w-12 p-0.5 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={(e) => toggleDropdown(item.id, 'onhand-actions', e)}
                        className="p-0.5 hover:bg-gray-100 rounded"
                      >
                        <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isDropdownOpen(item.id, 'onhand-actions') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg z-20 min-w-36">
                          <div className="p-2 space-y-1">
                            <div className="text-xs font-medium text-gray-700 mb-1">Adjust On Hand</div>
                            
                            <div className="space-y-1">
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  placeholder="±Amt"
                                  className="w-12 p-0.5 text-xs border rounded"
                                  id={`${item.id}-onhand-amount`}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <select
                                  className="flex-1 p-0.5 text-xs border rounded"
                                  id={`${item.id}-onhand-reason`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="">Reason</option>
                                  <option value="physical-count">Count</option>
                                  <option value="receiving">Receiving</option>
                                  <option value="transfer-in">Transfer In</option>
                                  <option value="transfer-out">Transfer Out</option>
                                  <option value="adjustment">Adjustment</option>
                                  <option value="loss">Loss</option>
                                </select>
                              </div>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const amountInput = document.getElementById(`${item.id}-onhand-amount`)
                                    const reasonSelect = document.getElementById(`${item.id}-onhand-reason`)
                                    const amount = parseInt(amountInput.value) || 0
                                    const reason = reasonSelect.value
                                    
                                    if (reason) {
                                      handleInventoryAdjustment(item, 'onHand', amount, reason)
                                      amountInput.value = ''
                                      reasonSelect.value = ''
                                    }
                                  }}
                                  className="flex-1 px-1 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenDropdowns({})
                                  }}
                                  className="px-1 py-0.5 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No inventory items found</h3>
            <p className="text-xs">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Compact Summary */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Inventory Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{filteredAndSortedItems.length}</div>
            <div className="text-xs text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {filteredAndSortedItems.reduce((sum, item) => sum + item.stock, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Available</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {filteredAndSortedItems.reduce((sum, item) => sum + item.onHand, 0)}
            </div>
            <div className="text-xs text-gray-600">On Hand</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">
              {filteredAndSortedItems.reduce((sum, item) => sum + item.committed, 0)}
            </div>
            <div className="text-xs text-gray-600">Committed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {filteredAndSortedItems.filter(item => item.stock > 0 && item.stock < 10).length}
            </div>
            <div className="text-xs text-gray-600">Low Stock</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {filteredAndSortedItems.filter(item => item.stock === 0).length}
            </div>
            <div className="text-xs text-gray-600">Out of Stock</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory