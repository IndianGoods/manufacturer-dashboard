import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { updateProduct, deleteProduct } from '../../../store/slices/productsSlice'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'
import Modal from '../../../components/ui/Modal'

const EditProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const { items } = useSelector((state) => state.products)
  
  const [product, setProduct] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    status: 'draft',
    productType: '',
    vendor: '',
    tags: [],
    variants: [
      {
        id: 1,
        option1: 'Default Title',
        price: '',
        compareAtPrice: '',
        costPerItem: '',
        sku: '',
        barcode: '',
        inventory: '',
        weight: '',
        requiresShipping: true,
        taxable: true,
      }
    ],
    options: [],
    seo: {
      title: '',
      description: '',
      url: '',
    },
    inventory: {
      trackQuantity: true,
      continueSellingWhenOutOfStock: false,
      thisIsAPhysicalProduct: true,
    },
    shipping: {
      weight: '',
      weightUnit: 'kg',
      customs: {
        hsCode: '',
        countryOfOrigin: '',
      }
    },
    visibility: {
      salesChannels: ['Online Store'],
      markets: ['All markets'],
    }
  })

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    const foundProduct = items.find(p => p.id.toString() === id)
    if (foundProduct) {
      setProduct(foundProduct)
      setFormData({
        title: foundProduct.name || '',
        description: foundProduct.description || '',
        images: foundProduct.images || [],
        status: foundProduct.status || 'draft',
        productType: foundProduct.category || '',
        vendor: foundProduct.vendor || '',
        tags: foundProduct.tags || [],
        variants: foundProduct.variants?.length > 0 ? foundProduct.variants : [
          {
            id: 1,
            option1: 'Default Title',
            price: foundProduct.price?.toString() || '',
            compareAtPrice: '',
            costPerItem: '',
            sku: foundProduct.sku || '',
            barcode: '',
            inventory: foundProduct.inventory?.toString() || '',
            weight: '',
            requiresShipping: true,
            taxable: true,
          }
        ],
        options: foundProduct.options || [],
        seo: foundProduct.seo || {
          title: '',
          description: '',
          url: '',
        },
        inventory: {
          trackQuantity: true,
          continueSellingWhenOutOfStock: false,
          thisIsAPhysicalProduct: true,
        },
        shipping: {
          weight: '',
          weightUnit: 'kg',
          customs: {
            hsCode: '',
            countryOfOrigin: '',
          }
        },
        visibility: {
          salesChannels: ['Online Store'],
          markets: ['All markets'],
        }
      })
    } else {
      navigate('/dashboard/products')
    }
  }, [id, items, navigate])

  const breadcrumbItems = [
    { name: 'Products', href: '/dashboard/products' },
    { name: product?.name || 'Edit product' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', description: 'Available in all sales channels' },
    { value: 'draft', label: 'Draft', description: 'Hidden from sales channels' },
    { value: 'archived', label: 'Archived', description: 'Unavailable in all sales channels' },
  ]

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleVariantChange = (variantIndex, field, value) => {
    const updatedVariants = [...formData.variants]
    updatedVariants[variantIndex] = {
      ...updatedVariants[variantIndex],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }))
  }

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      option1: '',
      price: '',
      compareAtPrice: '',
      costPerItem: '',
      sku: '',
      barcode: '',
      inventory: '',
      weight: '',
      requiresShipping: true,
      taxable: true,
    }
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }))
  }

  const removeVariant = (variantIndex) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, index) => index !== variantIndex)
      setFormData(prev => ({
        ...prev,
        variants: updatedVariants
      }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = (status = null) => {
    const updatedProduct = {
      ...product,
      ...formData,
      id: product.id,
      status: status || formData.status,
      name: formData.title,
      category: formData.productType,
      inventory: formData.variants.reduce((sum, variant) => sum + (parseInt(variant.inventory) || 0), 0),
      price: parseFloat(formData.variants[0]?.price || 0),
      sku: formData.variants[0]?.sku || '',
      updatedAt: new Date().toISOString(),
    }

    dispatch(updateProduct(updatedProduct))
    navigate('/dashboard/products')
  }

  const handleDelete = () => {
    dispatch(deleteProduct(product.id))
    navigate('/dashboard/products')
  }

  if (!product) {
    return <div>Loading...</div>
  }

  const ImageUploadArea = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Media</h3>
      </Card.Header>
      <Card.Content>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Add images, or drag and drop
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                JPG, PNG, WEBP, or GIF
              </span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
            </label>
          </div>
        </div>
      </Card.Content>
    </Card>
  )

  const ProductDetailsCard = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Product details</h3>
      </Card.Header>
      <Card.Content className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Short sleeve t-shirt"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe your product..."
          />
        </div>
      </Card.Content>
    </Card>
  )

  const PricingCard = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Pricing</h3>
      </Card.Header>
      <Card.Content className="space-y-4">
        {formData.variants.map((variant, index) => (
          <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">
                {formData.variants.length > 1 ? `Variant ${index + 1}` : 'Default variant'}
              </h4>
              {formData.variants.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Compare at price"
                type="number"
                step="0.01"
                value={variant.compareAtPrice}
                onChange={(e) => handleVariantChange(index, 'compareAtPrice', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Cost per item"
                type="number"
                step="0.01"
                value={variant.costPerItem}
                onChange={(e) => handleVariantChange(index, 'costPerItem', e.target.value)}
                placeholder="0.00"
              />
              <div></div>
              <Input
                label="SKU (Stock Keeping Unit)"
                value={variant.sku}
                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                placeholder="SKU"
              />
              <Input
                label="Barcode (ISBN, UPC, GTIN, etc.)"
                value={variant.barcode}
                onChange={(e) => handleVariantChange(index, 'barcode', e.target.value)}
                placeholder="Barcode"
              />
            </div>
          </div>
        ))}
        
        <Button variant="outline" onClick={addVariant} className="w-full">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add variant
        </Button>
      </Card.Content>
    </Card>
  )

  const InventoryCard = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Inventory</h3>
      </Card.Header>
      <Card.Content className="space-y-4">
        {formData.variants.map((variant, index) => (
          <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">
                {formData.variants.length > 1 ? `Variant ${index + 1}` : 'Inventory tracking'}
              </h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`track-${index}`}
                  checked={formData.inventory.trackQuantity}
                  onChange={(e) => handleInputChange('trackQuantity', e.target.checked, 'inventory')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor={`track-${index}`} className="text-sm text-gray-700">
                  Track quantity
                </label>
              </div>
              
              {formData.inventory.trackQuantity && (
                <Input
                  label="Quantity"
                  type="number"
                  value={variant.inventory}
                  onChange={(e) => handleVariantChange(index, 'inventory', e.target.value)}
                  placeholder="0"
                />
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`continue-selling-${index}`}
                  checked={formData.inventory.continueSellingWhenOutOfStock}
                  onChange={(e) => handleInputChange('continueSellingWhenOutOfStock', e.target.checked, 'inventory')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor={`continue-selling-${index}`} className="text-sm text-gray-700">
                  Continue selling when out of stock
                </label>
              </div>
            </div>
          </div>
        ))}
      </Card.Content>
    </Card>
  )

  const OrganizationCard = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Organization</h3>
      </Card.Header>
      <Card.Content className="space-y-4">
        <Input
          label="Product type"
          value={formData.productType}
          onChange={(e) => handleInputChange('productType', e.target.value)}
          placeholder="e.g. Shirts"
        />
        
        <Input
          label="Vendor"
          value={formData.vendor}
          onChange={(e) => handleInputChange('vendor', e.target.value)}
          placeholder="e.g. Nike"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button onClick={() => removeTag(tag)}>
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button variant="outline" onClick={addTag}>
              Add
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  )

  const StatusCard = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium">Product status</h3>
      </Card.Header>
      <Card.Content>
        <Dropdown
          trigger={
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  formData.status === 'active' ? 'bg-green-500' :
                  formData.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                {statusOptions.find(s => s.value === formData.status)?.label}
              </span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          }
        >
          {statusOptions.map((option) => (
            <Dropdown.Item
              key={option.value}
              onClick={() => handleInputChange('status', option.value)}
            >
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  option.value === 'active' ? 'bg-green-500' :
                  option.value === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown>
      </Card.Content>
    </Card>
  )

  const DeleteModal = () => (
    <Modal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      title="Delete product"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete "{product.name}"? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete product
          </Button>
        </div>
      </div>
    </Modal>
  )

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit product</h1>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete product
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/products')}
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSave('draft')}
            >
              Save as draft
            </Button>
            <Button 
              onClick={() => handleSave('active')}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Save product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <ProductDetailsCard />
          <ImageUploadArea />
          <PricingCard />
          <InventoryCard />
          
          {/* SEO Section */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Search engine listing</h3>
              <p className="text-sm text-gray-500">
                Add a title and description to see how this product might appear in a search engine listing
              </p>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Input
                label="Page title"
                value={formData.seo.title}
                onChange={(e) => handleInputChange('title', e.target.value, 'seo')}
                placeholder={formData.title || 'Page title'}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta description
                </label>
                <textarea
                  value={formData.seo.description}
                  onChange={(e) => handleInputChange('description', e.target.value, 'seo')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Meta description"
                />
              </div>
              <Input
                label="URL handle"
                value={formData.seo.url}
                onChange={(e) => handleInputChange('url', e.target.value, 'seo')}
                placeholder="url-handle"
              />
            </Card.Content>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <StatusCard />
          <OrganizationCard />
          
          {/* Preview Card */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Preview</h3>
            </Card.Header>
            <Card.Content>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {formData.title || 'Product title'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ${formData.variants[0]?.price || '0.00'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <DeleteModal />
    </div>
  )
}

export default EditProduct