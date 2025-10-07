import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  setOrders,
  setFilters,
  applyFilters,
  deleteOrder,
  updateOrder,
} from "../../store/slices/ordersSlice";
import { mockOrders } from "../../data/orderMockData";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/helpers";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, filteredItems, filters } = useSelector(
    (state) => state.orders
  );
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    // Load mock orders on component mount
    dispatch(setOrders(mockOrders));
  }, [dispatch]);

  useEffect(() => {
    // Apply filters whenever filters change
    dispatch(applyFilters());
  }, [filters, dispatch]);

  const breadcrumbItems = [{ name: "Orders" }];

  const tabs = [
    { id: "all", name: "All", count: items.length },
    {
      id: "unfulfilled",
      name: "Unfulfilled",
      count: items.filter((o) => o.fulfillmentStatus === "unfulfilled").length,
    },
    {
      id: "unpaid",
      name: "Unpaid",
      count: items.filter((o) => o.paymentStatus === "unpaid").length,
    },
    {
      id: "open",
      name: "Open",
      count: items.filter(
        (o) => o.status === "pending" || o.fulfillmentStatus === "unfulfilled"
      ).length,
    },
    {
      id: "archived",
      name: "Archived",
      count: items.filter((o) => o.status === "archived").length,
    },
  ];

  const sortOptions = [
    { value: "created", label: "Order date (newest first)" },
    { value: "created-asc", label: "Order date (oldest first)" },
    { value: "orderNumber", label: "Order number A-Z" },
    { value: "orderNumber-desc", label: "Order number Z-A" },
    { value: "total", label: "Total (lowest first)" },
    { value: "total-desc", label: "Total (highest first)" },
    { value: "customer", label: "Customer A-Z" },
    { value: "customer-desc", label: "Customer Z-A" },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      dispatch(setFilters({ status: "all" }));
    } else if (tab === "unfulfilled") {
      dispatch(setFilters({ status: "unfulfilled" }));
    } else if (tab === "unpaid") {
      dispatch(setFilters({ status: "unpaid" }));
    } else if (tab === "open") {
      dispatch(setFilters({ status: "open" }));
    } else if (tab === "archived") {
      dispatch(setFilters({ status: "archived" }));
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(setFilters({ search: query }));
  };

  const handleSort = (option) => {
    const [field, order] =
      option.includes("-desc") || option.includes("-asc")
        ? option.includes("-desc")
          ? [option.replace("-desc", ""), "desc"]
          : [option.replace("-asc", ""), "asc"]
        : [option, option === "created" ? "desc" : "asc"];

    setSortBy(field);
    setSortOrder(order);

    // Sort the orders
    const sorted = [...filteredItems].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === "customer") {
        aVal = a.customer.name.toLowerCase();
        bVal = b.customer.name.toLowerCase();
      } else if (field === "orderNumber") {
        aVal = a.orderNumber.toLowerCase();
        bVal = b.orderNumber.toLowerCase();
      } else if (field === "created") {
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
      } else if (field === "total") {
        aVal = a.total;
        bVal = b.total;
      }

      if (order === "desc") {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    dispatch(setOrders(sorted));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(filteredItems.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on orders:`, selectedOrders);

    if (action === "delete") {
      setShowDeleteModal(true);
    }
    // Add other bulk actions here
  };

  const confirmDelete = () => {
    selectedOrders.forEach((orderId) => {
      dispatch(deleteOrder(orderId));
    });
    setSelectedOrders([]);
    setShowDeleteModal(false);
  };

  const handleRowClick = (order, e) => {
    // Only prevent navigation if clicking directly on checkbox
    if (e.target.type === "checkbox") {
      return;
    }

    console.log(
      "Row clicked for order:",
      order.orderNumber,
      "Target:",
      e.target
    );
    // Navigate to order details page when clicking on order row
    navigate(`/dashboard/orders/${order.id}`);
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      paid: "success",
      unpaid: "warning",
      pending: "default",
      refunded: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getFulfillmentStatusBadge = (status) => {
    const variants = {
      fulfilled: "success",
      unfulfilled: "warning",
      shipped: "default",
      delivered: "success",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-blue-500 rounded mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-10 bg-white rounded-sm"></div>
              </div>
              <div className="text-xs text-gray-500">Order #1001</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 relative overflow-hidden">
                <div className="absolute inset-x-0 top-4 h-8 bg-green-600 rounded-t-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-green-600"></div>
              </div>
              <div className="text-xs text-gray-500">Order #1002</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-yellow-600 rounded mx-auto mb-2 relative">
                <div className="absolute top-2 left-2 right-2 bottom-6 bg-yellow-500 rounded"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500">Order #1003</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 relative">
                <div className="absolute inset-2 bg-gray-800 rounded-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-gray-600"></div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Order #1004</div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Add your orders
        </h3>
        <p className="text-gray-500 mb-6">
          Start by creating orders for your customers
        </p>

        <div className="flex justify-center">
          <Button
            className="bg-primary-700 hover:bg-primary-700 text-white"
            onClick={() => navigate("/dashboard/orders/new")}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add order
          </Button>
        </div>
      </div>
    </div>
  );

  const OrdersTable = () => (
    <div className="overflow-x-auto overflow-y-visible">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12">
              <input
                type="checkbox"
                checked={
                  selectedOrders.length === filteredItems.length &&
                  filteredItems.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head className="text-xs">Order</Table.Head>
            <Table.Head className="text-xs">Customer</Table.Head>
            <Table.Head className="text-xs">Payment status</Table.Head>
            <Table.Head className="text-xs">Fulfillment status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredItems.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={(e) => handleRowClick(order, e)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={(e) =>
                    handleSelectOrder(order.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs font-medium text-gray-900">
                  {order.orderNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(order.createdAt)} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs text-gray-900">
                  {order.customer.name || "No customer"}
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(order.total)} • {order.items.length} item
                  {order.items.length > 1 ? "s" : ""}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getPaymentStatusBadge(order.paymentStatus)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getFulfillmentStatusBadge(order.fulfillmentStatus)}
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
      title="Delete orders"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete {selectedOrders.length} order
          {selectedOrders.length > 1 ? "s" : ""}? This action cannot be undone.
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline">Export</Button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState />
        </Card>
      ) : (
        <Card>
          {/* Tabs with Search and Filters */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const visuallyDisabled = tab.count === 0;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      tabIndex={visuallyDisabled ? -1 : 0}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : visuallyDisabled
                          ? "border-transparent text-gray-300"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
                      }`}
                      style={
                        visuallyDisabled
                          ? { pointerEvents: "none", cursor: "default" }
                          : {}
                      }
                    >
                      {tab.name}
                      <span
                        className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                          tab.count > 0
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gray-50 text-gray-300"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center space-x-2">
                {selectedOrders.length > 0 ? (
                  /* Bulk Actions */
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      {selectedOrders.length} order
                      {selectedOrders.length > 1 ? "s" : ""} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("edit")}
                      className="text-xs"
                    >
                      Edit orders
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("delete")}
                      className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
                    >
                      Delete orders
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrders([])}
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
                            placeholder="Search orders"
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
                          sortOrder === "desc" && sortBy !== "created"
                            ? "-desc"
                            : sortOrder === "asc" && sortBy === "created"
                            ? "-asc"
                            : ""
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

          {/* Orders Table */}
          <OrdersTable />
        </Card>
      )}

      <DeleteConfirmationModal />
    </div>
  );
};

export default Orders;
