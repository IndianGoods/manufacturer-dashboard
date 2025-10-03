// Mock Products Data
export const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    sku: 'PWH-001',
    price: 299.99,
    compareAtPrice: 399.99,
    status: 'active',
    category: 'Electronics',
    inventory: 45,
    images: ['/api/placeholder/300/300https://images.unsplash.com/photo-1612858249937-1cc0852093dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    description: 'High-quality wireless headphones with noise cancellation',
    variants: [
      { 
        id: '1a', 
        name: 'Black', 
        color: '#000000',
        price: 299.99, 
        compareAtPrice: 399.99,
        inventory: {
          available: 25,
          committed: 5,
          onHand: 30,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'PWH-001-BLK',
        barcode: '123456789012',
        weight: 0.5,
        image: 'https://images.unsplash.com/photo-1612858249937-1cc0852093dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.5,
          countryOfOrigin: 'China',
          hsCode: '8518.30.00',
          packaging: 'Standard Box'
        },
        sellWhenOutOfStock: false,
        taxable: true
      },
      { 
        id: '1b', 
        name: 'White', 
        color: '#FFFFFF',
        price: 299.99, 
        compareAtPrice: 399.99,
        inventory: {
          available: 20,
          committed: 3,
          onHand: 23,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'PWH-001-WHT',
        barcode: '123456789013',
        weight: 0.5,
        image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?q=80&w=1326&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.5,
          countryOfOrigin: 'China',
          hsCode: '8518.30.00',
          packaging: 'Standard Box'
        },
        sellWhenOutOfStock: false,
        taxable: true
      },
    ],
    createdAt: '2024-09-15T10:00:00Z',
    updatedAt: '2024-09-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    sku: 'SWS-005',
    price: 249.99,
    compareAtPrice: null,
    status: 'active',
    category: 'Electronics',
    inventory: 32,
    images: ['https://images.unsplash.com/photo-1637160151663-a410315e4e75?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    description: 'Advanced smartwatch with health monitoring',
    variants: [
      { 
        id: '2a', 
        name: '42mm', 
        color: '#1F2937',
        price: 249.99, 
        compareAtPrice: null,
        inventory: {
          available: 15,
          committed: 2,
          onHand: 17,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'SWS-005-42',
        barcode: '234567890123',
        weight: 0.3,
        image: 'https://images.unsplash.com/photo-1637160151663-a410315e4e75?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.3,
          countryOfOrigin: 'South Korea',
          hsCode: '9102.11.00',
          packaging: 'Premium Box'
        },
        sellWhenOutOfStock: true,
        taxable: true
      },
      { 
        id: '2b', 
        name: '46mm', 
        color: '#1F2937',
        price: 279.99, 
        compareAtPrice: null,
        inventory: {
          available: 17,
          committed: 4,
          onHand: 21,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'SWS-005-46',
        barcode: '234567890124',
        weight: 0.35,
        image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.35,
          countryOfOrigin: 'South Korea',
          hsCode: '9102.11.00',
          packaging: 'Premium Box'
        },
        sellWhenOutOfStock: true,
        taxable: true
      },
    ],
    createdAt: '2024-09-10T08:15:00Z',
    updatedAt: '2024-09-25T12:20:00Z',
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    sku: 'OCT-101',
    price: 29.99,
    compareAtPrice: 39.99,
    status: 'active',
    category: 'Clothing',
    inventory: 120,
    images: ['https://images.unsplash.com/photo-1551304110-1487f449c468?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    description: 'Comfortable organic cotton t-shirt',
    variants: [
      { 
        id: '3a', 
        name: 'Small', 
        color: '#EF4444',
        price: 29.99, 
        compareAtPrice: 39.99,
        inventory: {
          available: 30,
          committed: 5,
          onHand: 35,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'OCT-101-S',
        barcode: '345678901234',
        weight: 0.2,
        image: 'https://images.unsplash.com/photo-1551304110-1487f449c468?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.2,
          countryOfOrigin: 'India',
          hsCode: '6109.10.00',
          packaging: 'Poly Bag'
        },
        sellWhenOutOfStock: false,
        taxable: true
      },
      { 
        id: '3b', 
        name: 'Medium', 
        color: '#3B82F6',
        price: 29.99, 
        compareAtPrice: 39.99,
        inventory: {
          available: 40,
          committed: 8,
          onHand: 48,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'OCT-101-M',
        barcode: '345678901235',
        weight: 0.22,
        image: 'https://images.unsplash.com/photo-1677709678785-bbe8227262cf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.22,
          countryOfOrigin: 'India',
          hsCode: '6109.10.00',
          packaging: 'Poly Bag'
        },
        sellWhenOutOfStock: false,
        taxable: true
      },
      { 
        id: '3c', 
        name: 'Large', 
        color: '#10B981',
        price: 29.99, 
        compareAtPrice: 39.99,
        inventory: {
          available: 35,
          committed: 10,
          onHand: 45,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'OCT-101-L',
        barcode: '345678901236',
        weight: 0.24,
        image: 'https://images.unsplash.com/photo-1664559779635-2d311613787e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.24,
          countryOfOrigin: 'India',
          hsCode: '6109.10.00',
          packaging: 'Poly Bag'
        },
        sellWhenOutOfStock: false,
        taxable: true
      },
      { 
        id: '3d', 
        name: 'XL', 
        color: '#8B5CF6',
        price: 29.99, 
        compareAtPrice: 39.99,
        inventory: {
          available: 15,
          committed: 3,
          onHand: 18,
          unavailable: {
            damaged: 0,
            qualityControl: 0,
            safetyStock: 0,
            other: 0
          }
        },
        sku: 'OCT-101-XL',
        barcode: '345678901237',
        weight: 0.26,
        image: 'https://images.unsplash.com/photo-1584014692701-25723252453f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        shipping: {
          weight: 0.26,
          countryOfOrigin: 'India',
          hsCode: '6109.10.00',
          packaging: 'Poly Bag'
        },
        sellWhenOutOfStock: false,
        taxable: true
      },
    ],
    createdAt: '2024-09-05T14:30:00Z',
    updatedAt: '2024-09-18T09:45:00Z',
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    sku: 'PCL-200',
    price: 899.99,
    compareAtPrice: null,
    status: 'draft',
    category: 'Photography',
    inventory: 8,
    images: ['https://images.unsplash.com/photo-1582994254571-52c62d96ebab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    description: '85mm f/1.4 professional portrait lens',
    variants: [],
    createdAt: '2024-09-20T16:00:00Z',
    updatedAt: '2024-09-20T16:00:00Z',
  },
]

// Mock Orders Data
export const mockOrders = [
  {
    id: 'ord-1',
    orderNumber: '#1001',
    customer: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
    },
    status: 'fulfilled',
    fulfillmentStatus: 'shipped',
    paymentStatus: 'paid',
    total: 329.98,
    subtotal: 299.98,
    tax: 24.00,
    shipping: 6.00,
    items: [
      {
        id: 'item-1',
        productId: '1',
        name: 'Premium Wireless Headphones',
        variant: 'Black',
        quantity: 1,
        price: 299.99,
      },
    ],
    shippingAddress: {
      name: 'John Smith',
      address1: '123 Main St',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
    createdAt: '2024-09-25T10:30:00Z',
    updatedAt: '2024-09-26T14:20:00Z',
  },
  {
    id: 'ord-2',
    orderNumber: '#1002',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
    },
    status: 'pending',
    fulfillmentStatus: 'unfulfilled',
    paymentStatus: 'paid',
    total: 279.99,
    subtotal: 249.99,
    tax: 20.00,
    shipping: 10.00,
    items: [
      {
        id: 'item-2',
        productId: '2',
        name: 'Smart Watch Series 5',
        variant: '42mm',
        quantity: 1,
        price: 249.99,
      },
    ],
    shippingAddress: {
      name: 'Sarah Johnson',
      address1: '456 Oak Ave',
      address2: '',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      country: 'United States',
    },
    createdAt: '2024-09-26T15:45:00Z',
    updatedAt: '2024-09-26T15:45:00Z',
  },
]

