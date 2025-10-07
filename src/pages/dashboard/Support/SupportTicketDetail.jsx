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
import { mockSupportTickets } from "../../../data/mockData";

const SupportTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [tickets, setTickets] = useState(mockSupportTickets);
  const [replyMessage, setReplyMessage] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Find ticket by ID from mock data
    const foundTicket = mockSupportTickets.find((t) => t.id === id);
    if (foundTicket) {
      setTicket(foundTicket);
    }
  }, [id]);

  const getPriorityBadge = (priority) => {
    const variants = {
      Urgent: "destructive",
      High: "warning",
      Medium: "default",
      Low: "default",
    };
    return (
      <Badge variant={variants[priority] || "default"} size="sm">
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      Open: "warning",
      "In Progress": "default",
      Resolved: "success",
      Closed: "default",
    };
    return (
      <Badge variant={variants[status] || "default"} size="sm">
        {status}
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

    const updatedTicket = {
      ...ticket,
      lastUpdated: new Date().toISOString(),
      responses: [
        ...ticket.responses,
        {
          sender: "Current User",
          role: "user",
          timestamp: new Date().toISOString(),
          message: replyMessage,
          attachments: [],
        },
      ],
    };

    setTickets(tickets.map((t) => (t.id === ticket.id ? updatedTicket : t)));
    setTicket(updatedTicket);
    setReplyMessage("");
    showNotification("Reply sent successfully!");
  };

  const handleStatusChange = (newStatus) => {
    const updatedTicket = {
      ...ticket,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        ...ticket.statusHistory,
        { status: newStatus, timestamp: new Date().toISOString() },
      ],
    };

    setTickets(tickets.map((t) => (t.id === ticket.id ? updatedTicket : t)));
    setTicket(updatedTicket);
    showNotification(`Ticket marked as ${newStatus}`);
  };

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Ticket not found
          </h2>
          <p className="text-gray-500 mt-2">
            The ticket you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/dashboard/support")}
            className="mt-4"
          >
            Back to Support
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Support", href: "/dashboard/support" },
    { name: ticket.id },
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
            {/* <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/support")}
              className="p-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button> */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {ticket.subject}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="font-mono text-primary-600 font-medium">
                  {ticket.id}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {formatDate(ticket.createdDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(ticket.priority)}
            {getStatusBadge(ticket.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <Card>
            <Card.Content className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Category
                  </p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <TagIcon className="h-3 w-3" />
                    {ticket.category}
                  </p>
                </div>
                {ticket.orderId && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Order ID
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {ticket.orderId}
                    </p>
                  </div>
                )}
              </div>
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
              {ticket.responses.map((response, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 p-4 rounded-lg ${
                    response.role === "support" ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        response.role === "support"
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
                      {response.role === "support" && (
                        <Badge variant="default" size="sm">
                          Support
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(response.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {response.message}
                    </p>

                    {response.attachments.length > 0 && (
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
            {ticket.status !== "Closed" && (
              <Card.Footer className="bg-gray-50 mt-auto">
                <div className="space-y-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
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
                {ticket.status === "Open" || ticket.status === "In Progress" ? (
                  <Button
                    onClick={() => handleStatusChange("Resolved")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                ) : null}

                {ticket.status === "Resolved" && (
                  <>
                    <Button
                      onClick={() => handleStatusChange("Closed")}
                      variant="outline"
                      className="w-full"
                    >
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Close Ticket
                    </Button>
                    <Button
                      onClick={() => handleStatusChange("Open")}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Re-open Ticket
                    </Button>
                  </>
                )}

                {ticket.status === "Closed" && (
                  <Button
                    onClick={() => handleStatusChange("Open")}
                    className="w-full"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Re-open Ticket
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
                {ticket.statusHistory.map((history, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        history.status === "Closed"
                          ? "bg-gray-400"
                          : history.status === "Resolved"
                          ? "bg-green-500"
                          : history.status === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">
                        {history.status}
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

          {/* Ticket Info */}
          <Card>
            <Card.Header>
              <Card.Title>Ticket Details</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Priority Level
                  </p>
                  <div className="mt-1">
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Current Status
                  </p>
                  <div className="mt-1">{getStatusBadge(ticket.status)}</div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Created
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(ticket.createdDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(ticket.lastUpdated)}
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

export default SupportTicketDetail;
