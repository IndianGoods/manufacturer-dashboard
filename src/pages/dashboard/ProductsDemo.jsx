import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  EyeIcon,
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
import Dropdown from "../../components/ui/Dropdown";
import Modal from "../../components/ui/Modal";
import { formatCurrency, formatDate } from "../../utils/helpers";

const ProductsDemo = () => {
  const dispatch = useDispatch();
  const { items, filteredItems, filters } = useSelector(
    (state) => state.products
  );
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyState, setShowEmptyState] = useState(false);

  useEffect(() => {
    // Load mock products on component mount
    if (!showEmptyState) {
      dispatch(setProducts(mockProducts));
    } else {
      dispatch(setProducts([]));
    }
  }, [dispatch, showEmptyState]);

  useEffect(() => {
    // Apply filters whenever filters change
    dispatch(applyFilters());
  }, [filters, dispatch]);

  const breadcrumbItems = [{ name: "Products Demo" }];

  const currentItems = showEmptyState ? [] : filteredItems;

  const tabs = [
    { id: "all", name: "All", count: showEmptyState ? 0 : items.length },
    {
      id: "active",
      name: "Active",
      count: showEmptyState
        ? 0
        : items.filter((p) => p.status === "active").length,
    },
    {
      id: "draft",
      name: "Draft",
      count: showEmptyState
        ? 0
        : items.filter((p) => p.status === "draft").length,
    },
    {
      id: "archived",
      name: "Archived",
      count: showEmptyState
        ? 0
        : items.filter((p) => p.status === "archived").length,
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
    // Apply sorting logic here
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(currentItems.map((p) => p.id));
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
      selectedProducts.forEach((productId) => {
        dispatch(deleteProduct(productId));
      });
      setSelectedProducts([]);
    }
    // Add other bulk actions here
  };

  const handleProductAction = (action, product) => {
    console.log(`Action: ${action} on product:`, product.id);

    switch (action) {
      case "delete":
        dispatch(deleteProduct(product.id));
        break;
      case "duplicate":
        // Add duplicate logic
        break;
      case "edit":
        // Navigate to edit page
        break;
      case "view":
        // Navigate to view page
        break;
    }
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

        <div className="flex justify-center space-x-3 mb-8">
          <Button onClick={() => setShowEmptyState(false)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add product
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>

        <div className="border-t pt-8">
          <h4 className="text-md font-medium text-gray-900 mb-2">
            Find products to sell
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Have dropshipping or print on demand products shipped directly from
            the supplier to your customer, and only pay for what you sell.
          </p>
          <Button variant="outline">Browse product sourcing apps</Button>
        </div>
      </div>
    </div>
  );

  const ProductsTable = () => (
    <div className="overflow-hidden">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-12">
              <input
                type="checkbox"
                checked={
                  selectedProducts.length === currentItems.length &&
                  currentItems.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </Table.Head>
            <Table.Head>Product</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Inventory</Table.Head>
            <Table.Head>Category</Table.Head>
            <Table.Head>Channels</Table.Head>
            <Table.Head className="w-12"></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentItems.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) =>
                    handleSelectProduct(product.id, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">{product.sku}</div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>{getStatusBadge(product.status)}</Table.Cell>
              <Table.Cell>
                <div className="text-sm text-gray-900">
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
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">
                  {product.category}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">2</span>
              </Table.Cell>
              <Table.Cell>
                <Dropdown
                  align="right"
                  trigger={
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                  }
                >
                  <Dropdown.Item
                    onClick={() => handleProductAction("edit", product)}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleProductAction("duplicate", product)}
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                    Duplicate
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleProductAction("view", product)}
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleProductAction("delete", product)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </Dropdown.Item>
                </Dropdown>
              </Table.Cell>
            </Table.Row>
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

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Demo Toggle */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
            <p className="text-sm text-yellow-700">
              Toggle between empty and populated states
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-yellow-700">Show Empty State:</span>
            <button
              onClick={() => setShowEmptyState(!showEmptyState)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showEmptyState ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showEmptyState ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline">Export</Button>
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              Import
            </Button>
            <Dropdown
              trigger={
                <Button variant="outline">
                  More actions
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              }
            >
              {bulkActions.map((action) => (
                <Dropdown.Item
                  key={action.action}
                  onClick={() => handleBulkAction(action.action)}
                  className={
                    action.destructive ? "text-red-600 hover:bg-red-50" : ""
                  }
                >
                  {action.label}
                </Dropdown.Item>
              ))}
            </Dropdown>
            <Button onClick={() => setShowEmptyState(false)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add product
            </Button>
          </div>
        </div>
      </div>

      <Card>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
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
            <button className="text-gray-400 hover:text-gray-600 py-4 px-1">
              <PlusIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>

        {showEmptyState || currentItems.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Filters and Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Searching in all products"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      style={{ width: "300px" }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <FunnelIcon className="h-4 w-4" />
                  </Button>
                  <Dropdown
                    trigger={
                      <Button variant="ghost" size="sm">
                        <ArrowsUpDownIcon className="h-4 w-4" />
                      </Button>
                    }
                  >
                    {sortOptions.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        onClick={() => handleSort(option.value)}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <ProductsTable />

            {/* Footer */}
            {selectedProducts.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} products selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Edit products
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("delete")}
                    >
                      Delete products
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <ImportModal />
    </div>
  );
};

export default ProductsDemo;
