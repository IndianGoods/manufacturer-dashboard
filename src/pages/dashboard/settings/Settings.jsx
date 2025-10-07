import { useState } from 'react'
import {
  BuildingOfficeIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'

// Navigation Configuration
const tabs = [
  { id: 'company', name: 'Company Profile', icon: BuildingOfficeIcon },
  { id: 'payment', name: 'Payment & Billing', icon: CreditCardIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'policies', name: 'Policies', icon: Cog6ToothIcon },
  { id: 'privacy', name: 'Privacy Policy', icon: ShieldCheckIcon },
  { id: 'status', name: 'Order Status', icon: GlobeAltIcon },
]

// Sidebar Navigation Component
function Sidebar({ activeTab, onTabChange }) {
  return (
    <Card>
      <Card.Content className="p-0">
        <nav className="space-y-1 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${
                  activeTab === tab.id ? 'text-primary-600' : 'text-gray-500'
                }`} />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </Card.Content>
    </Card>
  )
}

// Company Profile Component
function CompanyProfile({ formData, onChange }) {
  const [logoPreview, setLogoPreview] = useState(null)

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-6">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Company Profile</Card.Title>
        <p className="mt-1 text-sm text-gray-600">Update your company information</p>
      </Card.Header>

      <Card.Content className="px-0 pb-0">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <Button variant="outline" size="sm">
                    <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                    Change Logo
                  </Button>
                </label>
                {logoPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogoPreview(null)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / VAT</label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
          </div>
        </div>
      </Card.Content>
    </div>
  )
}

// Payment & Billing Component
function PaymentBilling({ formData }) {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Bank Account', last4: '1234', isDefault: true }
  ])
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [billingAddress, setBillingAddress] = useState({
    company: formData.companyName,
    street: formData.address,
    city: formData.city,
    country: formData.country,
  })

  const addPaymentMethod = () => {
    const newMethod = {
      id: Date.now(),
      type: 'Credit Card',
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      isDefault: false
    }
    setPaymentMethods([...paymentMethods, newMethod])
    setShowAddPayment(false)
  }

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(m => m.id !== id))
  }

  return (
    <div className="p-6">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Payment & Billing</Card.Title>
        <p className="mt-1 text-sm text-gray-600">Manage your payment methods and billing information</p>
      </Card.Header>

      <Card.Content className="px-0 pb-0 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                      <span className="text-xs font-medium text-gray-600">
                        {method.type === 'Bank Account' ? 'BANK' : 'CARD'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{method.type}</p>
                      <p className="text-sm text-gray-500">****{method.last4}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                        Default
                      </span>
                    )}
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePaymentMethod(method.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {showAddPayment ? (
              <div className="border-2 border-primary-200 bg-primary-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Add Payment Method</h4>
                <div className="flex space-x-3">
                  <Button
                    onClick={addPaymentMethod}
                    className="flex-1"
                  >
                    Add Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddPayment(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddPayment(true)}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                + Add Payment Method
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Billing Address</h3>
          {editingAddress ? (
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <input
                type="text"
                value={billingAddress.company}
                onChange={(e) => setBillingAddress({...billingAddress, company: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
                placeholder="Company Name"
              />
              <input
                type="text"
                value={billingAddress.street}
                onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
                placeholder="Street Address"
              />
              <div className="flex space-x-3">
                <Button
                  onClick={() => setEditingAddress(false)}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingAddress(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">{billingAddress.company}</p>
              <p className="text-sm text-gray-600">{billingAddress.street}</p>
              <p className="text-sm text-gray-600">{billingAddress.city}</p>
              <p className="text-sm text-gray-600">{billingAddress.country}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingAddress(true)}
                className="mt-3"
              >
                Edit Address
              </Button>
            </div>
          )}
        </div>
      </Card.Content>
    </div>
  )
}

// Notifications Component
function Notifications({ formData, onChange }) {
  const notificationSettings = [
    {
      name: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
    },
    {
      name: 'smsNotifications',
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
    },
    {
      name: 'inventoryAlerts',
      label: 'Inventory Alerts',
      description: 'Get alerts when inventory is low',
    },
  ]

  return (
    <div className="p-6">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Notification Preferences</Card.Title>
        <p className="mt-1 text-sm text-gray-600">Choose how you want to be notified</p>
      </Card.Header>

      <Card.Content className="px-0 pb-0">
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {notificationSettings.map((setting) => (
            <div key={setting.name} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name={setting.name}
                  checked={formData[setting.name]}
                  onChange={onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}

          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">New Orders</p>
              <p className="text-sm text-gray-500">Notify when new orders are received</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">RFQ Requests</p>
              <p className="text-sm text-gray-500">Notify when new RFQs are submitted</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card.Content>
    </div>
  )
}

// Security Component
function Security() {
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert('Passwords do not match!')
      return
    }
    if (passwords.new.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }
    alert('Password changed successfully!')
    setShowPasswordChange(false)
    setPasswords({ current: '', new: '', confirm: '' })
  }

  return (
    <div className="p-6">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Security Settings</Card.Title>
        <p className="mt-1 text-sm text-gray-600">Manage your account security</p>
      </Card.Header>

      <Card.Content className="px-0 pb-0 space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Password</h3>
          <p className="text-sm text-gray-600 mb-4">Last changed 3 months ago</p>
          
          {showPasswordChange ? (
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
              />
              <div className="flex space-x-3">
                <Button onClick={handlePasswordChange}>
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowPasswordChange(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Active Sessions</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Current Session</p>
              <p className="text-sm text-gray-600">Chrome on Windows - New York, US</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </Card.Content>
    </div>
  )
}

// Policies Component
function Policies({ formData, onChange }) {
  const [editingPolicy, setEditingPolicy] = useState(null)
  const [policyDocs, setPolicyDocs] = useState([
    { id: 'terms', name: 'Terms & Conditions', date: 'Jan 15, 2025' },
    { id: 'shipping', name: 'Shipping Policy', date: 'Jan 10, 2025' },
    { id: 'refund', name: 'Refund Policy', date: 'Dec 20, 2024' },
  ])

  const handlePolicyEdit = (id) => {
    setEditingPolicy(id)
    setTimeout(() => {
      alert(`Editing ${policyDocs.find(p => p.id === id).name}`)
      setEditingPolicy(null)
    }, 500)
  }

  return (
    <div className="p-6">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Business Policies</Card.Title>
        <p className="mt-1 text-sm text-gray-600">Configure your company policies and terms</p>
      </Card.Header>

      <Card.Content className="px-0 pb-0 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy (Days)</label>
            <input
              type="number"
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
            <p className="mt-1 text-sm text-gray-500">Number of days customers can return products</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Period (Months)</label>
            <input
              type="number"
              name="warrantyPeriod"
              value={formData.warrantyPeriod}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
            <p className="mt-1 text-sm text-gray-500">Default warranty period for products</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Cancellation Window (Hours)</label>
            <input
              type="number"
              name="cancellationWindow"
              value={formData.cancellationWindow}
              onChange={onChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
            />
            <p className="mt-1 text-sm text-gray-500">Time window for customers to cancel orders without penalty</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Policy Documents</h3>
          <div className="space-y-3">
            {policyDocs.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{policy.name}</p>
                  <p className="text-sm text-gray-500">Last updated: {policy.date}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePolicyEdit(policy.id)}
                  disabled={editingPolicy === policy.id}
                >
                  {editingPolicy === policy.id ? 'Loading...' : 'Edit'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </div>
  )
}

// Privacy Component
function Privacy({ formData, onChange }) {
  const [showDataRequests, setShowDataRequests] = useState(false)
  const [dataRequests] = useState([
    { id: 1, type: 'Data Export', customer: 'John Smith', date: '2025-01-20', status: 'Pending' },
    { id: 2, type: 'Data Deletion', customer: 'Jane Doe', date: '2025-01-18', status: 'Completed' },
  ])

  return (
    <div className="p-6">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Privacy & Data Management</Card.Title>
        <p className="mt-1 text-sm text-gray-600">Manage how customer data is collected and used</p>
      </Card.Header>

      <Card.Content className="px-0 pb-0 space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Privacy Policy</h3>
          <p className="text-sm text-gray-600 mb-4">Last updated: January 1, 2025</p>
          <Button variant="outline">
            Edit Privacy Policy
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period (Years)</label>
          <input
            type="number"
            name="dataRetention"
            value={formData.dataRetention}
            onChange={onChange}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
          />
          <p className="mt-1 text-sm text-gray-500">How long customer data is stored after account closure</p>
        </div>

        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Cookie Consent Banner</p>
              <p className="text-sm text-gray-500">Display cookie consent banner to visitors</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="cookieConsent"
                checked={formData.cookieConsent}
                onChange={onChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Analytics Tracking</p>
              <p className="text-sm text-gray-500">Allow analytics tracking for platform improvement</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="analyticsEnabled"
                checked={formData.analyticsEnabled}
                onChange={onChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Data Compliance</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">GDPR Compliant</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">CCPA Compliant</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        <div className="border-2 border-primary-200 bg-primary-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-900 mb-2">Customer Data Requests</h3>
          <p className="text-sm text-primary-700 mb-4">Handle customer requests for data access, export, or deletion</p>
          <Button
            onClick={() => setShowDataRequests(!showDataRequests)}
            className="mb-4"
          >
            {showDataRequests ? 'Hide' : 'View'} Data Requests
          </Button>
          
          {showDataRequests && (
            <div className="space-y-3">
              {dataRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-lg p-3 border border-primary-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{req.type}</p>
                      <p className="text-xs text-gray-600">{req.customer} - {req.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      req.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card.Content>
    </div>
  )
}

// Order Status Component
function OrderStatus({ formData, onChange }) {
  const [statusHistory] = useState([
    { type: 'open', message: 'Facility Reopened', date: 'January 15, 2025 at 9:00 AM' },
    { type: 'closed', message: 'Facility Closed - Holiday', date: 'January 1, 2025 at 12:00 AM' },
  ])

  return (
    <div className="p-6">
      <Card.Header className="px-0 pt-0">
        <Card.Title>Order Acceptance Status</Card.Title>
        <p className="mt-1 text-sm text-gray-600">Manage whether your facility is accepting new orders</p>
      </Card.Header>

      <Card.Content className="px-0 pb-0 space-y-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-gray-900">Currently Accepting Orders</h3>
              <p className="text-sm text-gray-500 mt-1">Toggle to temporarily close your facility for new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="acceptingOrders"
                checked={formData.acceptingOrders}
                onChange={onChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className={`p-4 rounded-lg ${formData.acceptingOrders ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-3 ${formData.acceptingOrders ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${formData.acceptingOrders ? 'text-green-800' : 'text-red-800'}`}>
                {formData.acceptingOrders ? 'Facility is OPEN for orders' : 'Facility is CLOSED for orders'}
              </span>
            </div>
          </div>
        </div>

        {!formData.acceptingOrders && (
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Closure Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Closure</label>
              <select
                name="closureReason"
                value={formData.closureReason}
                onChange={onChange}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
              >
                <option value="">Select reason</option>
                <option value="maintenance">Scheduled Maintenance</option>
                <option value="capacity">At Full Capacity</option>
                <option value="holiday">Holiday/Vacation</option>
                <option value="emergency">Emergency Closure</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closure Start Date</label>
                <input
                  type="date"
                  name="closureStartDate"
                  value={formData.closureStartDate}
                  onChange={onChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Reopening Date</label>
                <input
                  type="date"
                  name="closureEndDate"
                  value={formData.closureEndDate}
                  onChange={onChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> While closed, customers will see a message that you're not accepting new orders. Existing orders will continue to be processed.
              </p>
            </div>
          </div>
        )}

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Status History</h3>
          <div className="space-y-3">
            {statusHistory.map((entry, idx) => (
              <div key={idx} className="flex items-start">
                <div className={`h-2 w-2 rounded-full mr-3 mt-2 ${entry.type === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.message}</p>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </div>
  )
}

// Main Settings Component
export default function Settings() {
  const [activeTab, setActiveTab] = useState('company')
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({
    companyName: 'Acme Manufacturing',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Industrial Ave',
    city: 'New York',
    country: 'United States',
    taxId: 'TAX-12345',
    emailNotifications: true,
    smsNotifications: false,
    inventoryAlerts: true,
    acceptingOrders: true,
    closureReason: '',
    closureStartDate: '',
    closureEndDate: '',
    returnPolicy: '30',
    warrantyPeriod: '12',
    cancellationWindow: '24',
    dataRetention: '7',
    cookieConsent: true,
    analyticsEnabled: true,
  })

  const breadcrumbItems = [{ name: 'Settings' }]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      alert('Settings saved successfully!')
      setHasChanges(false)
    }, 500)
  }

  const handleCancel = () => {
    if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return
    }
    setHasChanges(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyProfile formData={formData} onChange={handleInputChange} />
      case 'payment':
        return <PaymentBilling formData={formData} />
      case 'notifications':
        return <Notifications formData={formData} onChange={handleInputChange} />
      case 'security':
        return <Security />
      case 'policies':
        return <Policies formData={formData} onChange={handleInputChange} />
      case 'privacy':
        return <Privacy formData={formData} onChange={handleInputChange} />
      case 'status':
        return <OrderStatus formData={formData} onChange={handleInputChange} />
      default:
        return null
    }
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your account and application preferences</p>
          </div>
          {hasChanges && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-amber-600 font-medium">
                You have unsaved changes
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <Card.Content className="p-0">
              {renderContent()}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}