// Mock RFQs Data
export const mockRfqs = [
  {
    id: 'rfq-1',
    rfqNumber: 'RFQ-001',
    customer: {
      name: 'Tech Solutions Inc.',
      email: 'procurement@techsolutions.com',
      phone: '+1 (555) 234-5678',
      company: 'Tech Solutions Inc.',
    },
    status: 'pending',
    priority: 'high',
    products: [
      {
        name: 'Premium Wireless Headphones',
        quantity: 50,
        specifications: 'Bulk order for corporate use',
      },
      {
        name: 'Smart Watch Series 5',
        quantity: 25,
        specifications: 'Employee wellness program',
      },
    ],
    estimatedValue: 15000,
    deadline: '2024-10-15T23:59:59Z',
    notes: 'Looking for volume discount pricing',
    createdAt: '2024-09-20T09:15:00Z',
    updatedAt: '2024-09-22T11:30:00Z',
  },
  {
    id: 'rfq-2',
    rfqNumber: 'RFQ-002',
    customer: {
      name: 'Fashion Forward LLC',
      email: 'orders@fashionforward.com',
      phone: '+1 (555) 345-6789',
      company: 'Fashion Forward LLC',
    },
    status: 'quoted',
    priority: 'medium',
    products: [
      {
        name: 'Organic Cotton T-Shirt',
        quantity: 200,
        specifications: 'Custom printing required',
      },
    ],
    estimatedValue: 4500,
    deadline: '2024-10-30T23:59:59Z',
    notes: 'Need samples before final order',
    createdAt: '2024-09-18T14:20:00Z',
    updatedAt: '2024-09-24T16:45:00Z',
  },
]

