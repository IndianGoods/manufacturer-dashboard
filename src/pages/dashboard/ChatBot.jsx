import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, Smile, MoreVertical, Star, Archive, Flag, UserPlus, ChevronDown, X, Phone, Mail, Package, Clock, CheckCheck, User, Building2, Plus, Filter } from 'lucide-react';

const ChatSupportPage = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      customer: "Sarah Johnson",
      company: "TechCorp Industries",
      avatar: "SJ",
      lastMessage: "When can I expect the delivery of order #12453?",
      timestamp: "2 min ago",
      unread: 3,
      online: true,
      status: "Active",
      email: "sarah.johnson@techcorp.com",
      phone: "+1 (555) 123-4567",
      orderNumber: "#12453",
      priority: true,
      typing: false,
      messages: [
        { id: 1, sender: "customer", text: "Hi, I placed an order last week", time: "10:30 AM", read: true },
        { id: 2, sender: "agent", text: "Hello Sarah! I'd be happy to help you with that. Could you provide your order number?", time: "10:31 AM", read: true },
        { id: 3, sender: "customer", text: "Sure, it's order #12453", time: "10:32 AM", read: true },
        { id: 4, sender: "system", text: "Order #12453 status updated to 'Processing'", time: "10:33 AM" },
        { id: 5, sender: "customer", text: "When can I expect the delivery of order #12453?", time: "10:35 AM", read: false }
      ],
      recentOrders: ["#12453", "#12201", "#11987"],
      previousTickets: 8
    },
    {
      id: 2,
      customer: "Michael Chen",
      company: "Global Manufacturing Ltd",
      avatar: "MC",
      lastMessage: "Thank you for the quick resolution!",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
      status: "Resolved",
      email: "m.chen@globalmanuf.com",
      phone: "+1 (555) 234-5678",
      orderNumber: "#12442",
      priority: false,
      typing: false,
      messages: [
        { id: 1, sender: "customer", text: "I received a damaged shipment", time: "9:15 AM", read: true },
        { id: 2, sender: "agent", text: "I'm sorry to hear that. Can you send me photos of the damage?", time: "9:20 AM", read: true },
        { id: 3, sender: "customer", text: "📎 damage_photo.jpg", time: "9:22 AM", read: true, attachment: true },
        { id: 4, sender: "agent", text: "Thank you for the photos. I've arranged a replacement shipment at no charge. It will arrive within 2 business days.", time: "9:25 AM", read: true },
        { id: 5, sender: "customer", text: "Thank you for the quick resolution!", time: "9:30 AM", read: true }
      ],
      recentOrders: ["#12442", "#12300", "#12156"],
      previousTickets: 3
    },
    {
      id: 3,
      customer: "Emily Rodriguez",
      company: "Precision Parts Co",
      avatar: "ER",
      lastMessage: "Can you send me the specifications for item SKU-7891?",
      timestamp: "3 hours ago",
      unread: 1,
      online: true,
      status: "Active",
      email: "e.rodriguez@precisionparts.com",
      phone: "+1 (555) 345-6789",
      orderNumber: null,
      priority: false,
      typing: true,
      messages: [
        { id: 1, sender: "customer", text: "Hi, I'm interested in bulk ordering", time: "8:00 AM", read: true },
        { id: 2, sender: "agent", text: "Great! I can help you with that. What items are you interested in?", time: "8:05 AM", read: true },
        { id: 3, sender: "customer", text: "Can you send me the specifications for item SKU-7891?", time: "8:10 AM", read: false }
      ],
      recentOrders: ["#12398", "#12245"],
      previousTickets: 5
    },
    {
      id: 4,
      customer: "David Kumar",
      company: "BuildRight Construction",
      avatar: "DK",
      lastMessage: "I need to update my shipping address",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      status: "Pending",
      email: "d.kumar@buildright.com",
      phone: "+1 (555) 456-7890",
      orderNumber: "#12401",
      priority: false,
      typing: false,
      messages: [
        { id: 1, sender: "customer", text: "I need to update my shipping address", time: "Yesterday, 4:30 PM", read: true },
        { id: 2, sender: "agent", text: "I can help you with that. What's the new address?", time: "Yesterday, 4:35 PM", read: true },
        { id: 3, sender: "customer", text: "123 Industrial Blvd, Suite 200, Denver, CO 80202", time: "Yesterday, 4:40 PM", read: true }
      ],
      recentOrders: ["#12401", "#12167"],
      previousTickets: 12
    },
    {
      id: 5,
      customer: "Lisa Thompson",
      company: "Advanced Machinery Inc",
      avatar: "LT",
      lastMessage: "Is there a discount for orders over $10,000?",
      timestamp: "2 days ago",
      unread: 0,
      online: false,
      status: "Archived",
      email: "l.thompson@advancedmach.com",
      phone: "+1 (555) 567-8901",
      orderNumber: null,
      priority: false,
      typing: false,
      messages: [
        { id: 1, sender: "customer", text: "Is there a discount for orders over $10,000?", time: "2 days ago, 2:00 PM", read: true },
        { id: 2, sender: "agent", text: "Yes! We offer tiered discounts. For orders over $10,000, you get 8% off. Let me send you our volume pricing guide.", time: "2 days ago, 2:15 PM", read: true },
        { id: 3, sender: "agent", text: "📎 volume_pricing_guide.pdf", time: "2 days ago, 2:16 PM", read: true, attachment: true }
      ],
      recentOrders: ["#12234"],
      previousTickets: 2
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");
  const [showCustomerInfo, setShowCustomerInfo] = useState(true);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [internalNote, setInternalNote] = useState(false);
  const messagesEndRef = useRef(null);

  const quickResponses = [
    "Thank you for contacting us. I'll look into this right away.",
    "I've checked your order status and it's currently being processed.",
    "Could you please provide more details about your issue?",
    "Your replacement has been shipped and should arrive within 2-3 business days.",
    "I've applied a discount to your account for the inconvenience."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: selectedConversation.messages.length + 1,
      sender: internalNote ? "internal" : "agent",
      text: messageInput,
      time: "Just now",
      read: false
    };

    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          timestamp: "Just now"
        };
      }
      return conv;
    }));

    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage]
    });

    setMessageInput("");
    setShowQuickResponses(false);
  };

  const handleStatusChange = (status) => {
    if (!selectedConversation) return;
    
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? { ...conv, status } : conv
    ));
    setSelectedConversation({ ...selectedConversation, status });
  };

  const togglePriority = () => {
    if (!selectedConversation) return;
    
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? { ...conv, priority: !conv.priority } : conv
    ));
    setSelectedConversation({ ...selectedConversation, priority: !selectedConversation.priority });
  };

  const markAsRead = (convId) => {
    setConversations(conversations.map(conv => 
      conv.id === convId ? { ...conv, unread: 0 } : conv
    ));
  };

  const archiveConversation = () => {
    if (!selectedConversation) return;
    handleStatusChange("Archived");
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTab === "All" || conv.status === filterTab;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === "Unread") return b.unread - a.unread;
    return 0;
  });

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Support Chat</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[30%] bg-white border-r border-gray-200 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 mb-2">
              {["All", "Active", "Resolved", "Archived"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filterTab === tab
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-gray-600 text-sm bg-transparent focus:outline-none cursor-pointer"
              >
                <option>Recent</option>
                <option>Unread</option>
                <option>Priority</option>
              </select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6">
                <Package className="w-12 h-12 mb-3 text-gray-400" />
                <p className="text-center">No support tickets yet</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    markAsRead(conv.id);
                  }}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                    selectedConversation?.id === conv.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {conv.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        conv.online ? "bg-green-500" : "bg-gray-400"
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{conv.customer}</h3>
                          {conv.priority && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </div>
                        <span className="text-xs text-gray-500">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">{conv.company}</p>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                      {conv.typing && (
                        <p className="text-xs text-blue-600 mt-1">typing...</p>
                      )}
                    </div>
                    {conv.unread > 0 && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">
                          {conv.unread}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Package className="w-16 h-16 mb-4 text-gray-400" />
              <p className="text-lg">Select a conversation to start</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {selectedConversation.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900">{selectedConversation.customer}</h2>
                        {selectedConversation.priority && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{selectedConversation.company}</span>
                        {selectedConversation.orderNumber && (
                          <>
                            <span>•</span>
                            <span>{selectedConversation.orderNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedConversation.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Resolved</option>
                    </select>
                    <button
                      onClick={togglePriority}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedConversation.priority
                          ? "bg-yellow-100 text-yellow-700"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                    <button
                      onClick={archiveConversation}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                      <Archive className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <UserPlus className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {selectedConversation.messages.map(message => (
                      message.sender === "system" ? (
                        <div key={message.id} className="flex justify-center">
                          <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {message.text}
                          </div>
                        </div>
                      ) : message.sender === "internal" ? (
                        <div key={message.id} className="flex justify-end">
                          <div className="max-w-[70%] bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-yellow-700">Internal Note</span>
                            </div>
                            <p className="text-sm text-gray-800">{message.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs text-gray-500">{message.time}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}>
                          <div className="flex gap-2 max-w-[70%]">
                            {message.sender === "customer" && (
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                {selectedConversation.avatar}
                              </div>
                            )}
                            <div>
                              <div className={`rounded-lg p-3 ${
                                message.sender === "agent"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {message.attachment ? (
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="w-4 h-4" />
                                    <span className="text-sm">{message.text}</span>
                                  </div>
                                ) : (
                                  <p className="text-sm">{message.text}</p>
                                )}
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${
                                message.sender === "agent" ? "justify-end" : "justify-start"
                              }`}>
                                <span className="text-xs text-gray-500">{message.time}</span>
                                {message.sender === "agent" && message.read && (
                                  <CheckCheck className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                            </div>
                            {message.sender === "agent" && (
                              <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                A
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                    {selectedConversation.typing && (
                      <div className="flex justify-start">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                            {selectedConversation.avatar}
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    {showQuickResponses && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Quick Responses</p>
                        <div className="space-y-2">
                          {quickResponses.map((response, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setMessageInput(response);
                                setShowQuickResponses(false);
                              }}
                              className="w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-white p-2 rounded transition-colors"
                            >
                              {response}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setInternalNote(!internalNote)}
                        className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                          internalNote
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {internalNote ? "Internal Note" : "Customer Message"}
                      </button>
                      <button
                        onClick={() => setShowQuickResponses(!showQuickResponses)}
                        className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        Quick Responses
                      </button>
                    </div>
                    <div className="flex items-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Smile className="w-5 h-5" />
                      </button>
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={internalNote ? "Add internal note..." : "Type your message..."}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Info Panel */}
                {showCustomerInfo && (
                  <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Customer Information</h3>
                      <button
                        onClick={() => setShowCustomerInfo(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4 space-y-6">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-2xl mx-auto mb-3">
                          {selectedConversation.avatar}
                        </div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.customer}</h3>
                        <p className="text-sm text-gray-600">{selectedConversation.company}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedConversation.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{selectedConversation.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Active Account</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Recent Orders</h4>
                        <div className="space-y-2">
                          {selectedConversation.recentOrders.map((order, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-blue-600">{order}</span>
                              <span className="text-gray-500">View</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Previous Tickets</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedConversation.previousTickets}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Account Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Customer Since</span>
                            <span className="text-gray-900">Jan 2023</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Orders</span>
                            <span className="text-gray-900">{selectedConversation.recentOrders.length + 15}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Satisfaction</span>
                            <span className="text-green-600 font-semibold">98%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSupportPage;