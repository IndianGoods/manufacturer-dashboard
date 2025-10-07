import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArchiveBoxIcon,
  CreditCardIcon,
  MapPinIcon,
  TruckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { mockOrders } from '../../../data/mockData';
import Breadcrumbs from '../../../components/layout/Breadcrumbs';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    carrier: '',
    status: 'pending_shipment',
    estimatedDelivery: '',
    trackingUrl: ''
  });
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    // Find order by ID from mock data
    const foundOrder = mockOrders.find(o => o.id === id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [id]);

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Order not found</h2>
          <p className="text-gray-500 mt-2">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleMarkAsPaid = () => {
    setOrder(prev => ({
      ...prev,
      paymentStatus: 'paid'
    }));
  };

  const handleMarkAsFulfilled = () => {
    setOrder(prev => ({
      ...prev,
      fulfillmentStatus: 'fulfilled',
      status: 'fulfilled'
    }));
  };

  const handleAddTracking = () => {
    if (trackingInfo.trackingNumber && trackingInfo.carrier) {
      setOrder(prev => ({
        ...prev,
        status: 'shipped',
        tracking: trackingInfo
      }));
      setShowTrackingForm(false);
      setShowSnackbar(true);
    } else {
      alert('Please fill in tracking number and carrier.');
    }
  };

  const handleMarkAsDelivered = () => {
    setOrder(prev => ({
      ...prev,
      status: 'delivered',
      tracking: {
        ...prev.tracking,
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      }
    }));
  };

  const handleDuplicate = () => {
    alert('Order duplicated!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Order link copied to clipboard!');
  };

  const handleReturn = () => {
    alert('Return initiated');
  };

  const handleRefund = () => {
    alert('Refund initiated');
  };

  const filteredItems = order.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.variant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const igstRate = 0.18;
  const igstAmount = order.subtotal * igstRate;
  const finalTotal = order.subtotal - (order.discount || 0) + order.shipping + igstAmount;

  const breadcrumbItems = [
    { name: 'Orders', href: '/dashboard/orders' },
    { name: order.orderNumber }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'fulfilled':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
      case 'shipped':
        return <TruckIcon className="w-5 h-5" />;
      case 'fulfilled':
        return <ArchiveBoxIcon className="w-5 h-5" />;
      default:
        return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Order Status Banner */}
      {(order.status === 'fulfilled' || order.status === 'shipped' || order.status === 'delivered') && (
        <div className={`${getStatusColor(order.status)} border rounded-xl p-4 mb-6 flex items-center gap-3 shadow-sm`}>
          {getStatusIcon(order.status)}
          <div className="flex-1">
            <span className="font-semibold text-sm">
              {order.status === 'fulfilled' && 'Order Fulfilled'}
              {order.status === 'shipped' && 'Order Shipped'}
              {order.status === 'delivered' && 'Order Delivered'}
            </span>
            {order.tracking?.trackingNumber && (
              <span className="text-sm ml-3 opacity-75">
                • Tracking: {order.tracking.trackingNumber}
              </span>
            )}
          </div>
        </div>
      )}
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Content className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
                  <p className="text-gray-600 mt-1 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {order.paymentStatus === 'paid' && order.fulfillmentStatus === 'fulfilled' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReturn}
                      >
                        Return
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefund}
                      >
                        Refund
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDuplicate}
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Customer Info */}
        <div>
          <Card>
            <Card.Content className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-sm">{order.customer.name.charAt(0)}</span>
                </div>
                Customer
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium text-gray-900">{order.customer.name}</p>
                {/* <p className="text-gray-600">{order.customer.email}</p>
                <p className="text-gray-600">{order.customer.phone}</p> */}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

        {/* Items Table */}
        <Card className="mb-6">
          <Card.Header>
            <div className="flex items-center gap-3">
              <ArchiveBoxIcon className="w-5 h-5 text-gray-600" />
              <Card.Title>Order Items</Card.Title>
            </div>
          </Card.Header>
          
          <Card.Content>
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Variant</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-900 text-sm font-medium">{item.name}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">{item.variant}</td>
                      <td className="py-4 px-4 text-center text-gray-900 text-sm">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md font-medium">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-900 text-sm">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <ArchiveBoxIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <div className="text-sm text-gray-500">
                  {searchQuery ? 'No items found matching your search.' : 'No items in this order.'}
                </div>
              </div>
            )}
          </Card.Content>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Section */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-gray-600" />
                <Card.Title>Payment</Card.Title>
              </div>
            </Card.Header>
            
            <Card.Content className="space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Discount</span>
                  <span className="font-medium text-gray-900">-${(order.discount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>IGST (18%)</span>
                  <span className="font-medium text-gray-900">${igstAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="payLater"
                    name="payment"
                    checked={order.paymentStatus === 'unpaid'}
                    readOnly
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="payLater" className="text-gray-700 text-sm font-medium cursor-pointer">
                    Payment due later
                  </label>
                </div>

                {order.paymentStatus === 'unpaid' && (
                  <Button
                    onClick={handleMarkAsPaid}
                    className="w-full"
                  >
                    Mark as Paid
                  </Button>
                )}

                {order.paymentStatus === 'paid' && order.fulfillmentStatus !== 'fulfilled' && (
                  <Button
                    onClick={handleMarkAsFulfilled}
                    className="w-full"
                  >
                    Mark as Fulfilled
                  </Button>
                )}

                {order.paymentStatus === 'paid' && order.fulfillmentStatus === 'fulfilled' && order.status === 'fulfilled' && (
                  <Button
                    onClick={() => setShowTrackingForm(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <TruckIcon className="w-4 h-4" />
                    Add Tracking Info
                  </Button>
                )}

                {order.status === 'shipped' && (
                  <Button
                    onClick={handleMarkAsDelivered}
                    className="w-full"
                  >
                    Mark as Delivered
                  </Button>
                )}

                {order.status === 'delivered' && (
                  <div className="text-center py-3 bg-green-50 rounded-lg text-green-700 font-semibold text-sm border border-green-200">
                    ✓ Order Delivered
                  </div>
                )}

                {(order.paymentStatus === 'paid' && order.fulfillmentStatus === 'fulfilled' && order.status !== 'fulfilled' && order.status !== 'shipped' && order.status !== 'delivered') && (
                  <div className="text-center py-3 bg-purple-50 rounded-lg text-purple-700 font-semibold text-sm border border-purple-200">
                    ✓ Order Fulfilled
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Shipping Address */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-600" />
                <Card.Title>Shipping Address</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm space-y-2">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p className="font-medium text-gray-900">{order.shippingAddress.country}</p>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Tracking Information */}
        {order.tracking && (
          <Card className="mt-6">
            <Card.Header>
              <div className="flex items-center gap-3">
                <TruckIcon className="w-5 h-5 text-gray-600" />
                <Card.Title>Tracking Information</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Tracking Number</label>
                  <p className="text-gray-900 font-semibold">{order.tracking.trackingNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Carrier</label>
                  <p className="text-gray-900 font-semibold">{order.tracking.carrier}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Status</label>
                  <p className="text-gray-900 font-semibold capitalize">{order.tracking.status.replace('_', ' ')}</p>
                </div>
                {order.tracking.estimatedDelivery && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Estimated Delivery</label>
                    <p className="text-gray-900 font-semibold">{new Date(order.tracking.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                )}
                {order.tracking.deliveredAt && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Delivered At</label>
                    <p className="text-gray-900 font-semibold">{new Date(order.tracking.deliveredAt).toLocaleString()}</p>
                  </div>
                )}
                {order.tracking.trackingUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wider">Track Package</label>
                    <a 
                      href={order.tracking.trackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 font-semibold underline hover:text-primary-700 transition-colors"
                    >
                      View on Carrier Website →
                    </a>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Tracking Form Modal */}
        {showTrackingForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Tracking Information</h3>
                <button
                  onClick={() => setShowTrackingForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tracking Number *</label>
                  <input
                    type="text"
                    value={trackingInfo.trackingNumber}
                    onChange={(e) => setTrackingInfo(prev => ({...prev, trackingNumber: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Enter tracking number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Carrier *</label>
                  <select
                    value={trackingInfo.carrier}
                    onChange={(e) => setTrackingInfo(prev => ({...prev, carrier: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="">Select carrier</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="USPS">USPS</option>
                    <option value="DHL">DHL</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowTrackingForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTracking}
                  className="flex-1"
                >
                  Add Tracking
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
        {showSnackbar && (
          <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-up z-50">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            <span className="font-medium">Tracking information added successfully!</span>
          </div>
        )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage;