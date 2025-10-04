import { useState } from 'react'
import {
  Building,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  SettingsIcon,
  Globe,
  Upload,
  X,
} from 'lucide-react'

// Navigation Configuration
const tabs = [
  { id: 'company', name: 'Company Profile', icon: Building },
  { id: 'payment', name: 'Payment & Billing', icon: CreditCardIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'policies', name: 'Policies', icon: SettingsIcon },
  { id: 'privacy', name: 'Privacy Policy', icon: ShieldCheckIcon },
  { id: 'status', name: 'Order Status', icon: Globe },
]

// Sidebar Navigation Component
function Sidebar({ activeTab, onTabChange }) {
  return (
    <nav className="space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {tab.name}
          </button>
        )
      })}
    </nav>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Company Profile</h2>
        <p className="mt-1 text-sm text-gray-600">Update your company information</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Company Logo</label>
          <div className="mt-2 flex items-center space-x-4">
            <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <Building className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <label className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              Change Logo
            </label>
            {logoPreview && (
              <button
                onClick={() => setLogoPreview(null)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>India</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tax ID / VAT</label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Payment & Billing</h2>
        <p className="mt-1 text-sm text-gray-600">Manage your payment methods and billing information</p>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">
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
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Default
                  </span>
                )}
                {!method.isDefault && (
                  <button
                    onClick={() => removePaymentMethod(method.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {showAddPayment ? (
          <div className="border-2 border-blue-300 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Add Payment Method</h3>
            <button
              onClick={addPaymentMethod}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Add Card
            </button>
            <button
              onClick={() => setShowAddPayment(false)}
              className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddPayment(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400"
          >
            + Add Payment Method
          </button>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Billing Address</h3>
        {editingAddress ? (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <input
              type="text"
              value={billingAddress.company}
              onChange={(e) => setBillingAddress({...billingAddress, company: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Company Name"
            />
            <input
              type="text"
              value={billingAddress.street}
              onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Street Address"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setEditingAddress(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setEditingAddress(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">{billingAddress.company}</p>
            <p className="text-sm text-gray-600">{billingAddress.street}</p>
            <p className="text-sm text-gray-600">{billingAddress.city}</p>
            <p className="text-sm text-gray-600">{billingAddress.country}</p>
            <button
              onClick={() => setEditingAddress(true)}
              className="mt-3 text-blue-600 hover:text-blue-900 text-sm"
            >
              Edit Address
            </button>
          </div>
        )}
      </div>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        <p className="mt-1 text-sm text-gray-600">Choose how you want to be notified</p>
      </div>

      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <div key={setting.name} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{setting.label}</p>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <input
              type="checkbox"
              name={setting.name}
              checked={formData[setting.name]}
              onChange={onChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">New Orders</p>
            <p className="text-sm text-gray-500">Notify when new orders are received</p>
          </div>
          <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500" />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">RFQ Requests</p>
            <p className="text-sm text-gray-500">Notify when new RFQs are submitted</p>
          </div>
          <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500" />
        </div>
      </div>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
        <p className="mt-1 text-sm text-gray-600">Manage your account security</p>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Password</h3>
          <p className="text-sm text-gray-600 mb-4">Last changed 3 months ago</p>
          
          {showPasswordChange ? (
            <div className="space-y-3 mt-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Change Password
            </button>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-600">Chrome on Windows - New York, US</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Active</span>
            </div>
          </div>
        </div>
      </div>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Business Policies</h2>
        <p className="mt-1 text-sm text-gray-600">Configure your company policies and terms</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Return Policy (Days)</label>
          <input
            type="number"
            name="returnPolicy"
            value={formData.returnPolicy}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Number of days customers can return products</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Warranty Period (Months)</label>
          <input
            type="number"
            name="warrantyPeriod"
            value={formData.warrantyPeriod}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Default warranty period for products</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Order Cancellation Window (Hours)</label>
          <input
            type="number"
            name="cancellationWindow"
            value={formData.cancellationWindow}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Time window for customers to cancel orders without penalty</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Policy Documents</h3>
          <div className="space-y-3">
            {policyDocs.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{policy.name}</p>
                  <p className="text-sm text-gray-500">Last updated: {policy.date}</p>
                </div>
                <button
                  onClick={() => handlePolicyEdit(policy.id)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                  disabled={editingPolicy === policy.id}
                >
                  {editingPolicy === policy.id ? 'Loading...' : 'Edit'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Privacy & Data Management</h2>
        <p className="mt-1 text-sm text-gray-600">Manage how customer data is collected and used</p>
      </div>

      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Privacy Policy</h3>
          <p className="text-sm text-gray-600 mb-3">Last updated: January 1, 2025</p>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit Privacy Policy
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data Retention Period (Years)</label>
          <input
            type="number"
            name="dataRetention"
            value={formData.dataRetention}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">How long customer data is stored after account closure</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Cookie Consent Banner</p>
              <p className="text-sm text-gray-500">Display cookie consent banner to visitors</p>
            </div>
            <input
              type="checkbox"
              name="cookieConsent"
              checked={formData.cookieConsent}
              onChange={onChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Analytics Tracking</p>
              <p className="text-sm text-gray-500">Allow analytics tracking for platform improvement</p>
            </div>
            <input
              type="checkbox"
              name="analyticsEnabled"
              checked={formData.analyticsEnabled}
              onChange={onChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Data Compliance</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">GDPR Compliant</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">CCPA Compliant</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Customer Data Requests</h3>
          <p className="text-sm text-blue-700 mb-3">Handle customer requests for data access, export, or deletion</p>
          <button
            onClick={() => setShowDataRequests(!showDataRequests)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            {showDataRequests ? 'Hide' : 'View'} Data Requests
          </button>
          
          {showDataRequests && (
            <div className="mt-4 space-y-2">
              {dataRequests.map((req) => (
                <div key={req.id} className="bg-white rounded p-3 border border-blue-200">
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
      </div>
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Order Acceptance Status</h2>
        <p className="mt-1 text-sm text-gray-600">Manage whether your facility is accepting new orders</p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-900">Currently Accepting Orders</h3>
            <p className="text-sm text-gray-500 mt-1">Toggle to temporarily close your facility for new orders</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="acceptingOrders"
              checked={formData.acceptingOrders}
              onChange={onChange}
              className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Reason for Closure</label>
            <select
              name="closureReason"
              value={formData.closureReason}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700">Closure Start Date</label>
              <input
                type="date"
                name="closureStartDate"
                value={formData.closureStartDate}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Reopening Date</label>
              <input
                type="date"
                name="closureEndDate"
                value={formData.closureEndDate}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
        <h3 className="text-sm font-medium text-gray-900 mb-3">Status History</h3>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account and application preferences</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="mt-5 lg:mt-0 lg:col-span-9">
            <div className="bg-white rounded-lg shadow">
              {renderContent()}

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div>
                  {hasChanges && (
                    <span className="text-sm text-amber-600 font-medium">
                      You have unsaved changes
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      hasChanges
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}