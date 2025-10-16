import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Card from "../../../components/ui/Card";
import { mockRfqs } from "../../../data/mockData";

const RfqChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState(null);
  const [rfqs, setRfqs] = useState(mockRfqs);
  const [replyMessage, setReplyMessage] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Find RFQ by ID from mock data
    const foundRfq = mockRfqs.find((r) => r.id === id);
    if (foundRfq) {
      setRfq(foundRfq);
    }
  }, [id]);

  const getPriorityBadge = (priority) => {
    const variants = {
      high: "destructive",
      medium: "warning",
      low: "default",
    };
    return (
      <Badge variant={variants[priority] || "default"} size="sm">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      quoted: "default",
      accepted: "success",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"} size="sm">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReply = () => {
    if (!replyMessage.trim()) return;

    const updatedRfq = {
      ...rfq,
      updatedAt: new Date().toISOString(),
      responses: [
        ...rfq.responses,
        {
          sender: "Your Company",
          role: "manufacturer",
          timestamp: new Date().toISOString(),
          message: replyMessage,
          attachments: [],
        },
      ],
    };

    setRfqs(rfqs.map((r) => (r.id === rfq.id ? updatedRfq : r)));
    setRfq(updatedRfq);
    setReplyMessage("");
    showNotification("Reply sent successfully!");
  };

  const handleStatusChange = (newStatus) => {
    const updatedRfq = {
      ...rfq,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...rfq.statusHistory,
        { status: newStatus, timestamp: new Date().toISOString() },
      ],
    };

    setRfqs(rfqs.map((r) => (r.id === rfq.id ? updatedRfq : r)));
    setRfq(updatedRfq);
    showNotification(`RFQ marked as ${newStatus}`);
  };

  if (!rfq) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            RFQ not found
          </h2>
          <p className="text-gray-500 mt-2">
            The RFQ you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/dashboard/rfqs")}
            className="mt-4"
          >
            Back to RFQs
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "RFQs", href: "/dashboard/rfqs" },
    { name: rfq.rfqNumber },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {rfq.customer.company}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="font-mono text-primary-600 font-medium">
                  {rfq.rfqNumber}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {formatDate(rfq.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(rfq.priority)}
            {getStatusBadge(rfq.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* RFQ Header */}
          <Card>
            <Card.Content className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Customer Contact
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {rfq.customer.name}
                  </p>
                  <p className="text-xs text-gray-500">{rfq.customer.email}</p>
                  <p className="text-xs text-gray-500">{rfq.customer.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Estimated Value
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    ${rfq.estimatedValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Deadline
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(rfq.deadline)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Products Requested
                </p>
                <div className="space-y-2">
                  {rfq.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-start bg-gray-50 p-3 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.specifications}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-600">Qty: {product.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {rfq.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Additional Notes
                  </p>
                  <p className="text-sm text-gray-700">{rfq.notes}</p>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Conversation Thread */}
          <Card className="flex flex-col h-relative">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Conversation
              </Card.Title>
            </Card.Header>

            {/* Scrollable message area */}
            <Card.Content className="p-6 space-y-2 overflow-y-auto max-h-[400px]">
              {rfq.responses.map((response, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 p-4 rounded-lg ${
                    response.role === "manufacturer" ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        response.role === "manufacturer"
                          ? "bg-primary-600"
                          : "bg-gray-600"
                      } text-white font-semibold text-xs`}
                    >
                      {response.sender.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-gray-900 text-sm break-words">
                        {response.sender}
                      </span>
                      {response.role === "manufacturer" && (
                        <Badge variant="default" size="sm">
                          Your Team
                        </Badge>
                      )}
                      {response.role === "customer" && (
                        <Badge variant="outline" size="sm">
                          Customer
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(response.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {response.message}
                    </p>

                    {response.attachments && response.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {response.attachments.map((file, fileIdx) => (
                          <div
                            key={fileIdx}
                            className="flex items-center gap-2 text-xs text-primary-600 break-all"
                          >
                            <PaperClipIcon className="h-3 w-3 flex-shrink-0" />
                            <span>{file}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Card.Content>

            {/* Reply Section */}
            {rfq.status !== "rejected" && rfq.status !== "accepted" && (
              <Card.Footer className="bg-gray-50 mt-auto">
                <div className="space-y-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to the customer..."
                    rows={4}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm">
                      <PaperClipIcon className="h-4 w-4 mr-1" />
                      Attach Files
                    </Button>
                    <Button
                      onClick={handleReply}
                      disabled={!replyMessage.trim()}
                      size="sm"
                    >
                      <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Actions</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                {rfq.status === "pending" && (
                  <Button
                    onClick={() => handleStatusChange("quoted")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Quoted
                  </Button>
                )}

                {rfq.status === "quoted" && (
                  <>
                    <Button
                      onClick={() => handleStatusChange("accepted")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Mark as Accepted
                    </Button>
                    <Button
                      onClick={() => handleStatusChange("rejected")}
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Mark as Rejected
                    </Button>
                  </>
                )}

                {(rfq.status === "accepted" || rfq.status === "rejected") && (
                  <Button
                    onClick={() => handleStatusChange("pending")}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Re-open RFQ
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Status History */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                Status History
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {rfq.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        history.status === "rejected"
                          ? "bg-red-500"
                          : history.status === "accepted"
                          ? "bg-green-500"
                          : history.status === "quoted"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">
                        {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(history.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* RFQ Info */}
          <Card>
            <Card.Header>
              <Card.Title>RFQ Details</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Priority Level
                  </p>
                  <div className="mt-1">
                    {getPriorityBadge(rfq.priority)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Current Status
                  </p>
                  <div className="mt-1">{getStatusBadge(rfq.status)}</div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Created
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(rfq.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(rfq.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Deadline
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(rfq.deadline)}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RfqChat;
