import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@heroicons/react/24/outline";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Table from "../../../components/ui/Table";
import Card from "../../../components/ui/Card";
import {
  mockRfqs,
} from "../../../data/mockData";

const RfqHome = () => {
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState(mockRfqs);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const rfqStatuses = ["All", "pending", "quoted", "accepted", "rejected"];
  const rfqPriorities = ["low", "medium", "high"];

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

  const filteredRfqs = rfqs.filter((rfq) => {
    const matchesStatus =
      filterStatus === "All" || rfq.status === filterStatus;
    const matchesPriority =
      filterPriority === "All" || rfq.priority === filterPriority;
    const matchesSearch =
      rfq.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.customer.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    total: rfqs.length,
    pending: rfqs.filter((r) => r.status === "pending").length,
    quoted: rfqs.filter((r) => r.status === "quoted").length,
    accepted: rfqs.filter((r) => r.status === "accepted").length,
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

  const breadcrumbItems = [{ name: "RFQs" }];

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
          <h1 className="text-2xl font-bold text-gray-900">Request for Quotations (RFQs)</h1>
          <div className="flex items-center space-x-3">
            <Button onClick={() => navigate("/dashboard/rfqs/create")}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create RFQ
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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total RFQs
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pending}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Quoted
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.quoted}
                </p>
              </div>
              <ExclamationCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Accepted
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.accepted}
                </p>
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
                placeholder="Search by RFQ number or customer name..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    {rfqStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                  Priority
                </label>
                <div className="relative">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="appearance-none w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    <option value="All">All</option>
                    {rfqPriorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RFQs Table */}
        {filteredRfqs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-full p-6">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No RFQs found
              </h3>
              <p className="text-gray-500 mb-6">
                {rfqs.length === 0
                  ? "Create your first RFQ to get started"
                  : "Try adjusting your filters"}
              </p>
              {rfqs.length === 0 && (
                <Button onClick={() => navigate("/dashboard/rfqs/create")}>
                  Create First RFQ
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head className="text-xs">RFQ Number</Table.Head>
                  <Table.Head className="text-xs">Customer</Table.Head>
                  <Table.Head className="text-xs">Products</Table.Head>
                  <Table.Head className="text-xs">Est. Value</Table.Head>
                  <Table.Head className="text-xs">Priority</Table.Head>
                  <Table.Head className="text-xs">Status</Table.Head>
                  <Table.Head className="text-xs">Deadline</Table.Head>
                  <Table.Head className="text-xs">Created</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredRfqs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    onClick={() => navigate(`/dashboard/rfqs/${rfq.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-mono text-xs font-medium text-primary-600">
                        {rfq.rfqNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium text-xs text-gray-900">
                        {rfq.customer.company}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rfq.customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="text-xs text-gray-600">
                        {rfq.products.length} item{rfq.products.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-xs font-medium text-gray-900">
                        ${rfq.estimatedValue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPriorityBadge(rfq.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStatusBadge(rfq.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatRelativeTime(rfq.deadline)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatRelativeTime(rfq.createdAt)}
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

export default RfqHome;