// Mock Discounts Data
export const mockDiscounts = [
  {
    id: 'disc-1',
    title: 'Summer Sale 2024',
    code: 'SUMMER20',
    type: 'percentage',
    value: 20,
    status: 'active',
    usageLimit: 1000,
    usageCount: 245,
    minimumOrderValue: 50,
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    createdAt: '2024-05-25T10:00:00Z',
    updatedAt: '2024-07-15T14:30:00Z',
  },
  {
    id: 'disc-2',
    title: 'First Time Customer',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    status: 'active',
    usageLimit: null,
    usageCount: 89,
    minimumOrderValue: 25,
    startDate: '2024-01-01T00:00:00Z',
    endDate: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-09-01T09:15:00Z',
  },
  {
    id: 'disc-3',
    title: 'Holiday Special',
    code: 'HOLIDAY50',
    type: 'fixed',
    value: 50,
    status: 'scheduled',
    usageLimit: 500,
    usageCount: 0,
    minimumOrderValue: 200,
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    createdAt: '2024-09-15T12:00:00Z',
    updatedAt: '2024-09-15T12:00:00Z',
  },
]

// Mock Analytics Data
export const mockAnalytics = {
  overview: {
    totalSales: 125430.50,
    totalOrders: 1247,
    averageOrderValue: 100.58,
    totalCustomers: 892,
    conversionRate: 3.2,
  },
  salesData: [
    { date: '2024-09-20', sales: 2450.30, orders: 24 },
    { date: '2024-09-21', sales: 3120.75, orders: 31 },
    { date: '2024-09-22', sales: 1890.20, orders: 19 },
    { date: '2024-09-23', sales: 4320.50, orders: 43 },
    { date: '2024-09-24', sales: 2780.90, orders: 28 },
    { date: '2024-09-25', sales: 3650.40, orders: 37 },
    { date: '2024-09-26', sales: 2990.15, orders: 30 },
  ],
  topProducts: [
    { name: 'Premium Wireless Headphones', sales: 15420.50, units: 52 },
    { name: 'Smart Watch Series 5', sales: 12380.75, units: 49 },
    { name: 'Organic Cotton T-Shirt', sales: 8950.20, units: 298 },
    { name: 'Professional Camera Lens', sales: 7190.90, units: 8 },
  ],
  recentActivity: [
    {
      id: 'act-1',
      type: 'order',
      message: 'New order #1002 from Sarah Johnson',
      timestamp: '2024-09-26T15:45:00Z',
    },
    {
      id: 'act-2',
      type: 'product',
      message: 'Product "Premium Wireless Headphones" updated',
      timestamp: '2024-09-26T14:20:00Z',
    },
    {
      id: 'act-3',
      type: 'customer',
      message: 'New customer registration: Mike Chen',
      timestamp: '2024-09-26T12:30:00Z',
    },
    {
      id: 'act-4',
      type: 'rfq',
      message: 'RFQ-002 status updated to "quoted"',
      timestamp: '2024-09-26T10:15:00Z',
    },
  ],
}

// Mock User Data
export const mockUser = {
  id: 'user-1',
  name: 'Alex Thompson',
  email: 'alex@company.com',
  avatar: '/api/placeholder/40/40',
  role: 'admin',
  company: 'My Dashboard Store',
  permissions: ['all'],
}