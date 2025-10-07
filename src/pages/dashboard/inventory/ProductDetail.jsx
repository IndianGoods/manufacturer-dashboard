import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockProducts } from '../../../data/mockData'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Badge from '../../../components/ui/Badge'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('') // 'saving', 'saved', 'error'
  const [editingFields, setEditingFields] = useState({})
  const saveTimeoutRef = useRef(null)
  const lastSavedRef = useRef(null)

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === id)
    if (foundProduct) {
      setProduct(foundProduct)
      if (foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0])
      }
    }
  }, [id])

  // Autosave function with debouncing
  const saveVariant = useCallback(async (variantToSave) => {
    if (!variantToSave) return
    
    setIsSaving(true)
    setSaveStatus('saving')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Update the selected variant and product state
      if (selectedVariant?.id === variantToSave.id) {
        setSelectedVariant(variantToSave)
      }
      
      // Update product variants
      const updatedProduct = {
        ...product,
        variants: product.variants.map(v => 
          v.id === variantToSave.id ? variantToSave : v
        )
      }
      setProduct(updatedProduct)
      
      setSaveStatus('saved')
      lastSavedRef.current = new Date()
      
      // Clear saved status after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000)
      
    } catch (error) {
      console.error('Error saving variant:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 5000)
    } finally {
      setIsSaving(false)
    }
  }, [selectedVariant, product])

  // Debounced autosave
  const debouncedSave = useCallback((variantToSave) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveVariant(variantToSave)
    }, 1500) // Save after 1.5 seconds of inactivity
  }, [saveVariant])

  // Handle field changes with autosave
  const handleFieldChange = useCallback((field, value, nestedField = null) => {
    if (!selectedVariant) return
    
    const updatedVariant = { ...selectedVariant }
    
    if (nestedField) {
      updatedVariant[field] = {
        ...updatedVariant[field],
        [nestedField]: value
      }
    } else {
      updatedVariant[field] = value
    }
    
    setSelectedVariant(updatedVariant)
    setEditingFields(prev => ({ ...prev, [`${field}${nestedField ? `.${nestedField}` : ''}`]: true }))
    
    // Trigger autosave
    debouncedSave(updatedVariant)
    
    // Clear editing indicator after a delay
    setTimeout(() => {
      setEditingFields(prev => ({ ...prev, [`${field}${nestedField ? `.${nestedField}` : ''}`]: false }))
    }, 2000)
  }, [selectedVariant, debouncedSave])

  // Handle nested field changes (for complex objects)
  const handleNestedFieldChange = useCallback((field, subField, value, subSubField = null) => {
    if (!selectedVariant) return
    
    const updatedVariant = { ...selectedVariant }
    
    if (subSubField) {
      updatedVariant[field] = {
        ...updatedVariant[field],
        [subField]: {
          ...updatedVariant[field][subField],
          [subSubField]: value
        }
      }
    } else {
      updatedVariant[field] = {
        ...updatedVariant[field],
        [subField]: value
      }
    }
    
    setSelectedVariant(updatedVariant)
    const fieldKey = `${field}.${subField}${subSubField ? `.${subSubField}` : ''}`
    setEditingFields(prev => ({ ...prev, [fieldKey]: true }))
    
    // Trigger autosave
    debouncedSave(updatedVariant)
    
    // Clear editing indicator after a delay
    setTimeout(() => {
      setEditingFields(prev => ({ ...prev, [fieldKey]: false }))
    }, 2000)
  }, [selectedVariant, debouncedSave])

  // Handle photo URL changes
  const handlePhotoChange = useCallback((newPhotoUrl) => {
    handleFieldChange('image', newPhotoUrl)
  }, [handleFieldChange])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/dashboard/inventory')}>
            Back to Inventory
          </Button>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { name: 'Products', href: '/dashboard/products' },
    { name: product.name }
  ]

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/inventory')}
            className="p-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-600">{product.category} • SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Save Status Indicator */}
          <div className="flex items-center gap-2">
            {isSaving && (
              <Badge variant="outline" className="flex items-center gap-1.5 text-blue-600 border-blue-200">
                <ArrowPathIcon className="w-3 h-3 animate-spin" />
                <span className="text-xs">Saving</span>
              </Badge>
            )}
            {saveStatus === 'saved' && (
              <Badge variant="outline" className="flex items-center gap-1.5 text-green-600 border-green-200">
                <CheckCircleIcon className="w-3 h-3" />
                <span className="text-xs">Saved</span>
              </Badge>
            )}
            {saveStatus === 'error' && (
              <Badge variant="outline" className="flex items-center gap-1.5 text-red-600 border-red-200">
                <ExclamationTriangleIcon className="w-3 h-3" />
                <span className="text-xs">Error</span>
              </Badge>
            )}
            {lastSavedRef.current && !isSaving && !saveStatus && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <ClockIcon className="w-3 h-3" />
                <span className="text-xs">
                  {lastSavedRef.current.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
          <Badge 
            variant={product.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {product.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Variant List */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Header className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-900">Variants</h3>
              <p className="text-xs text-gray-600 mt-1">{product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}</p>
            </Card.Header>
            <Card.Content className="p-4">
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedVariant?.id === variant.id 
                        ? 'border-primary-500 bg-primary-50 shadow-sm' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" 
                        style={{ backgroundColor: variant.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{variant.name}</div>
                        <div className="text-xs text-gray-500 truncate">{variant.sku}</div>
                      </div>
                      <div className="text-xs text-gray-600 font-medium flex-shrink-0">
                        {variant.inventory.available}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Selected Variant Details */}
        <div className="lg:col-span-3">
          {selectedVariant && (
            <div className="space-y-6">
              {/* Tabs Navigation */}
              <Card>
                <Card.Header className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedVariant.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">SKU: {selectedVariant.sku}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Auto-save enabled
                    </Badge>
                  </div>
                  <nav className="flex space-x-1">
                    {[
                      { key: 'basic', label: 'Basic Info' },
                      { key: 'pricing', label: 'Pricing' },
                      { key: 'inventory', label: 'Inventory' },
                      { key: 'shipping', label: 'Shipping' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                          activeTab === tab.key
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </Card.Header>

                {/* Tab Content */}
                <Card.Content className="p-6">
                  {activeTab === 'basic' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Photo Management */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                            Photo
                          </h4>
                          <div className="space-y-3">
                            <div className="text-center">
                              <div className="relative inline-block">
                                <img 
                                  src={selectedVariant.image || '/api/placeholder/300/300'} 
                                  alt={selectedVariant.name}
                                  className={`w-32 h-32 object-cover rounded-lg border transition-all ${
                                    editingFields['image'] ? 'border-gray-400 ring-1 ring-gray-300' : 'border-gray-200'
                                  }`}
                                  onError={(e) => {
                                    e.target.src = '/api/placeholder/300/300'
                                  }}
                                />
                                {editingFields['image'] && (
                                  <div className="absolute top-1 right-1 bg-gray-800 text-white px-1.5 py-0.5 rounded text-xs">
                                    ●
                                  </div>
                                )}
                              </div>
                            </div>
                            <Input
                              label="Photo URL"
                              value={selectedVariant.image || ''}
                              onChange={(e) => handlePhotoChange(e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className={`text-xs ${editingFields['image'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                            Color
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <label className="text-xs font-medium text-gray-700">Current:</label>
                              <div 
                                className={`w-8 h-8 rounded border transition-all ${
                                  editingFields['color'] ? 'border-gray-400 ring-1 ring-gray-300' : 'border-gray-200'
                                }`}
                                style={{ backgroundColor: selectedVariant.color }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Picker
                                </label>
                                <input
                                  type="color"
                                  value={selectedVariant.color || '#000000'}
                                  onChange={(e) => handleFieldChange('color', e.target.value)}
                                  className={`w-full h-8 border rounded cursor-pointer transition-all ${
                                    editingFields['color'] ? 'border-gray-400 ring-1 ring-gray-300' : 'border-gray-200'
                                  }`}
                                />
                              </div>
                              <div>
                                <Input
                                  label="Hex"
                                  value={selectedVariant.color || ''}
                                  onChange={(e) => handleFieldChange('color', e.target.value)}
                                  placeholder="#FF0000"
                                  className={`font-mono text-xs ${editingFields['color'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Variant Details */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                            Basic Info
                          </h4>
                          <div className="space-y-3">
                            <Input
                              label="Variant Name"
                              value={selectedVariant.name || ''}
                              onChange={(e) => handleFieldChange('name', e.target.value)}
                              placeholder="e.g., Red, Large, Premium"
                              className={`text-sm ${editingFields['name'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Size"
                                value={selectedVariant.size || ''}
                                onChange={(e) => handleFieldChange('size', e.target.value)}
                                placeholder="e.g., XL, 42, Large"
                                className={`text-xs ${editingFields['size'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                              />
                              <Input
                                label="Material"
                                value={selectedVariant.material || ''}
                                onChange={(e) => handleFieldChange('material', e.target.value)}
                                placeholder="e.g., Cotton, Leather"
                                className={`text-xs ${editingFields['material'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* SKU & Barcode */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            Identity
                          </h4>
                          <div className="space-y-3">
                            <Input
                              label="SKU (Stock Keeping Unit)"
                              value={selectedVariant.sku || ''}
                              onChange={(e) => handleFieldChange('sku', e.target.value)}
                              placeholder="e.g., PROD-001-RED-XL"
                              className={`font-mono text-xs ${editingFields['sku'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                            />
                            <Input
                              label="Barcode (UPC/EAN)"
                              value={selectedVariant.barcode || ''}
                              onChange={(e) => handleFieldChange('barcode', e.target.value)}
                              placeholder="e.g., 123456789012"
                              className={`font-mono text-xs ${editingFields['barcode'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Basic Pricing
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Price"
                            type="number"
                            step="0.01"
                            value={selectedVariant.price || ''}
                            onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className={`text-sm ${editingFields['price'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Compare At Price"
                            type="number"
                            step="0.01"
                            value={selectedVariant.compareAtPrice || ''}
                            onChange={(e) => handleFieldChange('compareAtPrice', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="0.00"
                            className={`text-sm ${editingFields['compareAtPrice'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                        </div>
                        {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                          <div className="mt-2 text-xs text-gray-600">
                            Savings: ${(selectedVariant.compareAtPrice - selectedVariant.price).toFixed(2)} 
                            ({(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100).toFixed(1)}% off)
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Cost & Profit
                        </h4>
                        <div className="space-y-3">
                          <Input
                            label="Cost per Item"
                            type="number"
                            step="0.01"
                            value={selectedVariant.costPerItem || ''}
                            onChange={(e) => handleFieldChange('costPerItem', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="0.00"
                            className={`text-sm ${editingFields['costPerItem'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Profit"
                            type="number"
                            step="0.01"
                            value={selectedVariant.costPerItem ? (selectedVariant.price - selectedVariant.costPerItem).toFixed(2) : ''}
                            disabled
                            className="bg-gray-100 text-sm text-gray-600"
                          />
                          {selectedVariant.costPerItem && (
                            <div className="text-xs text-gray-600">
                              Margin: {(((selectedVariant.price - selectedVariant.costPerItem) / selectedVariant.price) * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Tax Settings
                        </h4>
                        <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                          <input
                            type="checkbox"
                            id="taxable"
                            checked={selectedVariant.taxable || false}
                            onChange={(e) => handleFieldChange('taxable', e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="taxable" className="text-sm text-gray-700">
                            Charge tax on this variant
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'inventory' && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Stock Levels
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            label="Available"
                            type="number"
                            value={selectedVariant.inventory?.available || 0}
                            onChange={(e) => handleNestedFieldChange('inventory', 'available', parseInt(e.target.value) || 0)}
                            className={`text-sm ${editingFields['inventory.available'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Committed"
                            type="number"
                            value={selectedVariant.inventory?.committed || 0}
                            onChange={(e) => handleNestedFieldChange('inventory', 'committed', parseInt(e.target.value) || 0)}
                            className={`text-sm ${editingFields['inventory.committed'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="On Hand"
                            type="number"
                            value={selectedVariant.inventory?.onHand || 0}
                            onChange={(e) => handleNestedFieldChange('inventory', 'onHand', parseInt(e.target.value) || 0)}
                            className={`text-sm ${editingFields['inventory.onHand'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Location
                        </h4>
                        <Input
                          label="Warehouse Location"
                          value={selectedVariant.location || ''}
                          onChange={(e) => handleFieldChange('location', e.target.value)}
                          placeholder="e.g., Warehouse A, Shelf B-2"
                          className={`text-sm ${editingFields['location'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                        />
                      </div>

                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Unavailable Stock
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Damaged"
                            type="number"
                            value={selectedVariant.inventory?.unavailable?.damaged || 0}
                            onChange={(e) => handleNestedFieldChange('inventory', 'unavailable', parseInt(e.target.value) || 0, 'damaged')}
                            className={`text-xs ${editingFields['inventory.unavailable.damaged'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Quality Control"
                            type="number"
                            value={selectedVariant.inventory?.unavailable?.qualityControl || 0}
                            onChange={(e) => handleNestedFieldChange('inventory', 'unavailable', parseInt(e.target.value) || 0, 'qualityControl')}
                            className={`text-xs ${editingFields['inventory.unavailable.qualityControl'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Safety Stock"
                            type="number"
                            value={selectedVariant.inventory?.unavailable?.safetyStock || 0}
                            onChange={(e) => handleNestedFieldChange('inventory', 'unavailable', parseInt(e.target.value) || 0, 'safetyStock')}
                            className={`text-xs ${editingFields['inventory.unavailable.safetyStock'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Other"
                            type="number"
                            value={selectedVariant.inventory?.unavailable?.other || 0}
                            onChange={(e) => handleNestedFieldChange('inventory', 'unavailable', parseInt(e.target.value) || 0, 'other')}
                            className={`text-xs ${editingFields['inventory.unavailable.other'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Physical Properties
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Weight (kg)"
                            type="number"
                            step="0.001"
                            value={selectedVariant.shipping?.weight || ''}
                            onChange={(e) => handleNestedFieldChange('shipping', 'weight', parseFloat(e.target.value) || 0)}
                            className={`text-sm ${editingFields['shipping.weight'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Length (cm)"
                            type="number"
                            step="0.1"
                            value={selectedVariant.shipping?.length || ''}
                            onChange={(e) => handleNestedFieldChange('shipping', 'length', parseFloat(e.target.value) || 0)}
                            className={`text-sm ${editingFields['shipping.length'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Width (cm)"
                            type="number"
                            step="0.1"
                            value={selectedVariant.shipping?.width || ''}
                            onChange={(e) => handleNestedFieldChange('shipping', 'width', parseFloat(e.target.value) || 0)}
                            className={`text-sm ${editingFields['shipping.width'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="Height (cm)"
                            type="number"
                            step="0.1"
                            value={selectedVariant.shipping?.height || ''}
                            onChange={(e) => handleNestedFieldChange('shipping', 'height', parseFloat(e.target.value) || 0)}
                            className={`text-sm ${editingFields['shipping.height'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Origin & Customs
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Country of Origin"
                            value={selectedVariant.shipping?.countryOfOrigin || ''}
                            onChange={(e) => handleNestedFieldChange('shipping', 'countryOfOrigin', e.target.value)}
                            placeholder="e.g., United States, China, Germany"
                            className={`text-sm ${editingFields['shipping.countryOfOrigin'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                          <Input
                            label="HS Code"
                            value={selectedVariant.shipping?.hsCode || ''}
                            onChange={(e) => handleNestedFieldChange('shipping', 'hsCode', e.target.value)}
                            placeholder="e.g., 6203.42.40"
                            className={`text-sm ${editingFields['shipping.hsCode'] ? 'ring-1 ring-gray-300 border-gray-400' : 'border-gray-200'}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Content>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail