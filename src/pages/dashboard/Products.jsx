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
  setProducts,
  setFilters,
  applyFilters,
  deleteProduct,
  updateProduct,
} from "../../store/slices/productsSlice";
import { mockProducts } from "../../data/orderMockData";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Table from "../../components/ui/Table";
import Card from "../../components/ui/Card";

import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/helpers";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, filteredItems, filters } = useSelector(
    (state) => state.products
  );
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    // Load mock products on component mount
    dispatch(setProducts(mockProducts));
  }, [dispatch]);

  useEffect(() => {
    // Apply filters whenever filters change
    dispatch(applyFilters());
  }, [filters, dispatch]);

  const breadcrumbItems = [{ name: "Products" }];

  const tabs = [
    { id: "all", name: "All", count: items.length },
    {
      id: "active",
      name: "Active",
      count: items.filter((p) => p.status === "active").length,
    },
    {
      id: "draft",
      name: "Draft",
      count: items.filter((p) => p.status === "draft").length,
    },
    {
      id: "archived",
      name: "Archived",
      count: items.filter((p) => p.status === "archived").length,
    },
  ];

  const sortOptions = [
    { value: "name", label: "Product title A-Z" },
    { value: "name-desc", label: "Product title Z-A" },
    { value: "created", label: "Created (oldest first)" },
    { value: "created-desc", label: "Created (newest first)" },
    { value: "updated", label: "Updated (oldest first)" },
    { value: "updated-desc", label: "Updated (newest first)" },
    { value: "inventory", label: "Inventory (lowest first)" },
    { value: "inventory-desc", label: "Inventory (highest first)" },
  ];

  const bulkActions = [
    { label: "Make products active", action: "activate" },
    { label: "Make products inactive", action: "deactivate" },
    { label: "Archive products", action: "archive" },
    { label: "Add tags", action: "add-tags" },
    { label: "Remove tags", action: "remove-tags" },
    { label: "Delete products", action: "delete", destructive: true },
  ];

  const handleTabChange = (tab, disabled) => {
    if (disabled) return;
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

    // Sort the products
    const sorted = [...filteredItems].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (field === "created" || field === "updated") {
        aVal = new Date(a[field]);
        bVal = new Date(b[field]);
      }

      if (order === "desc") {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    dispatch(setProducts(sorted));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredItems.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on products:`, selectedProducts);

    if (action === "delete") {
      setShowDeleteModal(true);
    } else if (action === "edit") {
      // Navigate to bulk edit page with selected product IDs
      const ids = selectedProducts.join(",");
      navigate(`/dashboard/products/bulk-edit?ids=${ids}`);
    }
    // Add other bulk actions here
  };

  const confirmDelete = () => {
    selectedProducts.forEach((productId) => {
      dispatch(deleteProduct(productId));
    });
    setSelectedProducts([]);
    setShowDeleteModal(false);
  };

  const handleRowClick = (product, e) => {
    // Only prevent navigation if clicking directly on checkbox
    if (e.target.type === "checkbox") {
      return;
    }

    console.log("Row clicked for product:", product.name, "Target:", e.target);
    // Navigate to edit page when clicking on product row
    navigate(`/dashboard/products/${product.id}/edit`);
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      draft: "warning",
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
              <div className="text-xs text-gray-500">Sneaker</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 relative overflow-hidden">
                <div className="absolute inset-x-0 top-4 h-8 bg-green-600 rounded-t-full"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-6 bg-green-600"></div>
              </div>
              <div className="text-xs text-gray-500">Vase</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-yellow-600 rounded mx-auto mb-2 relative">
                <div className="absolute top-2 left-2 right-2 bottom-6 bg-yellow-500 rounded"></div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-500">Honey</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 relative">
                <div className="absolute inset-2 bg-gray-800 rounded-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-gray-600"></div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Sunglasses</div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Add your products
        </h3>
        <p className="text-gray-500 mb-6">
          Start by stocking your store with products your customers will love
        </p>

        <div className="flex justify-center">
          <Button
            className="bg-primary-700 hover:bg-primary-700 text-white"
            onClick={() => navigate("/dashboard/products/new")}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </div>
      </div>
    </div>
  );

  const ProductsTable = () => (
    <div className="overflow-x-auto overflow-y-visible">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12">
              <input
                type="checkbox"
                checked={
                  selectedProducts.length === filteredItems.length &&
                  filteredItems.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head className="text-xs">Product</Table.Head>
            <Table.Head className="text-xs">Status</Table.Head>
            <Table.Head className="text-xs">Inventory</Table.Head>
            <Table.Head className="text-xs">Category</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredItems.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={(e) => handleRowClick(product, e)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) =>
                    handleSelectProduct(product.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0">
                    <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-xs font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">{product.sku}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getStatusBadge(product.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="text-xs text-gray-900">
                  {product.inventory > 0 ? (
                    `${product.inventory} in stock`
                  ) : (
                    <span className="text-red-600">0 in stock</span>
                  )}
                  {product.variants.length > 0 && (
                    <div className="text-xs text-gray-500">
                      for {product.variants.length} variants
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="text-xs text-gray-900">
                  {product.category}
                </span>
              </td>
            </tr>
          ))}
        </Table.Body>
      </Table>
    </div>
  );

  const ImportModal = () => (
    <Modal
      isOpen={showImportModal}
      onClose={() => setShowImportModal(false)}
      title="Import products"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Import products from a CSV file. Make sure your file includes columns
          for product name, price, and inventory.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                CSV files only
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".csv"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowImportModal(false)}>
            Cancel
          </Button>
          <Button>Import products</Button>
        </div>
      </div>
    </Modal>
  );

  const DeleteConfirmationModal = () => (
    <Modal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      title="Delete products"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete {selectedProducts.length} product
          {selectedProducts.length > 1 ? "s" : ""}? This action cannot be
          undone.
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline">Export</Button>
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              Import
            </Button>
            <Button onClick={() => navigate("/dashboard/products/new")}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add product
            </Button>
          </div>
        </div>
      </div>

      {/* Only show empty state if 'All' tab is selected and there are no products */}
      {activeTab === "all" && filteredItems.length === 0 ? (
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
                  const disabled = tab.count === 0;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id, disabled)}
                      disabled={disabled}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : disabled
                          ? "border-transparent text-gray-300 cursor-not-allowed"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
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
                {selectedProducts.length > 0 ? (
                  /* Bulk Actions (Edit button hidden) */
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      {selectedProducts.length} product
                      {selectedProducts.length > 1 ? "s" : ""} selected
                    </span>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("edit")}
                      className="text-xs"
                    >
                      Edit products
                    </Button> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("delete")}
                      className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
                    >
                      Delete products
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
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
                            placeholder="Search products"
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

          {/* Products Table */}
          <ProductsTable />
        </Card>
      )}

      <ImportModal />
      <DeleteConfirmationModal />
    </div>
  );
};

export default Products;
