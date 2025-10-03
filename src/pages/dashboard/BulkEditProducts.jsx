import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  XMarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  updateProduct,
  deleteProduct,
  setProducts,
} from "../../store/slices/productsSlice";
import { mockProducts } from "../../data/orderMockData";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";

const BulkEditProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items } = useSelector((state) => state.products);

  const selectedIds = searchParams.get("ids")?.split(",") || [];
  const selectedProducts = items.filter((product) =>
    selectedIds.includes(product.id.toString())
  );

  console.log("URL params:", searchParams.get("ids"));
  console.log("Selected IDs:", selectedIds);
  console.log("All products in store:", items);
  console.log("Selected products:", selectedProducts);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    productType: "",
    vendor: "",
    tagsToAdd: [],
    tagsToRemove: [],
    priceAdjustment: {
      type: "", // 'increase', 'decrease', 'set'
      value: "",
      isPercentage: false,
    },
    inventoryAdjustment: {
      type: "", // 'increase', 'decrease', 'set'
      value: "",
    },
  });

  const [newTag, setNewTag] = useState("");
  const [removeTag, setRemoveTag] = useState("");

  // Load products if not already loaded
  useEffect(() => {
    if (items.length === 0) {
      dispatch(setProducts(mockProducts));
    }
  }, [dispatch, items.length]);

  const breadcrumbItems = [
    { name: "Products", href: "/dashboard/products" },
    { name: `Bulk edit ${selectedProducts.length} products` },
  ];

  const statusOptions = [
    { value: "", label: "No change" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  const priceAdjustmentTypes = [
    { value: "", label: "No change" },
    { value: "increase", label: "Increase by" },
    { value: "decrease", label: "Decrease by" },
    { value: "set", label: "Set to" },
  ];

  const inventoryAdjustmentTypes = [
    { value: "", label: "No change" },
    { value: "increase", label: "Increase by" },
    { value: "decrease", label: "Decrease by" },
    { value: "set", label: "Set to" },
  ];

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setEditData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addTagToAdd = () => {
    if (newTag.trim() && !editData.tagsToAdd.includes(newTag.trim())) {
      setEditData((prev) => ({
        ...prev,
        tagsToAdd: [...prev.tagsToAdd, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTagFromAdd = (tagToRemove) => {
    setEditData((prev) => ({
      ...prev,
      tagsToAdd: prev.tagsToAdd.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addTagToRemove = () => {
    if (removeTag.trim() && !editData.tagsToRemove.includes(removeTag.trim())) {
      setEditData((prev) => ({
        ...prev,
        tagsToRemove: [...prev.tagsToRemove, removeTag.trim()],
      }));
      setRemoveTag("");
    }
  };

  const removeTagFromRemove = (tagToRemove) => {
    setEditData((prev) => ({
      ...prev,
      tagsToRemove: prev.tagsToRemove.filter((tag) => tag !== tagToRemove),
    }));
  };

  const calculateNewPrice = (currentPrice, adjustment) => {
    const current = parseFloat(currentPrice) || 0;
    const value = parseFloat(adjustment.value) || 0;

    switch (adjustment.type) {
      case "increase":
        return adjustment.isPercentage
          ? current * (1 + value / 100)
          : current + value;
      case "decrease":
        return adjustment.isPercentage
          ? current * (1 - value / 100)
          : Math.max(0, current - value);
      case "set":
        return value;
      default:
        return current;
    }
  };

  const calculateNewInventory = (currentInventory, adjustment) => {
    const current = parseInt(currentInventory) || 0;
    const value = parseInt(adjustment.value) || 0;

    switch (adjustment.type) {
      case "increase":
        return current + value;
      case "decrease":
        return Math.max(0, current - value);
      case "set":
        return value;
      default:
        return current;
    }
  };

  const handleSave = () => {
    selectedProducts.forEach((product) => {
      const updatedProduct = { ...product };

      // Update status
      if (editData.status) {
        updatedProduct.status = editData.status;
      }

      // Update product type
      if (editData.productType) {
        updatedProduct.category = editData.productType;
      }

      // Update vendor
      if (editData.vendor) {
        updatedProduct.vendor = editData.vendor;
      }

      // Update tags
      let updatedTags = [...(product.tags || [])];

      // Add new tags
      editData.tagsToAdd.forEach((tag) => {
        if (!updatedTags.includes(tag)) {
          updatedTags.push(tag);
        }
      });

      // Remove tags
      editData.tagsToRemove.forEach((tag) => {
        updatedTags = updatedTags.filter((t) => t !== tag);
      });

      if (editData.tagsToAdd.length > 0 || editData.tagsToRemove.length > 0) {
        updatedProduct.tags = updatedTags;
      }

      // Update price
      if (editData.priceAdjustment.type && editData.priceAdjustment.value) {
        updatedProduct.price = calculateNewPrice(
          product.price,
          editData.priceAdjustment
        );
      }

      // Update inventory
      if (
        editData.inventoryAdjustment.type &&
        editData.inventoryAdjustment.value
      ) {
        updatedProduct.inventory = calculateNewInventory(
          product.inventory,
          editData.inventoryAdjustment
        );
      }

      updatedProduct.updatedAt = new Date().toISOString();
      dispatch(updateProduct(updatedProduct));
    });

    navigate("/dashboard/products");
  };

  const handleDelete = () => {
    selectedProducts.forEach((product) => {
      dispatch(deleteProduct(product.id));
    });
    navigate("/dashboard/products");
  };

  const DeleteModal = () => (
    <Modal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      title="Delete products"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Delete {selectedProducts.length} products?
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete products
          </Button>
        </div>
      </div>
    </Modal>
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">
          Loading products...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we load the product data.
        </p>
      </div>
    );
  }

  if (selectedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900">
          No products selected
        </h2>
        <p className="text-gray-500 mt-2">
          Please select products from the products page to bulk edit them.
        </p>
        <p className="text-gray-400 mt-1 text-sm">
          Debug: URL IDs: {selectedIds.join(", ")}, Store has {items.length}{" "}
          products
        </p>
        <Button
          onClick={() => navigate("/dashboard/products")}
          className="mt-4"
        >
          Go to Products
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Bulk edit {selectedProducts.length} products
          </h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete all
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/products")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Product status</h3>
            </Card.Header>
            <Card.Content>
              <div className="relative">
                <select
                  value={editData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </Card.Content>
          </Card>

          {/* Organization */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Organization</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Input
                label="Product type"
                value={editData.productType}
                onChange={(e) =>
                  handleInputChange("productType", e.target.value)
                }
                placeholder="Leave empty for no change"
              />

              <Input
                label="Vendor"
                value={editData.vendor}
                onChange={(e) => handleInputChange("vendor", e.target.value)}
                placeholder="Leave empty for no change"
              />
            </Card.Content>
          </Card>

          {/* Tags */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Tags</h3>
            </Card.Header>
            <Card.Content className="space-y-6">
              {/* Add Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editData.tagsToAdd.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="success"
                      className="flex items-center gap-1"
                    >
                      + {tag}
                      <button onClick={() => removeTagFromAdd(tag)}>
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTagToAdd())
                    }
                  />
                  <Button variant="outline" onClick={addTagToAdd}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Remove Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remove tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editData.tagsToRemove.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      - {tag}
                      <button onClick={() => removeTagFromRemove(tag)}>
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={removeTag}
                    onChange={(e) => setRemoveTag(e.target.value)}
                    placeholder="Remove tag..."
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addTagToRemove())
                    }
                  />
                  <Button variant="outline" onClick={addTagToRemove}>
                    Remove
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Pricing */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Pricing</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    value={editData.priceAdjustment.type}
                    onChange={(e) =>
                      handleInputChange(
                        "type",
                        e.target.value,
                        "priceAdjustment"
                      )
                    }
                    className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    {priceAdjustmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <Input
                  type="number"
                  step="0.01"
                  value={editData.priceAdjustment.value}
                  onChange={(e) =>
                    handleInputChange(
                      "value",
                      e.target.value,
                      "priceAdjustment"
                    )
                  }
                  placeholder="Amount"
                  disabled={!editData.priceAdjustment.type}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="percentage"
                    checked={editData.priceAdjustment.isPercentage}
                    onChange={(e) =>
                      handleInputChange(
                        "isPercentage",
                        e.target.checked,
                        "priceAdjustment"
                      )
                    }
                    disabled={
                      !editData.priceAdjustment.type ||
                      editData.priceAdjustment.type === "set"
                    }
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="percentage"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Percentage
                  </label>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Inventory */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Inventory</h3>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    value={editData.inventoryAdjustment.type}
                    onChange={(e) =>
                      handleInputChange(
                        "type",
                        e.target.value,
                        "inventoryAdjustment"
                      )
                    }
                    className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 pr-8"
                  >
                    {inventoryAdjustmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <Input
                  type="number"
                  value={editData.inventoryAdjustment.value}
                  onChange={(e) =>
                    handleInputChange(
                      "value",
                      e.target.value,
                      "inventoryAdjustment"
                    )
                  }
                  placeholder="Quantity"
                  disabled={!editData.inventoryAdjustment.type}
                />
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Selected products</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ${product.price} • {product.inventory} in stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Changes Preview */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Changes preview</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                {editData.status && (
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {editData.status}
                  </div>
                )}
                {editData.productType && (
                  <div>
                    <span className="font-medium">Product type:</span>{" "}
                    {editData.productType}
                  </div>
                )}
                {editData.vendor && (
                  <div>
                    <span className="font-medium">Vendor:</span>{" "}
                    {editData.vendor}
                  </div>
                )}
                {editData.tagsToAdd.length > 0 && (
                  <div>
                    <span className="font-medium">Add tags:</span>{" "}
                    {editData.tagsToAdd.join(", ")}
                  </div>
                )}
                {editData.tagsToRemove.length > 0 && (
                  <div>
                    <span className="font-medium">Remove tags:</span>{" "}
                    {editData.tagsToRemove.join(", ")}
                  </div>
                )}
                {editData.priceAdjustment.type &&
                  editData.priceAdjustment.value && (
                    <div>
                      <span className="font-medium">Price:</span>{" "}
                      {editData.priceAdjustment.type} by{" "}
                      {editData.priceAdjustment.value}
                      {editData.priceAdjustment.isPercentage ? "%" : ""}
                    </div>
                  )}
                {editData.inventoryAdjustment.type &&
                  editData.inventoryAdjustment.value && (
                    <div>
                      <span className="font-medium">Inventory:</span>{" "}
                      {editData.inventoryAdjustment.type} by{" "}
                      {editData.inventoryAdjustment.value}
                    </div>
                  )}
                {!editData.status &&
                  !editData.productType &&
                  !editData.vendor &&
                  editData.tagsToAdd.length === 0 &&
                  editData.tagsToRemove.length === 0 &&
                  !editData.priceAdjustment.type &&
                  !editData.inventoryAdjustment.type && (
                    <div className="text-gray-500">No changes selected</div>
                  )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>

      <DeleteModal />
    </div>
  );
};

export default BulkEditProducts;
