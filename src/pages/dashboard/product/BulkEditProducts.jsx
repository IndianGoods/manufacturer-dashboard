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
} from "../../../store/slices/productsSlice";
import { mockProducts } from "../../../data/orderMockData";
import Breadcrumbs from "../../../components/layout/Breadcrumbs";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Modal from "../../../components/ui/Modal";

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
    title: "",
    category: "",
    subCategory: "",
    sku: "",
    description: "",
    specifications: {
      material: "",
      modelNumber: "",
      packing: "",
      moq: "",
      package: "",
      singlePackageSize: "",
      singleGrossWeight: "",
      recommendedAge: "",
      gender: "",
    },
    tagsToAdd: [],
    tagsToRemove: [],
    images: [],
    priceAdjustment: {
      type: "", // 'increase', 'decrease', 'set'
      value: "",
      isPercentage: false,
    },
    compareAtPrice: "",
    mrp: "",
    cost: "",
    inventoryAdjustment: {
      type: "", // 'increase', 'decrease', 'set'
      value: "",
    },
    hasVariants: false,
    variants: [],
    seo: {
      title: "",
      description: "",
      url: "",
    },
    status: "",
  });

  const [newTag, setNewTag] = useState("");
  const [removeTag, setRemoveTag] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [variantImages, setVariantImages] = useState({});

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

      // Update all fields if set in editData
      if (editData.title) updatedProduct.title = editData.title;
      if (editData.category) updatedProduct.category = editData.category;
      if (editData.subCategory) updatedProduct.subCategory = editData.subCategory;
      if (editData.sku) updatedProduct.sku = editData.sku;
      if (editData.description) updatedProduct.description = editData.description;
      if (editData.status) updatedProduct.status = editData.status;

      // Specifications
      Object.keys(editData.specifications).forEach((key) => {
        if (editData.specifications[key]) {
          updatedProduct.specifications = updatedProduct.specifications || {};
          updatedProduct.specifications[key] = editData.specifications[key];
        }
      });

      // SEO
      Object.keys(editData.seo).forEach((key) => {
        if (editData.seo[key]) {
          updatedProduct.seo = updatedProduct.seo || {};
          updatedProduct.seo[key] = editData.seo[key];
        }
      });

      // Tags
      let updatedTags = [...(product.tags || [])];
      editData.tagsToAdd.forEach((tag) => {
        if (!updatedTags.includes(tag)) {
          updatedTags.push(tag);
        }
      });
      editData.tagsToRemove.forEach((tag) => {
        updatedTags = updatedTags.filter((t) => t !== tag);
      });
      if (editData.tagsToAdd.length > 0 || editData.tagsToRemove.length > 0) {
        updatedProduct.tags = updatedTags;
      }

      // Images
      if (uploadedImages.length > 0) {
        updatedProduct.images = uploadedImages.map((img) => ({ url: img.url, id: img.id }));
      }

      // Price fields
      if (editData.priceAdjustment.type && editData.priceAdjustment.value) {
        updatedProduct.price = calculateNewPrice(product.price, editData.priceAdjustment);
      }
      if (editData.compareAtPrice) updatedProduct.compareAtPrice = editData.compareAtPrice;
      if (editData.mrp) updatedProduct.mrp = editData.mrp;
      if (editData.cost) updatedProduct.cost = editData.cost;

      // Inventory
      if (editData.inventoryAdjustment.type && editData.inventoryAdjustment.value) {
        updatedProduct.inventory = calculateNewInventory(product.inventory, editData.inventoryAdjustment);
      }

      // Variants
      if (editData.hasVariants) {
        updatedProduct.hasVariants = true;
        if (editData.variants.length > 0) {
          updatedProduct.variants = editData.variants;
        }
        if (Object.keys(variantImages).length > 0) {
          updatedProduct.variants = updatedProduct.variants.map((variant, idx) => ({
            ...variant,
            images: variantImages[idx] ? variantImages[idx].map((img) => ({ url: img.url, id: img.id })) : variant.images,
          }));
        }
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
          {/* Title */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Title</h3>
            </Card.Header>
            <Card.Content>
              <Input
                label="Title"
                value={editData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Set title for all selected products"
              />
            </Card.Content>
          </Card>
          {/* Category & Sub-Category */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Category</h3>
            </Card.Header>
            <Card.Content className="grid grid-cols-2 gap-4">
              <Input
                label="Category"
                value={editData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="Set category for all"
              />
              <Input
                label="Sub-Category"
                value={editData.subCategory}
                onChange={(e) => handleInputChange("subCategory", e.target.value)}
                placeholder="Set sub-category for all"
              />
            </Card.Content>
          </Card>
          {/* SKU */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">SKU</h3>
            </Card.Header>
            <Card.Content>
              <Input
                label="SKU"
                value={editData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Set SKU for all"
              />
            </Card.Content>
          </Card>
          {/* Description */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Description</h3>
            </Card.Header>
            <Card.Content>
              <Input
                label="Description"
                value={editData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Set description for all"
              />
            </Card.Content>
          </Card>
          {/* Specifications */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Specifications</h3>
            </Card.Header>
            <Card.Content className="grid grid-cols-2 gap-4">
              <Input label="Material" value={editData.specifications.material} onChange={(e) => handleInputChange("material", e.target.value, "specifications")} placeholder="Material" />
              <Input label="Model Number" value={editData.specifications.modelNumber} onChange={(e) => handleInputChange("modelNumber", e.target.value, "specifications")} placeholder="Model Number" />
              <Input label="Packing" value={editData.specifications.packing} onChange={(e) => handleInputChange("packing", e.target.value, "specifications")} placeholder="Packing" />
              <Input label="MOQ" value={editData.specifications.moq} onChange={(e) => handleInputChange("moq", e.target.value, "specifications")} placeholder="MOQ" />
              <Input label="Package" value={editData.specifications.package} onChange={(e) => handleInputChange("package", e.target.value, "specifications")} placeholder="Package" />
              <Input label="Single Package Size" value={editData.specifications.singlePackageSize} onChange={(e) => handleInputChange("singlePackageSize", e.target.value, "specifications")} placeholder="Single Package Size" />
              <Input label="Single Gross Weight" value={editData.specifications.singleGrossWeight} onChange={(e) => handleInputChange("singleGrossWeight", e.target.value, "specifications")} placeholder="Single Gross Weight" />
              <Input label="Recommended Age" value={editData.specifications.recommendedAge} onChange={(e) => handleInputChange("recommendedAge", e.target.value, "specifications")} placeholder="Recommended Age" />
              <Input label="Gender" value={editData.specifications.gender} onChange={(e) => handleInputChange("gender", e.target.value, "specifications")} placeholder="Gender" />
            </Card.Content>
          </Card>
          {/* Tags */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Tags</h3>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap gap-2 mb-2">
                {editData.tagsToAdd.map((tag, index) => (
                  <Badge key={index} variant="success" className="flex items-center gap-1">
                    + {tag}
                    <button onClick={() => removeTagFromAdd(tag)}>
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag..." onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTagToAdd())} />
                <Button variant="outline" onClick={addTagToAdd}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {editData.tagsToRemove.map((tag, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    - {tag}
                    <button onClick={() => removeTagFromRemove(tag)}>
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={removeTag} onChange={(e) => setRemoveTag(e.target.value)} placeholder="Remove tag..." onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTagToRemove())} />
                <Button variant="outline" onClick={addTagToRemove}>Remove</Button>
              </div>
            </Card.Content>
          </Card>
          {/* Price, Compare at Price, MRP, Cost */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Pricing</h3>
            </Card.Header>
            <Card.Content className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Adjustment</label>
                <select value={editData.priceAdjustment.type} onChange={(e) => handleInputChange("type", e.target.value, "priceAdjustment")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  {priceAdjustmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <Input type="number" step="0.01" value={editData.priceAdjustment.value} onChange={(e) => handleInputChange("value", e.target.value, "priceAdjustment")} placeholder="Amount" disabled={!editData.priceAdjustment.type} />
                <div className="flex items-center mt-2">
                  <input type="checkbox" id="percentage" checked={editData.priceAdjustment.isPercentage} onChange={(e) => handleInputChange("isPercentage", e.target.checked, "priceAdjustment")} disabled={!editData.priceAdjustment.type || editData.priceAdjustment.type === "set"} className="rounded border-gray-300 text-primary-600" />
                  <label htmlFor="percentage" className="ml-2 text-sm text-gray-700">Percentage</label>
                </div>
              </div>
              <Input label="Compare at Price" type="number" step="0.01" value={editData.compareAtPrice} onChange={(e) => handleInputChange("compareAtPrice", e.target.value)} placeholder="Compare at Price" />
              <Input label="MRP" type="number" step="0.01" value={editData.mrp} onChange={(e) => handleInputChange("mrp", e.target.value)} placeholder="MRP" />
              <Input label="Cost per item" type="number" step="0.01" value={editData.cost} onChange={(e) => handleInputChange("cost", e.target.value)} placeholder="Cost per item" />
            </Card.Content>
          </Card>
          {/* Inventory */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Inventory</h3>
            </Card.Header>
            <Card.Content className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inventory Adjustment</label>
                <select value={editData.inventoryAdjustment.type} onChange={(e) => handleInputChange("type", e.target.value, "inventoryAdjustment")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                  {inventoryAdjustmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <Input type="number" value={editData.inventoryAdjustment.value} onChange={(e) => handleInputChange("value", e.target.value, "inventoryAdjustment")} placeholder="Quantity" disabled={!editData.inventoryAdjustment.type} />
              </div>
            </Card.Content>
          </Card>
          {/* SEO */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">SEO</h3>
            </Card.Header>
            <Card.Content className="grid grid-cols-2 gap-4">
              <Input label="SEO Title" value={editData.seo.title} onChange={(e) => handleInputChange("title", e.target.value, "seo")} placeholder="SEO Title" />
              <Input label="SEO Description" value={editData.seo.description} onChange={(e) => handleInputChange("description", e.target.value, "seo")} placeholder="SEO Description" />
              <Input label="SEO URL" value={editData.seo.url} onChange={(e) => handleInputChange("url", e.target.value, "seo")} placeholder="SEO URL" />
            </Card.Content>
          </Card>
          {/* Status */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Product status</h3>
            </Card.Header>
            <Card.Content>
              <select value={editData.status} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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
                  <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-500">${product.price} • {product.inventory} in stock</p>
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
                {editData.title && (<div><span className="font-medium">Title:</span> {editData.title}</div>)}
                {editData.category && (<div><span className="font-medium">Category:</span> {editData.category}</div>)}
                {editData.subCategory && (<div><span className="font-medium">Sub-Category:</span> {editData.subCategory}</div>)}
                {editData.sku && (<div><span className="font-medium">SKU:</span> {editData.sku}</div>)}
                {editData.description && (<div><span className="font-medium">Description:</span> {editData.description}</div>)}
                {Object.values(editData.specifications).some((v) => v) && (<div><span className="font-medium">Specifications:</span> {Object.entries(editData.specifications).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(", ")}</div>)}
                {editData.tagsToAdd.length > 0 && (<div><span className="font-medium">Add tags:</span> {editData.tagsToAdd.join(", ")}</div>)}
                {editData.tagsToRemove.length > 0 && (<div><span className="font-medium">Remove tags:</span> {editData.tagsToRemove.join(", ")}</div>)}
                {editData.priceAdjustment.type && editData.priceAdjustment.value && (<div><span className="font-medium">Price:</span> {editData.priceAdjustment.type} by {editData.priceAdjustment.value}{editData.priceAdjustment.isPercentage ? "%" : ""}</div>)}
                {editData.compareAtPrice && (<div><span className="font-medium">Compare at Price:</span> {editData.compareAtPrice}</div>)}
                {editData.mrp && (<div><span className="font-medium">MRP:</span> {editData.mrp}</div>)}
                {editData.cost && (<div><span className="font-medium">Cost per item:</span> {editData.cost}</div>)}
                {editData.inventoryAdjustment.type && editData.inventoryAdjustment.value && (<div><span className="font-medium">Inventory:</span> {editData.inventoryAdjustment.type} by {editData.inventoryAdjustment.value}</div>)}
                {Object.values(editData.seo).some((v) => v) && (<div><span className="font-medium">SEO:</span> {Object.entries(editData.seo).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(", ")}</div>)}
                {editData.status && (<div><span className="font-medium">Status:</span> {editData.status}</div>)}
                {!editData.title && !editData.category && !editData.subCategory && !editData.sku && !editData.description && Object.values(editData.specifications).every((v) => !v) && editData.tagsToAdd.length === 0 && editData.tagsToRemove.length === 0 && !editData.priceAdjustment.type && !editData.compareAtPrice && !editData.mrp && !editData.cost && !editData.inventoryAdjustment.type && Object.values(editData.seo).every((v) => !v) && !editData.status && (<div className="text-gray-500">No changes selected</div>)}
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
