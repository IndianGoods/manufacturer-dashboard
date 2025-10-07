import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import Button from "../../components/ui/Button";
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import { mockSupportTickets, supportTicketCategories, supportTicketPriorities, supportTicketStatuses } from '../../data/mockData';

const SupportTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(mockSupportTickets);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);

  const getPriorityBadge = (priority) => {
    const variants = {
      Urgent: "destructive",
      High: "warning", 
      Medium: "default",
      Low: "default"
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
      'In Progress': "default", 
      Resolved: "success",
      Closed: "default"
    };
    return (
      <Badge variant={variants[status] || "default"} size="sm">
        {status}
      </Badge>
    );
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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

  const breadcrumbItems = [{ name: "Support" }];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate('/dashboard/support/create')}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Open</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.open}</p>
              </div>
              <ExclamationCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.resolved}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
      </div>

      <Card>
        {/* Search and Filters */}
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by ticket ID or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Status</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    {supportTicketStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Priority</label>
                <div className="relative">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="appearance-none w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    <option value="All">All</option>
                    {supportTicketPriorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Category</label>
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    <option value="All">All</option>
                    {supportTicketCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tickets Table */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-full p-6">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500 mb-6">
                {tickets.length === 0 ? 'Create your first support ticket to get started' : 'Try adjusting your filters'}
              </p>
              {tickets.length === 0 && (
                <Button onClick={() => navigate('/dashboard/support/create')}>
                  Create First Ticket
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head className="text-xs">Ticket ID</Table.Head>
                  <Table.Head className="text-xs">Subject</Table.Head>
                  <Table.Head className="text-xs">Category</Table.Head>
                  <Table.Head className="text-xs">Priority</Table.Head>
                  <Table.Head className="text-xs">Status</Table.Head>
                  <Table.Head className="text-xs">Created</Table.Head>
                  <Table.Head className="text-xs">Updated</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredTickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/dashboard/support/${ticket.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-mono text-xs font-medium text-primary-600">{ticket.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium text-xs text-gray-900 max-w-xs truncate">{ticket.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-xs text-gray-600">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatRelativeTime(ticket.createdDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatRelativeTime(ticket.lastUpdated)}
                    </td>
                  </tr>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SupportTickets;