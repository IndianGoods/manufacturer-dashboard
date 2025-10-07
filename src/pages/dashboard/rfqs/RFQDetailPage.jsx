import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { updateRfq, setSelectedRfq } from "../../../store/slices/rfqsSlice";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../../utils/helpers";

const RFQDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, selectedRfq } = useSelector((state) => state.rfqs);
  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [negotiation, setNegotiation] = useState({
    quantity: "",
    price: "",
    deliveryTime: "",
    comments: "",
  });

  useEffect(() => {
    // Find and set the selected RFQ
    const rfq = items.find((item) => item.id === id);
    if (rfq) {
      dispatch(setSelectedRfq(rfq));
    } else {
      // If RFQ not found, redirect to list
      navigate("/dashboard/rfqs");
    }
  }, [id, items, dispatch, navigate]);

  const breadcrumbItems = [
    { name: "RFQs", href: "/dashboard/rfqs" },
    { name: selectedRfq?.rfqNumber || "RFQ Detail" },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      quoted: "default",
      accepted: "success",
      expired: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "destructive",
      medium: "warning",
      low: "default",
    };
    return (
      <Badge variant={variants[priority] || "default"}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleAccept = () => {
    const updatedRfq = { ...selectedRfq, status: "accepted" };
    dispatch(updateRfq(updatedRfq));
    dispatch(setSelectedRfq(updatedRfq));
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const confirmDecline = () => {
    const updatedRfq = { ...selectedRfq, status: "expired" };
    dispatch(updateRfq(updatedRfq));
    dispatch(setSelectedRfq(updatedRfq));
    setShowDeclineModal(false);
  };

  const handleNegotiate = () => {
    setNegotiation({
      quantity: selectedRfq?.products?.[0]?.quantity || "",
      price: "",
      deliveryTime: "",
      comments: "",
    });
    setShowNegotiateModal(true);
  };

  const handleSendProposal = () => {
    const updatedRfq = { ...selectedRfq, status: "quoted" };
    dispatch(updateRfq(updatedRfq));
    dispatch(setSelectedRfq(updatedRfq));
    setShowNegotiateModal(false);
    // Here you would typically send the proposal to the customer
  };

  const isDeadlineClose = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  if (!selectedRfq) {
    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center py-12">
          <div className="text-gray-500">Loading RFQ details...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/rfqs")}
              className="p-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button> */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedRfq.rfqNumber}
              </h1>
              <p className="text-sm text-gray-500">
                Submitted on {formatDate(selectedRfq.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(selectedRfq.status)}
            {getPriorityBadge(selectedRfq.priority)}
          </div>
        </div>
      </div>

      {/* Deadline Warning */}
      {isDeadlineClose(selectedRfq.deadline) && selectedRfq.status === "pending" && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Deadline approaching
              </p>
              <p className="text-sm text-yellow-700">
                This RFQ expires on {formatDate(selectedRfq.deadline)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <Card.Title>Customer Information</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Company
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedRfq.customer.company}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Contact Person
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedRfq.customer.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedRfq.customer.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedRfq.customer.phone}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Product Details */}
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                <Card.Title>Product Requirements</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {selectedRfq.products.map((product, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Product Name
                        </label>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {product.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Quantity
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {product.quantity.toLocaleString()} units
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Specifications
                        </label>
                        <p className="text-sm text-gray-900 mt-1">
                          {product.specifications}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Additional Notes */}
          {selectedRfq.notes && (
            <Card>
              <Card.Header>
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <Card.Title>Additional Notes</Card.Title>
                </div>
              </Card.Header>
              <Card.Content>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedRfq.notes}
                </p>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <Card.Title>RFQ Summary</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Estimated Value
                  </label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {formatCurrency(selectedRfq.estimatedValue)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Deadline
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(selectedRfq.deadline)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Priority
                  </label>
                  <div className="mt-1">{getPriorityBadge(selectedRfq.priority)}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(selectedRfq.status)}</div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Actions */}
          {selectedRfq.status === "pending" && (
            <Card>
              <Card.Header>
                <Card.Title>Actions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Button
                    onClick={handleAccept}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Accept RFQ
                  </Button>
                  <Button
                    onClick={handleNegotiate}
                    variant="outline"
                    className="w-full"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Send Quote
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>

      {/* Negotiate Modal */}
      <Modal
        isOpen={showNegotiateModal}
        onClose={() => setShowNegotiateModal(false)}
        title="Send Quote"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Quantity
              </label>
              <input
                type="number"
                value={negotiation.quantity}
                onChange={(e) =>
                  setNegotiation({ ...negotiation, quantity: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Unit Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={negotiation.price}
                onChange={(e) =>
                  setNegotiation({ ...negotiation, price: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter price"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Delivery Time
            </label>
            <input
              type="text"
              value={negotiation.deliveryTime}
              onChange={(e) =>
                setNegotiation({ ...negotiation, deliveryTime: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 30-45 days"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Comments / Terms
            </label>
            <textarea
              value={negotiation.comments}
              onChange={(e) =>
                setNegotiation({ ...negotiation, comments: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="Add any additional terms or comments..."
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => setShowNegotiateModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendProposal}>Send Quote</Button>
        </div>
      </Modal>

      {/* Decline Confirmation Modal */}
      <Modal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        title="Decline RFQ"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to decline this RFQ? This action cannot be
            undone and the customer will be notified.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeclineModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDecline}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Decline RFQ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RFQDetailPage;