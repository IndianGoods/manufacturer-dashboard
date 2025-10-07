import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockProducts } from '../../data/mockData'
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import Breadcrumb from '../../components/layout/Breadcrumbs'

const Inventory = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [selectedVariants, setSelectedVariants] = useState({})
  const [editingValues, setEditingValues] = useState({})
  const [products, setProducts] = useState(mockProducts)
  const [selectAll, setSelectAll] = useState(false)
  const containerRef = useRef(null)

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

  const handleSortByName = (order) => {
    setSortBy('name')
    setSortOrder(order)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  const toggleDropdown = (itemId, dropdownType = 'main', event = null) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    const key = `${itemId}-${dropdownType}`
    setOpenDropdowns(prev => {
      const isCurrentlyOpen = prev[key]
      
      // For nested dropdowns, keep main dropdown open
      if (dropdownType.startsWith('unavailable-') && dropdownType !== 'unavailable') {
        return {
          [`${itemId}-unavailable`]: true,
          [key]: !isCurrentlyOpen
        }
      }
      
      // For main dropdowns, close others and toggle this one
      return isCurrentlyOpen ? {} : { [key]: true }
    })
  }

  const handleValueChange = (itemId, field, value) => {
    setEditingValues(prev => ({
      ...prev,
      [`${itemId}-${field}`]: value
    }))
  }

  // Update inventory data in products
  const updateInventoryData = (productId, variantId, field, value, reason = '') => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => {
        if (product.id === productId) {
          if (variantId && product.variants) {
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
      
      console.log(`Updated ${field} for product ${productId}, variant ${variantId} to ${value}. Reason: ${reason}`)
      return updatedProducts
    })
  }

  // Handle unavailable actions
  const handleUnavailableAction = (item, type, action, value = 0) => {
    const currentValue = item.unavailable[type] || 0
    
    switch (action) {
      case 'change':
        const newValue = Math.max(0, parseInt(value) || 0)
        updateInventoryData(item.productId, item.variantId, `unavailable.${type}`, newValue)
        break
      case 'addToAvailable':
        if (currentValue > 0) {
          updateInventoryData(item.productId, item.variantId, `unavailable.${type}`, 0)
          updateInventoryData(item.productId, item.variantId, 'available', item.stock + currentValue)
        }
        break
      case 'delete':
        updateInventoryData(item.productId, item.variantId, `unavailable.${type}`, 0)
        break
    }
    
    setOpenDropdowns({})
  }

  // Handle inventory adjustments
  const handleInventoryAdjustment = (item, field, adjustment, reason) => {
    const currentValue = field === 'available' ? item.stock : item.onHand
    const newValue = Math.max(0, currentValue + parseInt(adjustment))
    
    updateInventoryData(item.productId, item.variantId, field, newValue, reason)
    setOpenDropdowns({})
  }

  // Apply field changes
  const applyFieldChange = (item, field) => {
    const editKey = `${item.id}-${field}`
    const newValue = editingValues[editKey]
    
    if (newValue !== undefined && newValue !== null) {
      updateInventoryData(item.productId, item.variantId, field, newValue)
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

  const breadcrumbItems = [
    { name: 'Inventory' }
  ]

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortByName('asc')}
                className={sortBy === 'name' && sortOrder === 'asc' ? 'bg-primary-50 text-primary-600' : ''}
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortByName('desc')}
                className={sortBy === 'name' && sortOrder === 'desc' ? 'bg-primary-50 text-primary-600' : ''}
              >
                <ArrowDownIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
          <Button variant="outline" size="sm">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products, variants, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="stock-desc">Stock High-Low</option>
              <option value="stock-asc">Stock Low-High</option>
              <option value="price-desc">Price High-Low</option>
              <option value="price-asc">Price Low-High</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* Inventory Table */}
      <Card>
        <div className="overflow-x-auto overflow-y-visible">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </Table.Head>
                <Table.Head className="text-xs">Product</Table.Head>
                <Table.Head className="text-xs">SKU</Table.Head>
                <Table.Head className="text-xs">Unavailable</Table.Head>
                <Table.Head className="text-xs">Committed</Table.Head>
                <Table.Head className="text-xs">Available</Table.Head>
                <Table.Head className="text-xs">On Hand</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredAndSortedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    if (e.target.type !== 'checkbox' && e.target.type !== 'number' && !e.target.closest('button')) {
                      handleProductClick(item)
                    }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedVariants[item.id] || false}
                      onChange={() => handleVariantSelection(item.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0">
                        <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-xs font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.variantName} • {item.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-xs font-mono text-gray-600">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleDropdown(item.id, 'unavailable', e)}
                        className="h-8 px-2"
                      >
                        <span className="text-xs font-medium">{item.totalUnavailable}</span>
                        <ChevronDownIcon className="h-3 w-3 ml-1" />
                      </Button>
                      
                      {isDropdownOpen(item.id, 'unavailable') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-20 min-w-48">
                          <div className="p-3 space-y-2">
                            {['damaged', 'qualityControl', 'safetyStock', 'other'].map((type) => {
                              const value = item.unavailable[type] || 0
                              const label = type === 'qualityControl' ? 'Quality Control' : 
                                          type === 'safetyStock' ? 'Safety Stock' : 
                                          type.charAt(0).toUpperCase() + type.slice(1)
                              
                              return (
                                <div key={type} className="border-b border-gray-100 pb-2 last:border-0">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">{label}:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm">{value}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => toggleDropdown(item.id, `unavailable-${type}`, e)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ChevronDownIcon className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {isDropdownOpen(item.id, `unavailable-${type}`) && (
                                    <div className="bg-gray-50 p-2 rounded space-y-2" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          placeholder="Value"
                                          className="h-8 text-sm"
                                          id={`${item.id}-${type}-input`}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <Button
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            const input = document.getElementById(`${item.id}-${type}-input`)
                                            const newValue = parseInt(input.value) || 0
                                            handleUnavailableAction(item, type, 'change', newValue)
                                          }}
                                          className="h-8"
                                        >
                                          Set
                                        </Button>
                                      </div>
                                      <div className="space-y-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnavailableAction(item, type, 'addToAvailable')
                                          }}
                                          disabled={value === 0}
                                          className="w-full justify-start h-8"
                                        >
                                          → Available ({value})
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnavailableAction(item, type, 'delete')
                                          }}
                                          disabled={value === 0}
                                          className="w-full justify-start h-8 text-red-600 hover:text-red-700"
                                        >
                                          Delete ({value})
                                        </Button>
                                      </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleDropdown(item.id, 'committed', e)}
                        className="h-8 px-2"
                      >
                        <span className="text-xs font-medium">{item.committed}</span>
                        <ChevronDownIcon className="h-3 w-3 ml-1" />
                      </Button>
                      
                      {isDropdownOpen(item.id, 'committed') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-20 min-w-32">
                          <div className="p-2">
                            <div className="text-sm text-gray-600 mb-2">
                              {item.committed === 0 ? 'No committed orders' : `${item.committed} committed`}
                            </div>
                            <div className="space-y-1">
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                View Orders
                              </Button>
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                Adjust
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="relative flex items-center gap-2">
                      <Input
                        type="number"
                        value={editingValues[`${item.id}-available`] ?? item.stock}
                        onChange={(e) => handleValueChange(item.id, 'available', e.target.value)}
                        onBlur={() => applyFieldChange(item, 'available')}
                        onKeyPress={(e) => e.key === 'Enter' && applyFieldChange(item, 'available')}
                        className="w-20 h-8 text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleDropdown(item.id, 'available-actions', e)}
                        className="h-8 w-8 p-0"
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Button>
                      
                      {isDropdownOpen(item.id, 'available-actions') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-20 min-w-64">
                          <div className="p-3">
                            <div className="text-sm font-medium text-gray-700 mb-3">Adjust Available</div>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="±Amount"
                                  className="h-8 text-sm"
                                  id={`${item.id}-available-amount`}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <select
                                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
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
                                  className="flex-1"
                                >
                                  Apply
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenDropdowns({})
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="relative flex items-center gap-2">
                      <Input
                        type="number"
                        value={editingValues[`${item.id}-onHand`] ?? item.onHand}
                        onChange={(e) => handleValueChange(item.id, 'onHand', e.target.value)}
                        onBlur={() => applyFieldChange(item, 'onHand')}
                        onKeyPress={(e) => e.key === 'Enter' && applyFieldChange(item, 'onHand')}
                        className="w-20 h-8 text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => toggleDropdown(item.id, 'onHand-actions', e)}
                        className="h-8 w-8 p-0"
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Button>
                      
                      {isDropdownOpen(item.id, 'onHand-actions') && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-20 min-w-64">
                          <div className="p-3">
                            <div className="text-sm font-medium text-gray-700 mb-3">Adjust On Hand</div>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="±Amount"
                                  className="h-8 text-sm"
                                  id={`${item.id}-onHand-amount`}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <select
                                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  id={`${item.id}-onHand-reason`}
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
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const amountInput = document.getElementById(`${item.id}-onHand-amount`)
                                    const reasonSelect = document.getElementById(`${item.id}-onHand-reason`)
                                    const amount = parseInt(amountInput.value) || 0
                                    const reason = reasonSelect.value
                                    
                                    if (reason) {
                                      handleInventoryAdjustment(item, 'onHand', amount, reason)
                                      amountInput.value = ''
                                      reasonSelect.value = ''
                                    }
                                  }}
                                  className="flex-1"
                                >
                                  Apply
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setOpenDropdowns({})
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </Table.Body>
          </Table>
        </div>
        
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </Card>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <Card.Content className="p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900">{filteredAndSortedItems.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-4 text-center">
            <div className="text-2xl font-semibold text-primary-600">
              {filteredAndSortedItems.reduce((sum, item) => sum + item.stock, 0)}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-4 text-center">
            <div className="text-2xl font-semibold text-blue-600">
              {filteredAndSortedItems.reduce((sum, item) => sum + item.onHand, 0)}
            </div>
            <div className="text-sm text-gray-600">On Hand</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-4 text-center">
            <div className="text-2xl font-semibold text-purple-600">
              {filteredAndSortedItems.reduce((sum, item) => sum + item.committed, 0)}
            </div>
            <div className="text-sm text-gray-600">Committed</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-4 text-center">
            <div className="text-2xl font-semibold text-orange-600">
              {filteredAndSortedItems.filter(item => item.stock > 0 && item.stock < 10).length}
            </div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-4 text-center">
            <div className="text-2xl font-semibold text-red-600">
              {filteredAndSortedItems.filter(item => item.stock === 0).length}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </Card.Content>
        </Card>
      </div> */}
    </div>
  )
}

export default Inventory