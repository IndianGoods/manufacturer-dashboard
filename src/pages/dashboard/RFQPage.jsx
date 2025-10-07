import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  setRfqs,
  setFilters,
  applyFilters,
  deleteRfq,
  updateRfq,
} from "../../store/slices/rfqsSlice";
import { mockRfqs } from "../../data/mockData";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/helpers";

const RFQPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, filteredItems, filters } = useSelector((state) => state.rfqs);
  const [selectedRfqs, setSelectedRfqs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Load mock RFQs on component mount
    dispatch(setRfqs(mockRfqs));
  }, [dispatch]);

  useEffect(() => {
    // Apply filters whenever filters change
    dispatch(applyFilters());
  }, [filters, dispatch]);

  const breadcrumbItems = [{ name: "RFQs" }];

  const tabs = [
    { id: "all", name: "All", count: items.length },
    {
      id: "pending",
      name: "Pending",
      count: items.filter((rfq) => rfq.status === "pending").length,
    },
    {
      id: "quoted",
      name: "Quoted",
      count: items.filter((rfq) => rfq.status === "quoted").length,
    },
    {
      id: "accepted",
      name: "Accepted",
      count: items.filter((rfq) => rfq.status === "accepted").length,
    },
    {
      id: "expired",
      name: "Expired",
      count: items.filter((rfq) => rfq.status === "expired").length,
    },
  ];

  const sortOptions = [
    { value: "created", label: "Created (newest first)" },
    { value: "created-asc", label: "Created (oldest first)" },
    { value: "deadline", label: "Deadline (earliest first)" },
    { value: "deadline-desc", label: "Deadline (latest first)" },
    { value: "value", label: "Value (lowest first)" },
    { value: "value-desc", label: "Value (highest first)" },
    { value: "company", label: "Company A-Z" },
    { value: "company-desc", label: "Company Z-A" },
  ];

  const bulkActions = [
    { label: "Send quotes", action: "quote" },
    { label: "Mark as reviewed", action: "review" },
    { label: "Archive RFQs", action: "archive" },
    { label: "Delete RFQs", action: "delete", destructive: true },
  ];



  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      dispatch(setFilters({ status: "all" }));
    } else {
      dispatch(setFilters({ status: tab }));
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(setFilters({ search: query }));
  };

  const handleSort = (option) => {
    const [field, order] = option.includes("-desc")
      ? [option.replace("-desc", ""), "desc"]
      : [option, "asc"];
    setSortBy(field);
    setSortOrder(order);

    // Sort the RFQs
    const sorted = [...filteredItems].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === "company") {
        aVal = a.customer.company.toLowerCase();
        bVal = b.customer.company.toLowerCase();
      } else if (field === "created" || field === "deadline") {
        aVal = new Date(a[field === "created" ? "createdAt" : "deadline"]);
        bVal = new Date(b[field === "created" ? "createdAt" : "deadline"]);
      } else if (field === "value") {
        aVal = a.estimatedValue;
        bVal = b.estimatedValue;
      }

      if (order === "desc") {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    dispatch(setRfqs(sorted));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRfqs(filteredItems.map((rfq) => rfq.id));
    } else {
      setSelectedRfqs([]);
    }
  };

  const handleSelectRfq = (rfqId, checked) => {
    if (checked) {
      setSelectedRfqs([...selectedRfqs, rfqId]);
    } else {
      setSelectedRfqs(selectedRfqs.filter((id) => id !== rfqId));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on RFQs:`, selectedRfqs);

    if (action === "delete") {
      setShowDeleteModal(true);
    }
    // Add other bulk actions here
  };

  const confirmDelete = () => {
    selectedRfqs.forEach((rfqId) => {
      dispatch(deleteRfq(rfqId));
    });
    setSelectedRfqs([]);
    setShowDeleteModal(false);
  };

  const handleRowClick = (rfq, e) => {
    // Only prevent navigation if clicking directly on checkbox
    if (e.target.type === "checkbox") {
      return;
    }

    // Navigate to detail page when clicking on RFQ row
    navigate(`/dashboard/rfqs/${rfq.id}`);
  };

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
      <Badge variant={variants[priority] || "default"} size="sm">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-6">
            <FunnelIcon className="h-12 w-12 text-gray-400" />
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No RFQs found
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by reviewing incoming requests for quotations
        </p>

        <div className="flex justify-center">
          <Button variant="outline">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export RFQs
          </Button>
        </div>
      </div>
    </div>
  );

  const RFQsTable = () => (
    <div className="overflow-x-auto overflow-y-visible">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12">
              <input
                type="checkbox"
                checked={
                  selectedRfqs.length === filteredItems.length &&
                  filteredItems.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head className="text-xs">RFQ Number</Table.Head>
            <Table.Head className="text-xs">Customer</Table.Head>
            <Table.Head className="text-xs">Products</Table.Head>
            <Table.Head className="text-xs">Value</Table.Head>
            <Table.Head className="text-xs">Priority</Table.Head>
            <Table.Head className="text-xs">Status</Table.Head>
            <Table.Head className="text-xs">Deadline</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredItems.map((rfq) => (
            <tr
              key={rfq.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={(e) => handleRowClick(rfq, e)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedRfqs.includes(rfq.id)}
                  onChange={(e) =>
                    handleSelectRfq(rfq.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="font-medium text-gray-900 text-xs">
                  {rfq.rfqNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(rfq.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs font-medium text-gray-900">
                  {rfq.customer.company}
                </div>
                <div className="text-xs text-gray-500">{rfq.customer.name}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="text-xs text-gray-900">
                  {rfq.products.length} product{rfq.products.length > 1 ? "s" : ""}
                </div>
                <div className="text-xs text-gray-500 max-w-xs truncate">
                  {rfq.products.map((p) => p.name).join(", ")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs font-medium text-gray-900">
                  {formatCurrency(rfq.estimatedValue)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getPriorityBadge(rfq.priority)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getStatusBadge(rfq.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs text-gray-900">
                  {formatDate(rfq.deadline)}
                </div>
              </td>
            </tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <Modal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      title="Delete RFQs"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete {selectedRfqs.length} RFQ
          {selectedRfqs.length > 1 ? "s" : ""}? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">RFQs</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Card>
        {/* Tabs with Search and Filters */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className="ml-2 py-0.5 px-2 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              {selectedRfqs.length > 0 ? (
                /* Bulk Actions */
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    {selectedRfqs.length} RFQ
                    {selectedRfqs.length > 1 ? "s" : ""} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                    className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
                  >
                    Delete RFQs
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRfqs([])}
                    className="text-xs text-gray-500"
                  >
                    Clear
                  </Button>
                </div>
              ) : (
                /* Search and Sort */
                <>
                  {/* Expandable Search */}
                  <div className="flex items-center">
                    {!isSearchExpanded ? (
                      <button
                        onClick={() => setIsSearchExpanded(true)}
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    ) : (
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 ml-3" />
                        <input
                          type="text"
                          placeholder="Search RFQs"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-2 pr-3 py-2 text-sm focus:outline-none w-64"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            setIsSearchExpanded(false);
                            setSearchQuery("");
                            handleSearch("");
                          }}
                          className="p-1 mr-2 rounded hover:bg-gray-100"
                        >
                          <XMarkIcon className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={`${sortBy}${
                        sortOrder === "desc" ? "-desc" : ""
                      }`}
                      onChange={(e) => handleSort(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RFQs Table or Empty State */}
        {filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          <RFQsTable />
        )}
      </Card>

      <DeleteConfirmationModal />
    </div>
  );
};

export default RFQPage;