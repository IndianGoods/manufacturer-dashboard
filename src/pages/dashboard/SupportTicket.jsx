import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, X, Send, Paperclip, Clock, 
  CheckCircle, AlertCircle, MessageSquare, TrendingUp,
  Calendar, User, Tag, FileText, ArrowLeft, RefreshCw
} from 'lucide-react';

const SupportTicketSystem = () => {
  const [view, setView] = useState('dashboard'); // dashboard, create, detail
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-2025-0001',
      subject: 'Production line equipment error code E-247',
      category: 'Technical Issue',
      priority: 'Urgent',
      status: 'In Progress',
      createdDate: '2025-10-01T09:30:00',
      lastUpdated: '2025-10-04T11:20:00',
      description: 'Our CNC machine is showing error code E-247 and has stopped production. This is affecting our manufacturing schedule. Need immediate assistance.',
      orderId: 'ORD-45678',
      attachments: ['error_screenshot.png', 'machine_log.pdf'],
      responses: [
        {
          sender: 'John Doe',
          role: 'user',
          timestamp: '2025-10-01T09:30:00',
          message: 'Our CNC machine is showing error code E-247 and has stopped production. This is affecting our manufacturing schedule. Need immediate assistance.',
          attachments: ['error_screenshot.png', 'machine_log.pdf']
        },
        {
          sender: 'Sarah Tech Support',
          role: 'support',
          timestamp: '2025-10-01T10:15:00',
          message: 'Thank you for reaching out. Error code E-247 typically indicates a servo motor calibration issue. Our technician has been assigned to your case. Can you confirm the machine model and when this error first appeared?',
          attachments: []
        },
        {
          sender: 'John Doe',
          role: 'user',
          timestamp: '2025-10-01T10:45:00',
          message: 'Machine model is XYZ-5000. The error appeared this morning at 8:30 AM during startup sequence.',
          attachments: []
        },
        {
          sender: 'Sarah Tech Support',
          role: 'support',
          timestamp: '2025-10-04T11:20:00',
          message: 'Our technician will arrive on-site tomorrow at 2 PM to perform calibration and diagnostics. Please keep the machine powered off until then.',
          attachments: ['service_schedule.pdf']
        }
      ],
      statusHistory: [
        { status: 'Open', timestamp: '2025-10-01T09:30:00' },
        { status: 'In Progress', timestamp: '2025-10-01T10:15:00' }
      ]
    },
    {
      id: 'TKT-2025-0002',
      subject: 'Invoice discrepancy for order ORD-45670',
      category: 'Billing Question',
      priority: 'High',
      status: 'Open',
      createdDate: '2025-10-02T14:20:00',
      lastUpdated: '2025-10-02T14:20:00',
      description: 'The invoice amount does not match our purchase order. PO shows $15,000 but invoice is $16,500. Please review and correct.',
      orderId: 'ORD-45670',
      attachments: ['purchase_order.pdf', 'invoice_received.pdf'],
      responses: [
        {
          sender: 'Maria Garcia',
          role: 'user',
          timestamp: '2025-10-02T14:20:00',
          message: 'The invoice amount does not match our purchase order. PO shows $15,000 but invoice is $16,500. Please review and correct.',
          attachments: ['purchase_order.pdf', 'invoice_received.pdf']
        }
      ],
      statusHistory: [
        { status: 'Open', timestamp: '2025-10-02T14:20:00' }
      ]
    },
    {
      id: 'TKT-2025-0003',
      subject: 'Request for bulk order discount feature',
      category: 'Feature Request',
      priority: 'Medium',
      status: 'Open',
      createdDate: '2025-10-03T10:00:00',
      lastUpdated: '2025-10-03T10:00:00',
      description: 'Would like to see automatic bulk discount calculation in the platform when ordering quantities above 1000 units. This would streamline our purchasing process.',
      orderId: '',
      attachments: [],
      responses: [
        {
          sender: 'David Chen',
          role: 'user',
          timestamp: '2025-10-03T10:00:00',
          message: 'Would like to see automatic bulk discount calculation in the platform when ordering quantities above 1000 units. This would streamline our purchasing process.',
          attachments: []
        }
      ],
      statusHistory: [
        { status: 'Open', timestamp: '2025-10-03T10:00:00' }
      ]
    },
    {
      id: 'TKT-2025-0004',
      subject: 'Product quality issue - batch #B2025-089',
      category: 'Product Quality',
      priority: 'High',
      status: 'Resolved',
      createdDate: '2025-09-28T08:15:00',
      lastUpdated: '2025-10-02T16:30:00',
      description: 'Received batch with dimensional inconsistencies. Approximately 15% of units are out of tolerance. Need replacement batch urgently.',
      orderId: 'ORD-45665',
      attachments: ['quality_report.pdf', 'measurement_data.xlsx'],
      responses: [
        {
          sender: 'Robert Kim',
          role: 'user',
          timestamp: '2025-09-28T08:15:00',
          message: 'Received batch with dimensional inconsistencies. Approximately 15% of units are out of tolerance. Need replacement batch urgently.',
          attachments: ['quality_report.pdf', 'measurement_data.xlsx']
        },
        {
          sender: 'Quality Assurance Team',
          role: 'support',
          timestamp: '2025-09-28T11:00:00',
          message: 'We apologize for this issue. Our QA team is reviewing your report. A replacement batch has been expedited and will ship within 48 hours.',
          attachments: []
        },
        {
          sender: 'Quality Assurance Team',
          role: 'support',
          timestamp: '2025-10-02T16:30:00',
          message: 'Replacement batch #B2025-095 has been shipped via express delivery. Tracking number: TR-8845692. You should receive it by tomorrow. We have issued a full credit for the defective batch.',
          attachments: ['replacement_invoice.pdf']
        }
      ],
      statusHistory: [
        { status: 'Open', timestamp: '2025-09-28T08:15:00' },
        { status: 'In Progress', timestamp: '2025-09-28T11:00:00' },
        { status: 'Resolved', timestamp: '2025-10-02T16:30:00' }
      ]
    },
    {
      id: 'TKT-2025-0005',
      subject: 'Delayed shipment for order ORD-45680',
      category: 'Shipping/Delivery',
      priority: 'Medium',
      status: 'Closed',
      createdDate: '2025-09-25T13:40:00',
      lastUpdated: '2025-09-30T09:15:00',
      description: 'Order was scheduled to arrive on Sept 26 but has not been delivered yet. Please provide updated delivery information.',
      orderId: 'ORD-45680',
      attachments: [],
      responses: [
        {
          sender: 'Lisa Wang',
          role: 'user',
          timestamp: '2025-09-25T13:40:00',
          message: 'Order was scheduled to arrive on Sept 26 but has not been delivered yet. Please provide updated delivery information.',
          attachments: []
        },
        {
          sender: 'Logistics Team',
          role: 'support',
          timestamp: '2025-09-25T15:20:00',
          message: 'We apologize for the delay. There was a carrier issue. Your shipment is now scheduled for delivery on Sept 28. Tracking: TR-8845123',
          attachments: []
        },
        {
          sender: 'Lisa Wang',
          role: 'user',
          timestamp: '2025-09-28T16:00:00',
          message: 'Shipment received. Thank you for the update.',
          attachments: []
        },
        {
          sender: 'Logistics Team',
          role: 'support',
          timestamp: '2025-09-30T09:15:00',
          message: 'Great! We are glad the shipment arrived. Closing this ticket. Please let us know if you need anything else.',
          attachments: []
        }
      ],
      statusHistory: [
        { status: 'Open', timestamp: '2025-09-25T13:40:00' },
        { status: 'In Progress', timestamp: '2025-09-25T15:20:00' },
        { status: 'Resolved', timestamp: '2025-09-28T16:00:00' },
        { status: 'Closed', timestamp: '2025-09-30T09:15:00' }
      ]
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [notification, setNotification] = useState(null);

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'Medium',
    description: '',
    orderId: '',
    attachments: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);

  // Auto-save draft
  useEffect(() => {
    if (view === 'create' && (newTicket.subject || newTicket.description)) {
      const timer = setTimeout(() => {
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newTicket, view]);

  const categories = [
    'Technical Issue',
    'Billing Question',
    'Order Issue',
    'Feature Request',
    'General Inquiry',
    'Account Management',
    'Product Quality',
    'Shipping/Delivery'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

  const getPriorityColor = (priority) => {
    const colors = {
      Urgent: 'bg-red-100 text-red-800 border-red-200',
      High: 'bg-orange-100 text-orange-800 border-orange-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || colors.Medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: 'bg-blue-100 text-blue-800 border-blue-200',
      'In Progress': 'bg-purple-100 text-purple-800 border-purple-200',
      Resolved: 'bg-green-100 text-green-800 border-green-200',
      Closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.Open;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateTicketId = () => {
    const year = new Date().getFullYear();
    const count = tickets.length + 1;
    return `TKT-${year}-${String(count).padStart(4, '0')}`;
  };

  const validateForm = () => {
    const errors = {};
    if (!newTicket.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!newTicket.category) {
      errors.category = 'Category is required';
    }
    if (!newTicket.description.trim()) {
      errors.description = 'Description is required';
    } else if (newTicket.description.trim().length < 50) {
      errors.description = 'Description must be at least 50 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTicket = () => {
    if (!validateForm()) {
      showNotification('Please fix form errors', 'error');
      return;
    }

    const ticket = {
      id: generateTicketId(),
      ...newTicket,
      status: 'Open',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      responses: [
        {
          sender: 'Current User',
          role: 'user',
          timestamp: new Date().toISOString(),
          message: newTicket.description,
          attachments: newTicket.attachments
        }
      ],
      statusHistory: [
        { status: 'Open', timestamp: new Date().toISOString() }
      ]
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({
      subject: '',
      category: '',
      priority: 'Medium',
      description: '',
      orderId: '',
      attachments: []
    });
    setView('dashboard');
    showNotification('Ticket created successfully!');
  };

  const handleReply = () => {
    if (!replyMessage.trim()) return;

    const updatedTicket = {
      ...selectedTicket,
      lastUpdated: new Date().toISOString(),
      responses: [
        ...selectedTicket.responses,
        {
          sender: 'Current User',
          role: 'user',
          timestamp: new Date().toISOString(),
          message: replyMessage,
          attachments: []
        }
      ]
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setReplyMessage('');
    showNotification('Reply sent successfully!');
  };

  const handleStatusChange = (newStatus) => {
    const updatedTicket = {
      ...selectedTicket,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
      statusHistory: [
        ...selectedTicket.statusHistory,
        { status: newStatus, timestamp: new Date().toISOString() }
      ]
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    showNotification(`Ticket marked as ${newStatus}`);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || ticket.category === filterCategory;
    const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
              <p className="text-gray-600 mt-1">Manage and track your support requests</p>
            </div>
            <button
              onClick={() => setView('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              New Ticket
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <FileText className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Open</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{stats.open}</p>
                </div>
                <AlertCircle className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">In Progress</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{stats.inProgress}</p>
                </div>
                <Clock className="text-purple-600" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Resolved</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolved}</p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by ticket ID or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-600 mb-4">
                  {tickets.length === 0 ? 'Create your first support ticket to get started' : 'Try adjusting your filters'}
                </p>
                {tickets.length === 0 && (
                  <button
                    onClick={() => setView('create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Create First Ticket
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTickets.map(ticket => (
                      <tr
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setView('detail');
                        }}
                        className="hover:bg-gray-50 cursor-pointer transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-blue-600 font-medium">{ticket.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{ticket.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatRelativeTime(ticket.createdDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatRelativeTime(ticket.lastUpdated)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Create Ticket View
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Ticket</h1>
                <p className="text-gray-600 mt-1">Fill out the form below to submit your support request</p>
              </div>
              {draftSaved && (
                <span className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Draft saved
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.subject && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newTicket.orderId}
                  onChange={(e) => setNewTicket({ ...newTicket, orderId: e.target.value })}
                  placeholder="e.g., ORD-45678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Enter order ID if this ticket is related to a specific order</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue..."
                  rows={8}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.description ? (
                    <p className="text-red-500 text-sm">{formErrors.description}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Minimum 50 characters</p>
                  )}
                  <p className="text-sm text-gray-500">{newTicket.description.length} characters</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <Paperclip className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG, XLSX up to 10MB each</p>
                  {newTicket.attachments.length > 0 && (
                    <div className="mt-4 text-left">
                      {newTicket.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded mb-2">
                          <span className="text-sm text-gray-700">{file}</span>
                          <button
                            onClick={() => setNewTicket({
                              ...newTicket,
                              attachments: newTicket.attachments.filter((_, i) => i !== idx)
                            })}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCreateTicket}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Submit Ticket
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ticket Detail View
  if (view === 'detail' && selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedTicket.subject}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="font-mono text-blue-600 font-medium">{selectedTicket.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(selectedTicket.createdDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Tag size={14} />
                      {selectedTicket.category}
                    </p>
                  </div>
                  {selectedTicket.orderId && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTicket.orderId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={20} />
                    Conversation
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {selectedTicket.responses.map((response, idx) => (
                    <div key={idx} className={`flex gap-4 ${response.role === 'support' ? 'bg-blue-50 -mx-6 -my-3 px-6 py-3' : ''}`}>
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          response.role === 'support' ? 'bg-blue-600' : 'bg-gray-600'
                        } text-white font-semibold`}>
                          {response.sender.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{response.sender}</span>
                          {response.role === 'support' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Support</span>
                          )}
                          <span className="text-sm text-gray-500">{formatDate(response.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{response.message}</p>
                        {response.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {response.attachments.map((file, fileIdx) => (
                              <div key={fileIdx} className="flex items-center gap-2 text-sm text-blue-600">
                                <Paperclip size={14} />
                                <span>{file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Section */}
                {selectedTicket.status !== 'Closed' && (
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
                    />
                    <div className="flex justify-between items-center">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
                        <Paperclip size={18} />
                        Attach Files
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
                      >
                        <Send size={18} />
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  {selectedTicket.status === 'Open' || selectedTicket.status === 'In Progress' ? (
                    <button
                      onClick={() => handleStatusChange('Resolved')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <CheckCircle size={18} />
                      Mark as Resolved
                    </button>
                  ) : null}
                  
                  {selectedTicket.status === 'Resolved' && (
                    <>
                      <button
                        onClick={() => handleStatusChange('Closed')}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <X size={18} />
                        Close Ticket
                      </button>
                      <button
                        onClick={() => handleStatusChange('Open')}
                        className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <RefreshCw size={18} />
                        Re-open Ticket
                      </button>
                    </>
                  )}
                  
                  {selectedTicket.status === 'Closed' && (
                    <button
                      onClick={() => handleStatusChange('Open')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <RefreshCw size={18} />
                      Re-open Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Status History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Status History
                </h3>
                <div className="space-y-3">
                  {selectedTicket.statusHistory.map((history, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        history.status === 'Closed' ? 'bg-gray-400' :
                        history.status === 'Resolved' ? 'bg-green-500' :
                        history.status === 'In Progress' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{history.status}</p>
                        <p className="text-xs text-gray-500">{formatDate(history.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SLA Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Response Time
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">First Response</p>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedTicket.responses.length > 1 ? '45 minutes' : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Response Time</p>
                    <p className="text-lg font-semibold text-blue-600">2.5 hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority Level</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SupportTicketSystem;