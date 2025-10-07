import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { setDiscounts, setFilters, applyFilters, deleteDiscount } from "../../store/slices/discountsSlice";
import { mockDiscounts } from "../../data/mockData";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { formatDate } from "../../utils/helpers";

const Discounts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, filteredItems, filters } = useSelector((state) => state.discounts);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    dispatch(setDiscounts(mockDiscounts));
  }, [dispatch]);

  useEffect(() => {
    dispatch(applyFilters());
  }, [filters, dispatch]);

  const breadcrumbItems = [{ name: "Discounts" }];

  const tabs = [
    { id: "all", name: "All", count: items.length },
    { id: "active", name: "Active", count: items.filter((d) => d.status === "active").length },
    { id: "scheduled", name: "Scheduled", count: items.filter((d) => d.status === "scheduled").length },
    { id: "archived", name: "Archived", count: items.filter((d) => d.status === "archived").length },
  ];

  const sortOptions = [
    { value: "title", label: "Discount title A-Z" },
    { value: "title-desc", label: "Discount title Z-A" },
    { value: "startDate", label: "Start date (oldest first)" },
    { value: "startDate-desc", label: "Start date (newest first)" },
    { value: "endDate", label: "End date (oldest first)" },
    { value: "endDate-desc", label: "End date (newest first)" },
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
    const sorted = [...filteredItems].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      if (field === "title") {
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
      } else if (field === "startDate" || field === "endDate") {
        aVal = new Date(a[field]);
        bVal = new Date(b[field]);
      }
      if (order === "desc") {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    dispatch(setDiscounts(sorted));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDiscounts(filteredItems.map((d) => d.id));
    } else {
      setSelectedDiscounts([]);
    }
  };

  const handleSelectDiscount = (discountId, checked) => {
    if (checked) {
      setSelectedDiscounts([...selectedDiscounts, discountId]);
    } else {
      setSelectedDiscounts(selectedDiscounts.filter((id) => id !== discountId));
    }
  };

  const handleBulkAction = (action) => {
    if (action === "delete") {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    selectedDiscounts.forEach((discountId) => {
      dispatch(deleteDiscount(discountId));
    });
    setSelectedDiscounts([]);
    setShowDeleteModal(false);
  };

  const handleRowClick = (discount, e) => {
    if (e.target.type === "checkbox") return;
    navigate(`/dashboard/discounts/${discount.id}/edit`);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      scheduled: "warning",
      archived: "default",
    };
    return (
      <Badge variant={variants[status]}>
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
              <div className="text-xs text-gray-500">Discount</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 relative overflow-hidden">
                <div className="absolute inset-x-0 top-4 h-8 bg-green-600 rounded-t-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-green-600"></div>
              </div>
              <div className="text-xs text-gray-500">Order</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-yellow-600 rounded mx-auto mb-2 relative">
                <div className="absolute top-2 left-2 right-2 bottom-6 bg-yellow-500 rounded"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500">Shipping</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 relative">
                <div className="absolute inset-2 bg-gray-800 rounded-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-gray-600"></div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Product</div>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add your discounts</h3>
        <p className="text-gray-500 mb-6">Start by creating discounts for your products</p>
        <div className="flex justify-center">
          <Button className="bg-primary-700 hover:bg-primary-700 text-white" onClick={() => navigate("/dashboard/discounts/new") }>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add discount
          </Button>
        </div>
      </div>
    </div>
  );

  const DiscountsTable = () => (
    <div className="overflow-x-auto overflow-y-visible">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12">
              <input
                type="checkbox"
                checked={selectedDiscounts.length === filteredItems.length && filteredItems.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head className="text-xs">Discount</Table.Head>
            <Table.Head className="text-xs">Status</Table.Head>
            <Table.Head className="text-xs">Value</Table.Head>
            <Table.Head className="text-xs">Applies to</Table.Head>
            <Table.Head className="text-xs">Start date</Table.Head>
            <Table.Head className="text-xs">End date</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredItems.map((discount) => (
            <tr key={discount.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={(e) => handleRowClick(discount, e)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedDiscounts.includes(discount.id)}
                  onChange={(e) => handleSelectDiscount(discount.id, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs font-medium text-gray-900">{discount.title}</div>
                <div className="text-xs text-gray-500">{discount.code || "Automatic"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStatusBadge(discount.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{discount.type === "percentage" ? `${discount.value}%` : `₹${discount.value}`}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{discount.appliesTo || "All products"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{discount.startDate ? formatDate(discount.startDate) : "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{discount.endDate ? formatDate(discount.endDate) : "-"}</td>
            </tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete discounts" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Are you sure you want to delete {selectedDiscounts.length} discount{selectedDiscounts.length > 1 ? "s" : ""}? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline">Export</Button>
            <Button variant="outline">Import</Button>
            <Button onClick={() => navigate("/dashboard/discounts/new") }>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add discount
            </Button>
          </div>
        </div>
      </div>
      {items.length === 0 ? (
        <Card>
          <EmptyState />
        </Card>
      ) : (
        <Card>
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                  >
                    {tab.name}
                    {tab.count > 0 && (
                      <span className="ml-2 py-0.5 px-2 text-xs bg-gray-100 text-gray-600 rounded-full">{tab.count}</span>
                    )}
                  </button>
                ))}
              </nav>
              <div className="flex items-center space-x-2">
                {selectedDiscounts.length > 0 ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">{selectedDiscounts.length} discount{selectedDiscounts.length > 1 ? "s" : ""} selected</span>
                    <Button variant="outline" size="sm" className="text-xs">Edit discounts</Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("delete")} className="text-red-600 border-red-300 hover:bg-red-50 text-xs">Delete discounts</Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedDiscounts([])} className="text-xs text-gray-500">Clear</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      {!isSearchExpanded ? (
                        <button onClick={() => setIsSearchExpanded(true)} className="p-2 rounded hover:bg-gray-100 transition-colors">
                          <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      ) : (
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 ml-3" />
                          <input type="text" placeholder="Search discounts" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-2 pr-3 py-2 text-sm focus:outline-none w-64" autoFocus />
                          <button onClick={() => { setIsSearchExpanded(false); setSearchQuery(""); handleSearch(""); }} className="p-1 mr-2 rounded hover:bg-gray-100">
                            <XMarkIcon className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <select value={`${sortBy}${sortOrder === "desc" ? "-desc" : ""}`} onChange={(e) => handleSort(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8">
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <DiscountsTable />
        </Card>
      )}
      <DeleteConfirmationModal />
    </div>
  );
};

export default Discounts;
